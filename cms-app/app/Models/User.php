<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'username', 'email', 'password', 'avatar_url', 'bio', 'status'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Accessor for avatar as alias to avatar_url.
     */
    protected function avatar(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->avatar_url
        );
    }

    /**
     * Roles assigned to the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    /**
     * Posts authored by the user.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    /**
     * Comments written by the user.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'user_id');
    }

    /**
     * Media uploaded by the user.
     */
    public function media(): HasMany
    {
        return $this->hasMany(Media::class, 'uploader_id');
    }

    /**
     * Activity logs triggered by the user.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }

    /**
     * Check if user has given role(s).
     */
    public function hasRole(string|array $roles): bool
    {
        if (is_string($roles)) {
            $roles = [$roles];
        }

        return $this->roles->pluck('slug')->intersect($roles)->isNotEmpty();
    }

    /**
     * Check if user has given permission slug.
     */
    public function hasPermission(string $permission): bool
    {
        // Super admin bypass
        if ($this->hasRole('super-admin')) {
            return true;
        }

        return $this->roles()
            ->with('permissions')
            ->get()
            ->flatMap(fn (Role $role) => $role->permissions)
            ->pluck('slug')
            ->contains($permission);
    }

    /**
     * Assign role(s) to the user.
     */
    public function assignRole(Role|string ...$roles): static
    {
        $roleIds = collect($roles)->map(function ($role) {
            if ($role instanceof Role) {
                return $role->id;
            }

            return Role::where('slug', $role)->orWhere('name', $role)->value('id');
        })->filter()->all();

        $this->roles()->syncWithoutDetaching($roleIds);

        return $this;
    }

    /**
     * Remove role(s) from the user.
     */
    public function removeRole(Role|string ...$roles): static
    {
        $roleIds = collect($roles)->map(function ($role) {
            if ($role instanceof Role) {
                return $role->id;
            }

            return Role::where('slug', $role)->orWhere('name', $role)->value('id');
        })->filter()->all();

        $this->roles()->detach($roleIds);

        return $this;
    }
}
