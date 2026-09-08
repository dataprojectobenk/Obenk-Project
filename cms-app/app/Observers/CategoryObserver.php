<?php

namespace App\Observers;

use App\Models\Category;
use Illuminate\Support\Str;

class CategoryObserver
{
    /**
     * Handle the Category "creating" event.
     */
    public function creating(Category $category): void
    {
        if (empty($category->slug)) {
            $category->slug = $this->generateUniqueSlug($category->name);
        }
    }

    /**
     * Handle the Category "updating" event.
     */
    public function updating(Category $category): void
    {
        if ($category->isDirty('name') && empty($category->slug)) {
            $category->slug = $this->generateUniqueSlug($category->name, $category->id);
        }
    }

    /**
     * Generate a unique slug for the category.
     */
    protected function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 2;

        while (Category::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }
}
