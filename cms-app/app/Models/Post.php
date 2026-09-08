<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'author_id',
    'category_id',
    'featured_image_id',
    'title',
    'slug',
    'excerpt',
    'content',
    'status',
    'visibility',
    'is_featured',
    'reading_time',
    'view_count',
    'comment_count',
    'seo_title',
    'seo_description',
    'seo_keywords',
    'canonical_url',
    'custom_fields',
    'published_at',
])]
class Post extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'author_id' => 'integer',
            'category_id' => 'integer',
            'featured_image_id' => 'integer',
            'is_featured' => 'boolean',
            'reading_time' => 'integer',
            'view_count' => 'integer',
            'comment_count' => 'integer',
            'custom_fields' => 'array',
            'published_at' => 'datetime',
        ];
    }

    /**
     * Author of the post.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Primary category of the post.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Featured image/media of the post.
     */
    public function featuredImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_image_id');
    }

    /**
     * Tags attached to the post.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'post_tags', 'post_id', 'tag_id');
    }

    /**
     * All comments on the post.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'post_id');
    }

    /**
     * Approved top-level comments for public display.
     */
    public function approvedComments(): HasMany
    {
        return $this->hasMany(Comment::class, 'post_id')
            ->where('status', 'approved')
            ->whereNull('parent_id')
            ->with('approvedReplies.user', 'user')
            ->latest();
    }

    /**
     * Scope a query to only include published posts.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope a query to only include featured posts.
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Check if post is currently published and public.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published' &&
            $this->published_at !== null &&
            $this->published_at->isPast();
    }
}
