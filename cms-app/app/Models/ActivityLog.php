<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

#[Fillable([
    'user_id',
    'action_name',
    'entity_type',
    'entity_id',
    'old_values',
    'new_values',
    'ip_address',
    'user_agent',
])]
class ActivityLog extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'entity_id' => 'integer',
            'old_values' => 'array',
            'new_values' => 'array',
        ];
    }

    /**
     * User who performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Entity (Post, Category, User, etc.) affected by the action.
     */
    public function entity(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'entity_type', 'entity_id');
    }

    /**
     * Record an activity log entry.
     */
    public static function record(
        string $actionName,
        ?Model $entity = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?User $user = null
    ): self {
        $userId = $user?->id ?? Auth::id();

        return static::create([
            'user_id' => $userId,
            'action_name' => $actionName,
            'entity_type' => $entity ? get_class($entity) : null,
            'entity_id' => $entity?->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}
