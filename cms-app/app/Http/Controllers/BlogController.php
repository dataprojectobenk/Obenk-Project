<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\Setting;
use App\Models\Tag;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class BlogController extends Controller
{
    /**
     * Display a listing of blog posts with search and filter capabilities.
     */
    public function index(Request $request): View
    {
        $searchQuery = trim($request->input('q', ''));
        $categorySlug = $request->input('category');
        $tagSlug = $request->input('tag');

        $postsPerPage = (int) Setting::get('posts_per_page', 12);
        if ($postsPerPage < 1) {
            $postsPerPage = 12;
        }

        $activeCategory = null;
        if ($categorySlug) {
            $activeCategory = Category::where('slug', $categorySlug)->first();
        }

        $activeTag = null;
        if ($tagSlug) {
            $activeTag = Tag::where('slug', $tagSlug)->first();
        }

        $posts = Post::published()
            ->with(['author:id,name,username,avatar_url', 'category:id,name,slug', 'featuredImage', 'tags:id,name,slug'])
            ->when($searchQuery, function ($query, $q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('title', 'like', "%{$q}%")
                        ->orWhere('excerpt', 'like', "%{$q}%")
                        ->orWhere('content', 'like', "%{$q}%");
                });
            })
            ->when($activeCategory, function ($query, $cat) {
                $categoryIds = Category::where('id', $cat->id)
                    ->orWhere('parent_id', $cat->id)
                    ->pluck('id');
                $query->whereIn('category_id', $categoryIds);
            })
            ->when($activeTag, function ($query, $tag) {
                $query->whereHas('tags', fn ($q) => $q->where('tags.id', $tag->id));
            })
            ->latest('published_at')
            ->paginate($postsPerPage)
            ->withQueryString();

        $categories = Category::whereNull('parent_id')
            ->whereHas('posts', fn ($q) => $q->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now()))
            ->withCount(['posts' => fn ($q) => $q->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now())])
            ->get();

        $tags = Tag::has('posts')->get();

        return view('blog.index', compact(
            'posts',
            'categories',
            'tags',
            'searchQuery',
            'activeCategory',
            'activeTag'
        ));
    }

    /**
     * Display a single post detail view.
     */
    public function show(string $slug): View
    {
        $post = Post::published()
            ->where('slug', $slug)
            ->with([
                'author:id,name,username,avatar_url,bio',
                'category:id,name,slug,description',
                'featuredImage',
                'tags:id,name,slug',
                'approvedComments.user:id,name,username,avatar_url',
                'approvedComments.approvedReplies.user:id,name,username,avatar_url',
            ])
            ->firstOrFail();

        // Increment view count guarded by session to avoid multi-counting
        $viewedPosts = Session::get('viewed_posts', []);
        if (! in_array($post->id, $viewedPosts, true)) {
            $post->increment('view_count');
            Session::push('viewed_posts', $post->id);
        }

        // Related articles in same category
        $relatedPosts = Post::published()
            ->where('id', '!=', $post->id)
            ->when($post->category_id, fn ($q) => $q->where('category_id', $post->category_id))
            ->with(['author:id,name,username,avatar_url', 'category:id,name,slug', 'featuredImage', 'tags:id,name,slug'])
            ->latest('published_at')
            ->take(3)
            ->get();

        return view('blog.show', compact('post', 'relatedPosts'));
    }
}
