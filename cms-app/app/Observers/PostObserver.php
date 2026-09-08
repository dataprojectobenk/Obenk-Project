<?php

namespace App\Observers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Support\Str;

class PostObserver
{
    /**
     * Handle the Post "creating" event.
     */
    public function creating(Post $post): void
    {
        if (empty($post->slug)) {
            $post->slug = $this->generateUniqueSlug($post->title);
        }

        $this->calculateReadingTime($post);

        if ($post->status === 'published' && empty($post->published_at)) {
            $post->published_at = now();
        }
    }

    /**
     * Handle the Post "updating" event.
     */
    public function updating(Post $post): void
    {
        if ($post->isDirty('title') && empty($post->slug)) {
            $post->slug = $this->generateUniqueSlug($post->title, $post->id);
        }

        if ($post->isDirty('content')) {
            $this->calculateReadingTime($post);
        }

        if ($post->isDirty('status') && $post->status === 'published' && empty($post->published_at)) {
            $post->published_at = now();
        }
    }

    /**
     * Handle the Post "created" event.
     */
    public function created(Post $post): void
    {
        if ($post->status === 'published' && $post->category_id) {
            Category::where('id', $post->category_id)->increment('post_count');
        }
    }

    /**
     * Handle the Post "updated" event.
     */
    public function updated(Post $post): void
    {
        $oldCategory = $post->getOriginal('category_id');
        $newCategory = $post->category_id;
        $oldStatus = $post->getOriginal('status');
        $newStatus = $post->status;

        // Status changed to published
        if ($oldStatus !== 'published' && $newStatus === 'published') {
            if ($newCategory) {
                Category::where('id', $newCategory)->increment('post_count');
            }
        }
        // Status changed from published to draft/archived
        elseif ($oldStatus === 'published' && $newStatus !== 'published') {
            $targetCat = $oldCategory ?? $newCategory;
            if ($targetCat) {
                Category::where('id', $targetCat)->where('post_count', '>', 0)->decrement('post_count');
            }
        }
        // Category changed on published post
        elseif ($newStatus === 'published' && $oldCategory !== $newCategory) {
            if ($oldCategory) {
                Category::where('id', $oldCategory)->where('post_count', '>', 0)->decrement('post_count');
            }
            if ($newCategory) {
                Category::where('id', $newCategory)->increment('post_count');
            }
        }
    }

    /**
     * Handle the Post "deleted" event.
     */
    public function deleted(Post $post): void
    {
        if ($post->status === 'published' && $post->category_id) {
            Category::where('id', $post->category_id)->where('post_count', '>', 0)->decrement('post_count');
        }
    }

    /**
     * Handle the Post "restored" event.
     */
    public function restored(Post $post): void
    {
        if ($post->status === 'published' && $post->category_id) {
            Category::where('id', $post->category_id)->increment('post_count');
        }
    }

    /**
     * Calculate reading time in minutes.
     */
    protected function calculateReadingTime(Post $post): void
    {
        $cleanText = strip_tags($post->content ?? '');
        $wordCount = str_word_count($cleanText);
        $post->reading_time = max(1, (int) ceil($wordCount / 200));
    }

    /**
     * Generate a unique slug for the post.
     */
    protected function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 2;

        while (Post::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }
}
