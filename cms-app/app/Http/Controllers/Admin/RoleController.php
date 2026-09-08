<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $roles = Role::with(['permissions:id,name,slug,module_group'])
            ->withCount('users')
            ->orderBy('id')
            ->get();

        $allPermissions = Permission::orderBy('module_group')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'module_group'])
            ->groupBy('module_group');

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'grouped_permissions' => $allPermissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:roles,slug'],
            'description' => ['nullable', 'string', 'max:500'],
            'permission_ids' => ['nullable', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $slug = ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
        ]);

        if (! empty($validated['permission_ids'])) {
            $role->permissions()->sync($validated['permission_ids']);
        }

        return redirect()->route('admin.roles.index')->with('success', 'Peran (Role) berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:roles,slug,'.$role->id],
            'description' => ['nullable', 'string', 'max:500'],
            'permission_ids' => ['nullable', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $slug = ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);

        $role->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
        ]);

        $role->permissions()->sync($validated['permission_ids'] ?? []);

        return redirect()->route('admin.roles.index')->with('success', 'Peran (Role) dan hak akses berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->slug, ['super-admin', 'admin'])) {
            return redirect()->back()->with('error', 'Peran bawaan sistem tidak dapat dihapus.');
        }

        if ($role->users()->count() > 0) {
            return redirect()->back()->with('error', 'Peran ini masih memiliki pengguna yang terkait.');
        }

        $role->permissions()->detach();
        $role->delete();

        return redirect()->route('admin.roles.index')->with('success', 'Peran berhasil dihapus.');
    }
}
