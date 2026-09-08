<?php

namespace App\Observers;

use App\Models\Comment;
use App\Models\Post;

class CommentObserver
{
    /**
     * Handle the Comment "created" event.
     */
    public function created(Comment $comment): void
    {
        if ($comment->status === 'approved' && $comment->post_id) {
            Post::where('id', $comment->post_id)->increment('comment_count');
        }
    }

    /**
     * Handle the Comment "updated" event.
     */
    public function updated(Comment $comment): void
    {
        $oldStatus = $comment->getOriginal('status');
        $newStatus = $comment->status;

        if ($oldStatus !== 'approved' && $newStatus === 'approved') {
            Post::where('id', $comment->post_id)->increment('comment_count');
        } elseif ($oldStatus === 'approved' && $newStatus !== 'approved') {
            Post::where('id', $comment->post_id)->where('comment_count', '>', 0)->decrement('comment_count');
        }
    }

    /**
     * Handle the Comment "deleted" event.
     */
    public function deleted(Comment $comment): void
    {
        if ($comment->status === 'approved' && $comment->post_id) {
            Post::where('id', $comment->post_id)->where('comment_count', '>', 0)->decrement('comment_count');
        }
    }

    /**
     * Handle the Comment "restored" event.
     */
    public function restored(Comment $comment): void
    {
        if ($comment->status === 'approved' && $comment->post_id) {
            Post::where('id', $comment->post_id)->increment('comment_count');
        }
    }
}
