<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Comment::with(['post:id,title,slug', 'user:id,name,username,avatar_url']);

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('content', 'like', "%{$search}%")
                    ->orWhere('author_name', 'like', "%{$search}%")
                    ->orWhere('author_email', 'like', "%{$search}%");
            });
        }

        $comments = $query->latest('id')->paginate(15)->withQueryString();

        $counts = [
            'all' => Comment::count(),
            'pending' => Comment::where('status', 'pending')->count(),
            'approved' => Comment::where('status', 'approved')->count(),
            'spam' => Comment::where('status', 'spam')->count(),
        ];

        return Inertia::render('Admin/Comments/Index', [
            'comments' => $comments,
            'counts' => $counts,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Update the status of the specified comment.
     */
    public function updateStatus(Request $request, Comment $comment): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:approved,pending,spam'],
        ]);

        $comment->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Status komentar berhasil diubah.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment): RedirectResponse
    {
        $comment->delete();

        return redirect()->back()->with('success', 'Komentar berhasil dihapus.');
    }
}
