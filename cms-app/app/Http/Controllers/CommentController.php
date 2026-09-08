<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Store a new comment or reply for a post.
     */
    public function store(Request $request, string $slug): RedirectResponse
    {
        $post = Post::published()->where('slug', $slug)->firstOrFail();

        // Honeypot anti-spam verification
        if ($request->filled('website_hp')) {
            return back()->with('error', 'Spam detected.');
        }

        $isLoggedIn = Auth::check();

        $validated = $request->validate([
            'content' => ['required', 'string', 'min:3', 'max:2000'],
            'parent_id' => ['nullable', 'integer', 'exists:comments,id'],
            'author_name' => [$isLoggedIn ? 'nullable' : 'required', 'string', 'max:100'],
            'author_email' => [$isLoggedIn ? 'nullable' : 'required', 'email', 'max:150'],
            'author_url' => ['nullable', 'url', 'max:255'],
        ]);

        $autoApprove = Setting::get('comments_auto_approve', 'false') === 'true';
        $status = $autoApprove ? 'approved' : 'pending';

        // Check parent comment if replying
        $parentId = $validated['parent_id'] ?? null;
        if ($parentId) {
            $parentComment = Comment::where('id', $parentId)
                ->where('post_id', $post->id)
                ->first();

            if (! $parentComment) {
                return back()->with('error', 'Komentar induk tidak valid.');
            }
        }

        Comment::create([
            'post_id' => $post->id,
            'user_id' => $isLoggedIn ? Auth::id() : null,
            'parent_id' => $parentId,
            'author_name' => $isLoggedIn ? null : strip_tags($validated['author_name']),
            'author_email' => $isLoggedIn ? null : $validated['author_email'],
            'author_url' => $isLoggedIn ? null : ($validated['author_url'] ?? null),
            'author_ip' => $request->ip(),
            'content' => strip_tags($validated['content']),
            'status' => $status,
        ]);

        $message = $status === 'approved'
            ? 'Komentar Anda berhasil diterbitkan.'
            : 'Terima kasih! Komentar Anda telah dikirim dan sedang menunggu moderasi.';

        return redirect()->to(route('blog.show', $post->slug).'#comments')
            ->with('success', $message);
    }
}
