<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Media;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class DummyContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('username', 'admin')->first();
        $author = User::where('username', 'author')->first() ?? $admin;

        // 1. Create Media Asset Mocks
        $media1 = Media::updateOrCreate(
            ['filename' => 'laravel-clean-architecture.webp'],
            [
                'uploader_id' => $admin?->id,
                'disk' => 'public',
                'original_name' => 'laravel-clean-architecture.png',
                'mime_type' => 'image/webp',
                'file_path' => 'uploads/posts/laravel-clean-architecture.webp',
                'file_size' => 245000,
                'alt_text' => 'Laravel Clean Architecture Banner',
                'caption' => 'Clean Relational Schema for Modern Web Apps',
                'dimensions' => ['width' => 1200, 'height' => 630],
            ]
        );

        $media2 = Media::updateOrCreate(
            ['filename' => 'react-vite-dashboard.webp'],
            [
                'uploader_id' => $admin?->id,
                'disk' => 'public',
                'original_name' => 'react-vite-dashboard.png',
                'mime_type' => 'image/webp',
                'file_path' => 'uploads/posts/react-vite-dashboard.webp',
                'file_size' => 312000,
                'alt_text' => 'React 19 Vite Dashboard Preview',
                'caption' => 'Decoupled Single Page Application Dashboard',
                'dimensions' => ['width' => 1200, 'height' => 630],
            ]
        );

        // 2. Create Categories (Hierarchical)
        $techCat = Category::updateOrCreate(
            ['slug' => 'teknologi'],
            [
                'name' => 'Teknologi',
                'description' => 'Eksplorasi dunia rekayasa perangkat lunak dan teknologi terkini.',
                'image_url' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop',
            ]
        );

        $laravelCat = Category::updateOrCreate(
            ['slug' => 'laravel'],
            [
                'parent_id' => $techCat->id,
                'name' => 'Laravel Ecosystem',
                'description' => 'Tutorial, tips, dan best practice arsitektur Laravel framework.',
            ]
        );

        $reactCat = Category::updateOrCreate(
            ['slug' => 'react'],
            [
                'parent_id' => $techCat->id,
                'name' => 'React & Frontend',
                'description' => 'Panduan pengembangan antarmuka modern dengan React 19 & Vite.',
            ]
        );

        $designCat = Category::updateOrCreate(
            ['slug' => 'desain-ui-ux'],
            [
                'name' => 'Desain UI/UX',
                'description' => 'Desain interaksi, tipografi, dan pengalaman pengguna digital.',
                'image_url' => 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop',
            ]
        );

        $tutorialCat = Category::updateOrCreate(
            ['slug' => 'tutorial'],
            [
                'name' => 'Tutorial & Panduan',
                'description' => 'Panduan langkah demi langkah implementasi sistem.',
            ]
        );

        // 3. Create Tags
        $tagLaravel = Tag::updateOrCreate(['slug' => 'laravel-12'], ['name' => 'Laravel 12']);
        $tagReact = Tag::updateOrCreate(['slug' => 'react-19'], ['name' => 'React 19']);
        $tagArchitecture = Tag::updateOrCreate(['slug' => 'clean-architecture'], ['name' => 'Clean Architecture']);
        $tagPerformance = Tag::updateOrCreate(['slug' => 'performance'], ['name' => 'Performance']);
        $tagTailwind = Tag::updateOrCreate(['slug' => 'tailwind-css'], ['name' => 'Tailwind CSS']);

        // 4. Create Sample Posts
        $post1 = Post::updateOrCreate(
            ['slug' => 'membangun-cms-modern-dengan-laravel-dan-react'],
            [
                'author_id' => $author?->id,
                'category_id' => $laravelCat->id,
                'featured_image_id' => $media1->id,
                'title' => 'Membangun CMS Modern dengan Arsitektur Bersih: Laravel + React',
                'excerpt' => 'Pelajari bagaimana mengombinasikan kecepatan SSR Laravel Blade untuk publik web dengan kemudahan React SPA untuk admin dashboard.',
                'content' => '<p>Dalam dunia pengembangan web modern, kecepatan rendering halaman publik dan kenyamanan antarmuka administrasi adalah dua hal yang sangat krusial.</p><p>Dengan memisahkan frontend publik ke dalam Laravel Blade (Server-Side Rendering) dan dashboard admin ke dalam React 19 SPA melalui REST API Sanctum, kita mendapatkan performa SEO 100/100 sekaligus UX dashboard yang interaktif.</p><h2>Keunggulan Tanpa EAV (Zero WordPress Bloat)</h2><p>Kami menyingkirkan tabel <code>post_meta</code> yang lambat dan menggantinya dengan kolom bertipe data pasti langsung pada tabel <code>posts</code>.</p>',
                'status' => 'published',
                'visibility' => 'public',
                'is_featured' => true,
                'view_count' => 1240,
                'seo_title' => 'Membangun CMS Modern: Arsitektur Laravel Blade + React 19',
                'seo_description' => 'Panduan komprehensif merancang CMS modern berkecepatan tinggi tanpa overhead EAV WordPress.',
                'seo_keywords' => 'laravel, react, cms, clean architecture, blade ssr',
                'custom_fields' => [
                    'reading_difficulty' => 'Intermediate',
                    'sponsor' => 'Obenk Engineering Lab',
                ],
                'published_at' => now()->subDays(2),
            ]
        );
        $post1->tags()->sync([$tagLaravel->id, $tagArchitecture->id, $tagPerformance->id]);

        $post2 = Post::updateOrCreate(
            ['slug' => 'integrasi-react-19-dengan-laravel-sanctum-api'],
            [
                'author_id' => $admin?->id,
                'category_id' => $reactCat->id,
                'featured_image_id' => $media2->id,
                'title' => 'Integrasi React 19 dengan Laravel Sanctum API untuk Dashboard Admin',
                'excerpt' => 'Panduan mengamankan REST API admin dashboard menggunakan Laravel Sanctum token autentikasi pada aplikasi React 19 SPA.',
                'content' => '<p>Laravel Sanctum menyediakan sistem otentikasi berbasis token yang ringan untuk SPA, aplikasi mobile, dan API token sederhana.</p><p>Pada artikel ini kita membahas penanganan refresh token, Axios interceptor, serta RBAC permission guard di sisi client React.</p>',
                'status' => 'published',
                'visibility' => 'public',
                'is_featured' => false,
                'view_count' => 670,
                'seo_title' => 'Panduan Autentikasi React 19 + Laravel Sanctum API',
                'seo_description' => 'Cara aman menghubungkan React 19 dashboard ke backend Laravel Sanctum.',
                'seo_keywords' => 'react 19, sanctum, laravel api, authentication, token',
                'published_at' => now()->subDay(),
            ]
        );
        $post2->tags()->sync([$tagReact->id, $tagTailwind->id]);

        $post3 = Post::updateOrCreate(
            ['slug' => 'prinsip-dasar-desain-antarmuka-kontemporer'],
            [
                'author_id' => $author?->id,
                'category_id' => $designCat->id,
                'title' => 'Prinsip Dasar Desain Antarmuka Kontemporer dan Aksesibilitas',
                'excerpt' => 'Menyelami aspek kontras warna, hierarki tipografi, dan kepatuhan WCAG 2.1 pada desain web.',
                'content' => '<p>Desain antarmuka bukan sekadar estetika visual, melainkan bagaimana pengguna dapat mencerna informasi secara intuitif dan nyaman.</p>',
                'status' => 'draft',
                'visibility' => 'public',
                'is_featured' => false,
                'view_count' => 0,
            ]
        );
        $post3->tags()->sync([$tagArchitecture->id]);

        // 5. Create Comments (Threaded)
        $comment1 = Comment::updateOrCreate(
            [
                'post_id' => $post1->id,
                'author_email' => 'developer@community.test',
            ],
            [
                'author_name' => 'Budi Pratama',
                'author_url' => 'https://budipratama.dev',
                'author_ip' => '127.0.0.1',
                'content' => 'Arsitektur hybrid Blade SSR + React Admin ini sangat solutif! SEO tetap maksimal dan admin dashboard terasa sangat responsif.',
                'status' => 'approved',
                'created_at' => now()->subDay(),
            ]
        );

        $reply1 = Comment::updateOrCreate(
            [
                'post_id' => $post1->id,
                'parent_id' => $comment1->id,
                'user_id' => $admin?->id,
            ],
            [
                'author_name' => $admin?->name,
                'content' => 'Terima kasih Budi! Pendekatan ini memang didesain khusus agar public web bebas beban JavaScript client-side yang berlebihan.',
                'status' => 'approved',
                'created_at' => now()->subHours(12),
            ]
        );

        // 6. Record Initial Activity Log
        ActivityLog::record('seeder.executed', $post1, null, ['status' => 'published'], $admin);
    }
}
