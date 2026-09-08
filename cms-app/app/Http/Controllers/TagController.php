<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Setting;
use App\Models\Tag;
use Illuminate\Contracts\View\View;

class TagController extends Controller
{
    /**
     * Display posts associated with a specific tag.
     */
    public function show(string $slug): View
    {
        $tag = Tag::where('slug', $slug)->firstOrFail();

        $postsPerPage = (int) Setting::get('posts_per_page', 12);
        if ($postsPerPage < 1) {
            $postsPerPage = 12;
        }

        $posts = Post::published()
            ->whereHas('tags', fn ($q) => $q->where('tags.id', $tag->id))
            ->with(['author:id,name,username,avatar_url', 'category:id,name,slug', 'featuredImage', 'tags:id,name,slug'])
            ->latest('published_at')
            ->paginate($postsPerPage);

        return view('tag.show', compact('tag', 'posts'));
    }
}
