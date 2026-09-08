<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Posts
            ['name' => 'View Posts', 'slug' => 'posts.view', 'module_group' => 'posts', 'description' => 'Can view posts list and details'],
            ['name' => 'Create Posts', 'slug' => 'posts.create', 'module_group' => 'posts', 'description' => 'Can create new posts drafts'],
            ['name' => 'Edit Posts', 'slug' => 'posts.edit', 'module_group' => 'posts', 'description' => 'Can edit existing posts'],
            ['name' => 'Delete Posts', 'slug' => 'posts.delete', 'module_group' => 'posts', 'description' => 'Can delete posts'],
            ['name' => 'Publish Posts', 'slug' => 'posts.publish', 'module_group' => 'posts', 'description' => 'Can publish and unpublish posts'],

            // Categories
            ['name' => 'View Categories', 'slug' => 'categories.view', 'module_group' => 'categories', 'description' => 'Can view categories'],
            ['name' => 'Create Categories', 'slug' => 'categories.create', 'module_group' => 'categories', 'description' => 'Can create categories'],
            ['name' => 'Edit Categories', 'slug' => 'categories.edit', 'module_group' => 'categories', 'description' => 'Can edit categories'],
            ['name' => 'Delete Categories', 'slug' => 'categories.delete', 'module_group' => 'categories', 'description' => 'Can delete categories'],

            // Tags
            ['name' => 'View Tags', 'slug' => 'tags.view', 'module_group' => 'tags', 'description' => 'Can view tags'],
            ['name' => 'Create Tags', 'slug' => 'tags.create', 'module_group' => 'tags', 'description' => 'Can create tags'],
            ['name' => 'Edit Tags', 'slug' => 'tags.edit', 'module_group' => 'tags', 'description' => 'Can edit tags'],
            ['name' => 'Delete Tags', 'slug' => 'tags.delete', 'module_group' => 'tags', 'description' => 'Can delete tags'],

            // Media
            ['name' => 'View Media', 'slug' => 'media.view', 'module_group' => 'media', 'description' => 'Can browse media library'],
            ['name' => 'Upload Media', 'slug' => 'media.upload', 'module_group' => 'media', 'description' => 'Can upload new media files'],
            ['name' => 'Delete Media', 'slug' => 'media.delete', 'module_group' => 'media', 'description' => 'Can delete media files'],

            // Comments
            ['name' => 'View Comments', 'slug' => 'comments.view', 'module_group' => 'comments', 'description' => 'Can view comments list'],
            ['name' => 'Moderate Comments', 'slug' => 'comments.moderate', 'module_group' => 'comments', 'description' => 'Can approve or mark spam on comments'],
            ['name' => 'Delete Comments', 'slug' => 'comments.delete', 'module_group' => 'comments', 'description' => 'Can delete comments'],

            // Users
            ['name' => 'View Users', 'slug' => 'users.view', 'module_group' => 'users', 'description' => 'Can view users list'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'module_group' => 'users', 'description' => 'Can create new users'],
            ['name' => 'Edit Users', 'slug' => 'users.edit', 'module_group' => 'users', 'description' => 'Can edit user details and roles'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'module_group' => 'users', 'description' => 'Can delete users'],

            // Roles
            ['name' => 'View Roles', 'slug' => 'roles.view', 'module_group' => 'roles', 'description' => 'Can view roles list'],
            ['name' => 'Manage Roles', 'slug' => 'roles.manage', 'module_group' => 'roles', 'description' => 'Can create, edit and delete roles and assign permissions'],

            // Settings
            ['name' => 'View Settings', 'slug' => 'settings.view', 'module_group' => 'settings', 'description' => 'Can view site settings'],
            ['name' => 'Edit Settings', 'slug' => 'settings.edit', 'module_group' => 'settings', 'description' => 'Can change site settings'],

            // Activity Logs
            ['name' => 'View Activity Logs', 'slug' => 'activity_logs.view', 'module_group' => 'activity_logs', 'description' => 'Can view audit trail activity logs'],
        ];

        foreach ($permissions as $perm) {
            Permission::updateOrCreate(['slug' => $perm['slug']], $perm);
        }

        // 1. Super Admin Role
        $superAdminRole = Role::updateOrCreate(
            ['slug' => 'super-admin'],
            [
                'name' => 'Super Administrator',
                'description' => 'Full access to entire system and all administrative tools.',
            ]
        );
        $superAdminRole->permissions()->sync(Permission::pluck('id')->all());

        // 2. Editor Role
        $editorRole = Role::updateOrCreate(
            ['slug' => 'editor'],
            [
                'name' => 'Editor',
                'description' => 'Can manage posts, categories, tags, media, and moderate comments.',
            ]
        );
        $editorPermissions = Permission::whereIn('module_group', ['posts', 'categories', 'tags', 'media', 'comments'])
            ->pluck('id')
            ->all();
        $editorRole->permissions()->sync($editorPermissions);

        // 3. Author Role
        $authorRole = Role::updateOrCreate(
            ['slug' => 'author'],
            [
                'name' => 'Author',
                'description' => 'Can write and manage own posts and upload media.',
            ]
        );
        $authorPermissions = Permission::whereIn('slug', [
            'posts.view',
            'posts.create',
            'posts.edit',
            'media.view',
            'media.upload',
        ])->pluck('id')->all();
        $authorRole->permissions()->sync($authorPermissions);
    }
}
