<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Contracts\View\View;

class HomeController extends Controller
{
    /**
     * Display the CMS public homepage.
     */
    public function index(): View
    {
        // 1. Featured Post for hero section
        $featuredPost = Post::published()
            ->where('is_featured', true)
            ->with(['author:id,name,username,avatar_url', 'category:id,name,slug', 'featuredImage', 'tags:id,name,slug'])
            ->latest('published_at')
            ->first();

        // Fallback to latest post if no post is explicitly marked as featured
        if (! $featuredPost) {
            $featuredPost = Post::published()
                ->with(['author:id,name,username,avatar_url', 'category:id,name,slug', 'featuredImage', 'tags:id,name,slug'])
                ->latest('published_at')
                ->first();
        }

        // 2. Recent published posts (exclude featured post from the grid if present)
        $recentPosts = Post::published()
            ->when($featuredPost, fn ($query) => $query->where('id', '!=', $featuredPost->id))
            ->with(['author:id,name,username,avatar_url', 'category:id,name,slug', 'featuredImage', 'tags:id,name,slug'])
            ->latest('published_at')
            ->take(6)
            ->get();

        // 3. Featured Categories with post counts
        $categories = Category::whereNull('parent_id')
            ->whereHas('posts', fn ($q) => $q->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now()))
            ->withCount(['posts' => fn ($q) => $q->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now())])
            ->orderByDesc('posts_count')
            ->take(6)
            ->get();

        return view('home', compact('featuredPost', 'recentPosts', 'categories'));
    }
}
