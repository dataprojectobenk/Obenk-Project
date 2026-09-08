<?php

namespace App\Observers;

use App\Models\Tag;
use Illuminate\Support\Str;

class TagObserver
{
    /**
     * Handle the Tag "creating" event.
     */
    public function creating(Tag $tag): void
    {
        if (empty($tag->slug)) {
            $tag->slug = $this->generateUniqueSlug($tag->name);
        }
    }

    /**
     * Handle the Tag "updating" event.
     */
    public function updating(Tag $tag): void
    {
        if ($tag->isDirty('name') && empty($tag->slug)) {
            $tag->slug = $this->generateUniqueSlug($tag->name, $tag->id);
        }
    }

    /**
     * Generate a unique slug for the tag.
     */
    protected function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 2;

        while (Tag::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }
}
