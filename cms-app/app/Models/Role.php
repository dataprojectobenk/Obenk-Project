<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'slug', 'description'])]
class Role extends Model
{
    use HasFactory;

    /**
     * Users assigned this role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_roles', 'role_id', 'user_id');
    }

    /**
     * Permissions granted to this role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permissions', 'role_id', 'permission_id');
    }

    /**
     * Check if the role has a given permission.
     */
    public function hasPermissionTo(string $permission): bool
    {
        return $this->permissions->pluck('slug')->contains($permission);
    }

    /**
     * Give permission(s) to this role.
     */
    public function givePermissionTo(Permission|string ...$permissions): static
    {
        $permissionIds = collect($permissions)->map(function ($permission) {
            if ($permission instanceof Permission) {
                return $permission->id;
            }

            return Permission::where('slug', $permission)->orWhere('name', $permission)->value('id');
        })->filter()->all();

        $this->permissions()->syncWithoutDetaching($permissionIds);

        return $this;
    }

    /**
     * Revoke permission(s) from this role.
     */
    public function revokePermissionTo(Permission|string ...$permissions): static
    {
        $permissionIds = collect($permissions)->map(function ($permission) {
            if ($permission instanceof Permission) {
                return $permission->id;
            }

            return Permission::where('slug', $permission)->orWhere('name', $permission)->value('id');
        })->filter()->all();

        $this->permissions()->detach($permissionIds);

        return $this;
    }

    /**
     * Sync permissions for this role.
     */
    public function syncPermissions(array $permissions): static
    {
        $permissionIds = collect($permissions)->map(function ($permission) {
            if ($permission instanceof Permission) {
                return $permission->id;
            }

            return Permission::where('slug', $permission)->orWhere('name', $permission)->value('id');
        })->filter()->all();

        $this->permissions()->sync($permissionIds);

        return $this;
    }
}
