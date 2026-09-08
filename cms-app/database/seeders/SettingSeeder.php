<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General
            ['setting_group' => 'general', 'key_name' => 'site_title', 'setting_value' => 'Obenk CMS', 'is_autoload' => true],
            ['setting_group' => 'general', 'key_name' => 'site_tagline', 'setting_value' => 'Modern Tailored CMS Engine', 'is_autoload' => true],
            ['setting_group' => 'general', 'key_name' => 'site_description', 'setting_value' => 'Ultra-fast, SEO-optimized Content Management System built with Laravel & React.', 'is_autoload' => true],
            ['setting_group' => 'general', 'key_name' => 'site_email', 'setting_value' => 'contact@obenk.test', 'is_autoload' => true],
            ['setting_group' => 'general', 'key_name' => 'site_logo', 'setting_value' => null, 'is_autoload' => true],
            ['setting_group' => 'general', 'key_name' => 'site_favicon', 'setting_value' => null, 'is_autoload' => true],

            // SEO
            ['setting_group' => 'seo', 'key_name' => 'default_meta_title', 'setting_value' => 'Obenk CMS - Modern Publishing Platform', 'is_autoload' => true],
            ['setting_group' => 'seo', 'key_name' => 'default_meta_description', 'setting_value' => 'Official website powered by Obenk CMS Engine.', 'is_autoload' => true],
            ['setting_group' => 'seo', 'key_name' => 'default_meta_keywords', 'setting_value' => 'cms, laravel, blade, react, blog, architecture', 'is_autoload' => true],
            ['setting_group' => 'seo', 'key_name' => 'robots_txt', 'setting_value' => "User-agent: *\nAllow: /", 'is_autoload' => false],
            ['setting_group' => 'seo', 'key_name' => 'google_analytics_id', 'setting_value' => null, 'is_autoload' => false],

            // Social
            ['setting_group' => 'social', 'key_name' => 'social_facebook', 'setting_value' => 'https://facebook.com/obenkcms', 'is_autoload' => true],
            ['setting_group' => 'social', 'key_name' => 'social_twitter', 'setting_value' => 'https://x.com/obenkcms', 'is_autoload' => true],
            ['setting_group' => 'social', 'key_name' => 'social_instagram', 'setting_value' => 'https://instagram.com/obenkcms', 'is_autoload' => true],
            ['setting_group' => 'social', 'key_name' => 'social_github', 'setting_value' => 'https://github.com/obenkcms', 'is_autoload' => true],

            // System
            ['setting_group' => 'system', 'key_name' => 'comments_auto_approve', 'setting_value' => 'false', 'is_autoload' => true],
            ['setting_group' => 'system', 'key_name' => 'posts_per_page', 'setting_value' => '12', 'is_autoload' => true],
            ['setting_group' => 'system', 'key_name' => 'maintenance_mode', 'setting_value' => 'false', 'is_autoload' => true],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key_name' => $setting['key_name']],
                $setting
            );
        }

        Setting::clearCache();
    }
}
