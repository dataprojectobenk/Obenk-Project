<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminDashboardAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        $this->admin = User::where('email', 'admin@obenk.test')->first();
    }

    public function test_admin_dashboard_renders_with_analytics_and_best_posts(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard')
            ->has('metrics')
            ->has('best_posts')
            ->has('trend_data')
            ->has('geo_distribution')
            ->has('traffic_sources')
            ->has('device_distribution')
            ->has('category_share')
            ->has('recent_activities')
        );
    }

    public function test_admin_can_view_and_create_post(): void
    {
        $category = Category::first();
        $tag = Tag::first();

        $response = $this->actingAs($this->admin)->post('/admin/posts', [
            'title' => 'Artikel Baru Dari Admin Dashboard',
            'slug' => 'artikel-baru-dari-admin-dashboard',
            'excerpt' => 'Ringkasan artikel baru.',
            'content' => '<p>Konten artikel lengkap yang ditulis melalui editor Tiptap.</p>',
            'category_id' => $category->id,
            'status' => 'published',
            'visibility' => 'public',
            'is_featured' => true,
            'tags' => [$tag->id],
        ]);

        $response->assertRedirect('/admin/posts');
        $this->assertDatabaseHas('posts', [
            'slug' => 'artikel-baru-dari-admin-dashboard',
            'status' => 'published',
            'is_featured' => 1,
        ]);
    }

    public function test_admin_can_update_post(): void
    {
        $post = Post::first();

        $response = $this->actingAs($this->admin)->put("/admin/posts/{$post->id}", [
            'title' => 'Judul Artikel Diperbarui',
            'slug' => $post->slug,
            'excerpt' => 'Ringkasan diperbarui.',
            'content' => '<p>Konten diperbarui.</p>',
            'status' => 'published',
            'visibility' => 'public',
        ]);

        $response->assertRedirect('/admin/posts');
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Judul Artikel Diperbarui',
        ]);
    }

    public function test_admin_can_delete_post(): void
    {
        $post = Post::first();

        $response = $this->actingAs($this->admin)->delete("/admin/posts/{$post->id}");

        $response->assertRedirect('/admin/posts');
        $this->assertSoftDeleted('posts', ['id' => $post->id]);
    }

    public function test_admin_can_create_category(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/categories', [
            'name' => 'Kategori Baru',
            'description' => 'Deskripsi kategori baru.',
        ]);

        $response->assertRedirect('/admin/categories');
        $this->assertDatabaseHas('categories', [
            'name' => 'Kategori Baru',
            'slug' => 'kategori-baru',
        ]);
    }

    public function test_admin_can_create_tag(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/tags', [
            'name' => 'InertiaReact',
        ]);

        $response->assertRedirect('/admin/tags');
        $this->assertDatabaseHas('tags', [
            'name' => 'InertiaReact',
            'slug' => 'inertiareact',
        ]);
    }

    public function test_admin_can_upload_media_via_ajax(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('test-banner.jpg', 500, 'image/jpeg');

        $response = $this->actingAs($this->admin)
            ->post('/admin/media', [
                'file' => $file,
                'alt_text' => 'Banner Uji Coba',
            ], ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $this->assertDatabaseHas('media', [
            'original_name' => 'test-banner.jpg',
            'alt_text' => 'Banner Uji Coba',
        ]);
    }

    public function test_admin_can_moderate_comments(): void
    {
        $comment = Comment::first();

        $response = $this->actingAs($this->admin)->put("/admin/comments/{$comment->id}/status", [
            'status' => 'approved',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'status' => 'approved',
        ]);
    }

    public function test_admin_can_update_settings(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/settings', [
            'group' => 'general',
            'settings' => [
                'site_title' => 'Obenk CMS Portal Terkini',
                'site_tagline' => 'Portal Berita & CMS Super Cepat',
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('settings', [
            'key_name' => 'site_title',
            'setting_value' => 'Obenk CMS Portal Terkini',
        ]);
    }
}
