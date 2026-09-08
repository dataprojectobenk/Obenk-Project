<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class AdminPostManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        $this->admin = User::where('username', 'admin')->first();
    }

    public function test_admin_can_create_published_post_and_it_is_immediately_visible(): void
    {
        $category = Category::first();
        $tag = Tag::first();

        $response = $this->actingAs($this->admin)->post(route('admin.posts.store'), [
            'title' => 'Judul Artikel Baru Terbit',
            'content' => '<p>Konten artikel baru yang sangat informatif dan lengkap.</p>',
            'category_id' => $category->id,
            'status' => 'published',
            'visibility' => 'public',
            'is_featured' => true,
            'published_at' => null,
            'tags' => [$tag->id],
        ]);

        $response->assertRedirect(route('admin.posts.index'));
        $response->assertSessionHas('success');

        $post = Post::where('title', 'Judul Artikel Baru Terbit')->first();
        $this->assertNotNull($post);
        $this->assertEquals('published', $post->status);
        $this->assertNotNull($post->published_at);
        $this->assertTrue($post->isPublished());

        // Verify visible in scopePublished
        $publishedCount = Post::published()->where('id', $post->id)->count();
        $this->assertEquals(1, $publishedCount);

        // Verify visible on homepage
        $homeResponse = $this->get(route('home'));
        $homeResponse->assertStatus(200);
        $homeResponse->assertSee('Judul Artikel Baru Terbit');

        // Verify visible on blog index
        $blogResponse = $this->get(route('blog.index'));
        $blogResponse->assertStatus(200);
        $blogResponse->assertSee('Judul Artikel Baru Terbit');
    }

    public function test_admin_can_create_post_with_local_datetime_and_it_is_immediately_visible(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.posts.store'), [
            'title' => 'Artikel Waktu Lokal Sekarang',
            'content' => '<p>Konten artikel dengan waktu publikasi diisi sekarang.</p>',
            'status' => 'published',
            'visibility' => 'public',
            'published_at' => now()->format('Y-m-d\TH:i'),
        ]);

        $response->assertRedirect(route('admin.posts.index'));

        $post = Post::where('title', 'Artikel Waktu Lokal Sekarang')->first();
        $this->assertNotNull($post);
        $this->assertTrue($post->isPublished());

        $homeResponse = $this->get(route('home'));
        $homeResponse->assertSee('Artikel Waktu Lokal Sekarang');
    }

    public function test_draft_post_is_not_visible_on_public_pages(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.posts.store'), [
            'title' => 'Artikel Rahasia Masih Draf',
            'content' => '<p>Konten rahasia draf.</p>',
            'status' => 'draft',
            'visibility' => 'public',
        ]);

        $response->assertRedirect(route('admin.posts.index'));

        $post = Post::where('title', 'Artikel Rahasia Masih Draf')->first();
        $this->assertNotNull($post);
        $this->assertFalse($post->isPublished());

        // Not in scopePublished
        $this->assertEquals(0, Post::published()->where('id', $post->id)->count());

        // Not on homepage
        $homeResponse = $this->get(route('home'));
        $homeResponse->assertDontSee('Artikel Rahasia Masih Draf');

        // Accessing detail returns 404
        $detailResponse = $this->get(route('blog.show', $post->slug));
        $detailResponse->assertStatus(404);
    }

    public function test_scheduled_post_is_not_visible_until_target_time(): void
    {
        $futureDate = now()->addDays(3);

        $response = $this->actingAs($this->admin)->post(route('admin.posts.store'), [
            'title' => 'Artikel Terjadwal Masa Depan',
            'content' => '<p>Artikel ini terjadwal 3 hari ke depan.</p>',
            'status' => 'published',
            'visibility' => 'public',
            'published_at' => $futureDate->format('Y-m-d\TH:i'),
        ]);

        $response->assertRedirect(route('admin.posts.index'));

        $post = Post::where('title', 'Artikel Terjadwal Masa Depan')->first();
        $this->assertNotNull($post);
        $this->assertFalse($post->isPublished());

        // Public check
        $this->assertEquals(0, Post::published()->where('id', $post->id)->count());
        $homeResponse = $this->get(route('home'));
        $homeResponse->assertDontSee('Artikel Terjadwal Masa Depan');

        // Travel forward in time past the scheduled date
        $this->travelTo($futureDate->copy()->addMinute());

        $this->assertEquals(1, Post::published()->where('id', $post->id)->count());
        $homeResponse = $this->get(route('home'));
        $homeResponse->assertSee('Artikel Terjadwal Masa Depan');
    }

    public function test_updating_draft_to_published_makes_it_visible_immediately(): void
    {
        $post = Post::create([
            'author_id' => $this->admin->id,
            'title' => 'Awalnya Draf',
            'slug' => 'awalnya-draf',
            'content' => '<p>Awalnya draf kemudian terbit.</p>',
            'status' => 'draft',
            'visibility' => 'public',
        ]);

        $this->assertFalse($post->isPublished());

        // Update to published
        $response = $this->actingAs($this->admin)->put(route('admin.posts.update', $post->id), [
            'title' => 'Awalnya Draf Sekarang Terbit',
            'content' => '<p>Sudah terbit sekarang.</p>',
            'status' => 'published',
            'visibility' => 'public',
            'published_at' => null,
        ]);

        $response->assertRedirect(route('admin.posts.index'));

        $post->refresh();
        $this->assertEquals('published', $post->status);
        $this->assertTrue($post->isPublished());

        $homeResponse = $this->get(route('home'));
        $homeResponse->assertSee('Awalnya Draf Sekarang Terbit');
    }
}
