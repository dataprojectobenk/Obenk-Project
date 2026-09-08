<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Super Administrator',
                'email' => 'admin@obenk.test',
                'password' => Hash::make('password'),
                'bio' => 'Lead Architect & Chief Administrator of Obenk CMS Platform.',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $superAdminRole = Role::where('slug', 'super-admin')->first();
        if ($superAdminRole) {
            $superAdmin->assignRole($superAdminRole);
        }

        // Also create a sample Editor and Author for development testing
        $editor = User::updateOrCreate(
            ['username' => 'editor'],
            [
                'name' => 'Editorial Lead',
                'email' => 'editor@obenk.test',
                'password' => Hash::make('password'),
                'bio' => 'Senior Editor reviewing and curating articles across categories.',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $editorRole = Role::where('slug', 'editor')->first();
        if ($editorRole) {
            $editor->assignRole($editorRole);
        }

        $author = User::updateOrCreate(
            ['username' => 'author'],
            [
                'name' => 'Content Author',
                'email' => 'author@obenk.test',
                'password' => Hash::make('password'),
                'bio' => 'Technical Writer covering Laravel, React, and Modern Web Architecture.',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $authorRole = Role::where('slug', 'author')->first();
        if ($authorRole) {
            $author->assignRole($authorRole);
        }
    }
}
