<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Contracts\View\View;

class AuthorController extends Controller
{
    /**
     * Display author profile and their published articles.
     */
    public function show(string $username): View
    {
        $author = User::where('username', $username)
            ->where('status', 'active')
            ->firstOrFail();

        $postsPerPage = (int) Setting::get('posts_per_page', 12);
        if ($postsPerPage < 1) {
            $postsPerPage = 12;
        }

        $posts = Post::published()
            ->where('author_id', $author->id)
            ->with(['category:id,name,slug', 'featuredImage', 'tags:id,name,slug'])
            ->latest('published_at')
            ->paginate($postsPerPage);

        $totalViews = Post::published()
            ->where('author_id', $author->id)
            ->sum('view_count');

        return view('author.show', compact('author', 'posts', 'totalViews'));
    }
}
