<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['parent_id', 'name', 'slug', 'description', 'image_url', 'post_count'])]
class Category extends Model
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
            'parent_id' => 'integer',
            'post_count' => 'integer',
        ];
    }

    /**
     * Parent category for hierarchical nesting.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Subcategories of this category.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Posts associated with this category.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'category_id');
    }

    /**
     * Published posts in this category.
     */
    public function publishedPosts(): HasMany
    {
        return $this->hasMany(Post::class, 'category_id')
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
