<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'uploader_id',
    'disk',
    'filename',
    'original_name',
    'mime_type',
    'file_path',
    'file_size',
    'alt_text',
    'caption',
    'dimensions',
])]
class Media extends Model
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
            'file_size' => 'integer',
            'dimensions' => 'array',
        ];
    }

    /**
     * User who uploaded the media asset.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    /**
     * Posts using this media as featured image.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'featured_image_id');
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['url', 'file_name', 'path'];

    /**
     * Get the public URL for the media asset.
     */
    protected function url(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (empty($this->file_path)) {
                    return null;
                }

                if (str_starts_with($this->file_path, 'http://') || str_starts_with($this->file_path, 'https://')) {
                    return $this->file_path;
                }

                return Storage::disk($this->disk ?? 'public')->url($this->file_path);
            }
        );
    }

    /**
     * Accessor for file_name as alias to filename.
     */
    protected function fileName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->filename ?? $this->original_name
        );
    }

    /**
     * Accessor for path as alias to file_path.
     */
    protected function path(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->file_path
        );
    }
}
