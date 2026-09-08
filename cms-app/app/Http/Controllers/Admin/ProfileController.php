<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $user->load('roles:id,name,slug');

        return Inertia::render('Admin/Profile/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'bio' => $user->bio,
                'avatar' => $user->avatar,
                'status' => $user->status,
                'roles' => $user->roles->pluck('name'),
                'created_at' => $user->created_at?->toISOString(),
            ],
        ]);
    }

    /**
     * Update the user's general profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:50', 'alpha_dash', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'bio' => ['nullable', 'string', 'max:1000'],
            'avatar' => ['nullable', 'image', 'max:2048'], // Max 2MB
        ]);

        $oldValues = [
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'bio' => $user->bio,
            'avatar_url' => $user->avatar_url,
        ];

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = Str::uuid() . '.' . ($file->getClientOriginalExtension() ?: 'jpg');
            $path = $file->storeAs('uploads/avatars', $filename, 'public');

            // Delete old avatar if it exists on public disk
            if ($user->avatar_url && str_contains($user->avatar_url, 'uploads/avatars/')) {
                $oldPath = str_replace('/storage/', '', parse_url($user->avatar_url, PHP_URL_PATH) ?? '');
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $user->avatar_url = Storage::disk('public')->url($path);
        }

        $user->name = $validated['name'];
        $user->username = $validated['username'];
        $user->email = $validated['email'];
        $user->bio = $validated['bio'] ?? null;
        $user->save();

        ActivityLog::record(
            'Perbarui Profil Pengguna',
            $user,
            $oldValues,
            [
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'bio' => $user->bio,
                'avatar_url' => $user->avatar_url,
            ],
            $user
        );

        return redirect()->back()->with('success', 'Informasi profil berhasil diperbarui.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user = $request->user();
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        ActivityLog::record(
            'Ubah Kata Sandi Pengguna',
            $user,
            null,
            ['password' => '********'],
            $user
        );

        return redirect()->back()->with('success', 'Kata sandi akun Anda berhasil diperbarui.');
    }
}

