<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'slug', 'post_count'])]
class Tag extends Model
{
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'post_count' => 'integer',
        ];
    }

    /**
     * Posts associated with this tag.
     */
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'post_tags', 'tag_id', 'post_id');
    }

    /**
     * Published posts associated with this tag.
     */
    public function publishedPosts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'post_tags', 'tag_id', 'post_id')
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
