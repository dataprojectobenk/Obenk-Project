<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Post::with(['author:id,name,username', 'category:id,name,slug', 'featuredImage'])
            ->withCount('comments');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        $posts = $query->latest('id')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
            'filters' => $request->only(['search', 'status', 'category_id']),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Posts/Form', [
            'post' => null,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'tags' => Tag::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'featured_image_id' => ['nullable', 'exists:media,id'],
            'status' => ['required', 'in:draft,published,archived'],
            'visibility' => ['required', 'in:public,private,password'],
            'is_featured' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:255'],
            'seo_keywords' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:tags,id'],
        ]);

        $slug = ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['title']);
        $uniqueSlug = $slug;
        $count = 1;
        while (Post::where('slug', $uniqueSlug)->exists()) {
            $uniqueSlug = "{$slug}-{$count}";
            $count++;
        }

        $wordCount = str_word_count(strip_tags($validated['content']));
        $readingTime = max(1, (int) ceil($wordCount / 200));

        $publishedAt = $validated['published_at'] ?? null;
        if ($validated['status'] === 'published') {
            if (! $publishedAt) {
                $publishedAt = now();
            } else {
                $parsedDate = \Illuminate\Support\Carbon::parse($publishedAt);
                // If the selected datetime is within 2 minutes of now (e.g. slight browser-server clock difference),
                // align it to now() so it is immediately published rather than stuck in scheduled status
                if ($parsedDate->isFuture() && now()->diffInSeconds($parsedDate) <= 120) {
                    $publishedAt = now();
                } else {
                    $publishedAt = $parsedDate;
                }
            }
        }

        $post = Post::create([
            'author_id' => Auth::id(),
            'category_id' => $validated['category_id'] ?? null,
            'featured_image_id' => $validated['featured_image_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $uniqueSlug,
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'],
            'status' => $validated['status'],
            'visibility' => $validated['visibility'],
            'is_featured' => $validated['is_featured'] ?? false,
            'reading_time' => $readingTime,
            'published_at' => $publishedAt,
            'seo_title' => $validated['seo_title'] ?? null,
            'seo_description' => $validated['seo_description'] ?? null,
            'seo_keywords' => $validated['seo_keywords'] ?? null,
        ]);

        if (! empty($validated['tags'])) {
            $post->tags()->sync($validated['tags']);
        }

        return redirect()->route('admin.posts.index')->with('success', 'Artikel berhasil diterbitkan/disimpan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post): Response
    {
        $post->load(['tags:id,name', 'featuredImage']);

        return Inertia::render('Admin/Posts/Form', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'category_id' => $post->category_id,
                'featured_image_id' => $post->featured_image_id,
                'featured_image' => $post->featuredImage ? [
                    'id' => $post->featuredImage->id,
                    'url' => $post->featuredImage->url,
                    'file_name' => $post->featuredImage->file_name,
                ] : null,
                'status' => $post->status,
                'visibility' => $post->visibility,
                'is_featured' => (bool) $post->is_featured,
                'published_at' => $post->published_at ? $post->published_at->format('Y-m-d\TH:i') : null,
                'seo_title' => $post->seo_title,
                'seo_description' => $post->seo_description,
                'seo_keywords' => $post->seo_keywords,
                'tag_ids' => $post->tags->pluck('id')->toArray(),
            ],
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'tags' => Tag::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug,'.$post->id],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'featured_image_id' => ['nullable', 'exists:media,id'],
            'status' => ['required', 'in:draft,published,archived'],
            'visibility' => ['required', 'in:public,private,password'],
            'is_featured' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:255'],
            'seo_keywords' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:tags,id'],
        ]);

        $slug = ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['title']);
        if ($slug !== $post->slug) {
            $uniqueSlug = $slug;
            $count = 1;
            while (Post::where('slug', $uniqueSlug)->where('id', '!=', $post->id)->exists()) {
                $uniqueSlug = "{$slug}-{$count}";
                $count++;
            }
            $slug = $uniqueSlug;
        }

        $wordCount = str_word_count(strip_tags($validated['content']));
        $readingTime = max(1, (int) ceil($wordCount / 200));

        $publishedAt = $validated['published_at'] ?? $post->published_at;
        if ($validated['status'] === 'published') {
            if (! $publishedAt) {
                $publishedAt = now();
            } else {
                $parsedDate = \Illuminate\Support\Carbon::parse($publishedAt);
                if ($parsedDate->isFuture() && now()->diffInSeconds($parsedDate) <= 120) {
                    $publishedAt = now();
                } else {
                    $publishedAt = $parsedDate;
                }
            }
        }

        $post->update([
            'category_id' => $validated['category_id'] ?? null,
            'featured_image_id' => $validated['featured_image_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'],
            'status' => $validated['status'],
            'visibility' => $validated['visibility'],
            'is_featured' => $validated['is_featured'] ?? false,
            'reading_time' => $readingTime,
            'published_at' => $publishedAt,
            'seo_title' => $validated['seo_title'] ?? null,
            'seo_description' => $validated['seo_description'] ?? null,
            'seo_keywords' => $validated['seo_keywords'] ?? null,
        ]);

        $post->tags()->sync($validated['tags'] ?? []);

        return redirect()->route('admin.posts.index')->with('success', 'Artikel berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('admin.posts.index')->with('success', 'Artikel berhasil dipindahkan ke tempat sampah.');
    }
}
