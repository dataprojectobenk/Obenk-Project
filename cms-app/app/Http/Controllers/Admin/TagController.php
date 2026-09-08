<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Tag::withCount('posts');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $tags = $query->orderBy('name')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Tags/Index', [
            'tags' => $tags,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:tags,slug'],
        ]);

        $slug = ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);

        Tag::create([
            'name' => $validated['name'],
            'slug' => $slug,
        ]);

        return redirect()->route('admin.tags.index')->with('success', 'Tag berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:tags,slug,'.$tag->id],
        ]);

        $slug = ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);

        $tag->update([
            'name' => $validated['name'],
            'slug' => $slug,
        ]);

        return redirect()->route('admin.tags.index')->with('success', 'Tag berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->posts()->detach();
        $tag->delete();

        return redirect()->route('admin.tags.index')->with('success', 'Tag berhasil dihapus.');
    }
}
