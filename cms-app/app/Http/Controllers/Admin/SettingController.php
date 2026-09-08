<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $allSettings = Setting::all()->groupBy('setting_group');

        $groups = [
            'general' => [
                'site_title' => Setting::get('site_title', 'Obenk CMS'),
                'site_tagline' => Setting::get('site_tagline', 'Modern Tailored Content Management System'),
                'site_description' => Setting::get('site_description', 'High performance CMS built with Laravel and React.'),
                'admin_email' => Setting::get('admin_email', 'admin@obenk.test'),
                'posts_per_page' => Setting::get('posts_per_page', '10'),
            ],
            'seo' => [
                'meta_keywords' => Setting::get('meta_keywords', 'laravel, cms, inertia, react'),
                'google_analytics_id' => Setting::get('google_analytics_id', ''),
                'canonical_base_url' => Setting::get('canonical_base_url', 'http://localhost'),
            ],
            'social' => [
                'twitter_handle' => Setting::get('twitter_handle', '@obenk'),
                'facebook_url' => Setting::get('facebook_url', 'https://facebook.com/obenk'),
                'github_url' => Setting::get('github_url', 'https://github.com/obenk'),
                'linkedin_url' => Setting::get('linkedin_url', ''),
            ],
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $groups,
        ]);
    }

    /**
     * Update settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable'],
            'group' => ['required', 'string'],
        ]);

        $group = $validated['group'];

        foreach ($validated['settings'] as $key => $value) {
            Setting::set($key, $value ?? '', $group, true);
        }

        Setting::clearCache();

        return redirect()->back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
