<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'post_id',
    'user_id',
    'parent_id',
    'author_name',
    'author_email',
    'author_url',
    'author_ip',
    'content',
    'status',
])]
class Comment extends Model
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
            'post_id' => 'integer',
            'user_id' => 'integer',
            'parent_id' => 'integer',
        ];
    }

    /**
     * Post being commented on.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    /**
     * Registered user who wrote the comment (if logged in).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Parent comment if this is a reply.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     * Replies to this comment.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    /**
     * Approved replies to this comment.
     */
    public function approvedReplies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id')
            ->where('status', 'approved')
            ->with('user')
            ->oldest();
    }

    /**
     * Display name for comment author.
     */
    protected function displayName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user?->name ?? $this->author_name ?? 'Anonymous'
        );
    }

    /**
     * Scope a query to only include approved comments.
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include pending comments.
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include spam comments.
     */
    public function scopeSpam(Builder $query): Builder
    {
        return $query->where('status', 'spam');
    }
}
