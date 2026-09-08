<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\Setting;
use Illuminate\Contracts\View\View;

class CategoryController extends Controller
{
    /**
     * Display posts belonging to a specific category.
     */
    public function show(string $slug): View
    {
        $category = Category::where('slug', $slug)
            ->with(['children' => fn ($q) => $q->withCount(['posts' => fn ($p) => $p->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now())])])
            ->firstOrFail();

        $postsPerPage = (int) Setting::get('posts_per_page', 12);
        if ($postsPerPage < 1) {
            $postsPerPage = 12;
        }

        $categoryIds = Category::where('id', $category->id)
            ->orWhere('parent_id', $category->id)
            ->pluck('id');

        $posts = Post::published()
            ->whereIn('category_id', $categoryIds)
            ->with(['author:id,name,username,avatar_url', 'category:id,name,slug', 'featuredImage', 'tags:id,name,slug'])
            ->latest('published_at')
            ->paginate($postsPerPage);

        return view('category.show', compact('category', 'posts'));
    }
}
