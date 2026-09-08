<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicWebTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_homepage_returns_successful_response(): void
    {
        $response = $this->get(route('home'));

        $response->assertStatus(200);
        $response->assertSee('Obenk CMS');
        $response->assertSee('Artikel Terbaru');
    }

    public function test_blog_index_and_search(): void
    {
        $response = $this->get(route('blog.index'));
        $response->assertStatus(200);
        $response->assertSee('Katalog Artikel');

        // Search test
        $searchResponse = $this->get(route('blog.index', ['q' => 'Laravel']));
        $searchResponse->assertStatus(200);
        $searchResponse->assertSee('Hasil Pencarian');
    }

    public function test_single_post_view_and_view_counter(): void
    {
        $post = Post::published()->first();
        $this->assertNotNull($post);

        $initialViews = $post->view_count;

        $response = $this->get(route('blog.show', $post->slug));
        $response->assertStatus(200);
        $response->assertSee($post->title);

        $this->assertEquals($initialViews + 1, $post->fresh()->view_count);

        // Subsequent hit in same session does not increment twice
        $this->get(route('blog.show', $post->slug));
        $this->assertEquals($initialViews + 1, $post->fresh()->view_count);
    }

    public function test_category_archive(): void
    {
        $category = Category::where('slug', 'teknologi')->first();
        $this->assertNotNull($category);

        $response = $this->get(route('category.show', $category->slug));
        $response->assertStatus(200);
        $response->assertSee($category->name);
    }

    public function test_tag_archive(): void
    {
        $tag = Tag::first();
        $this->assertNotNull($tag);

        $response = $this->get(route('tag.show', $tag->slug));
        $response->assertStatus(200);
        $response->assertSee($tag->name);
    }

    public function test_author_archive(): void
    {
        $author = User::where('username', 'admin')->first();
        $this->assertNotNull($author);

        $response = $this->get(route('author.show', $author->username));
        $response->assertStatus(200);
        $response->assertSee($author->name);
    }

    public function test_comment_submission_guest(): void
    {
        $post = Post::published()->first();

        $response = $this->post(route('comments.store', $post->slug), [
            'author_name' => 'Tamu Pengunjung',
            'author_email' => 'tamu@example.com',
            'author_url' => 'https://example.com',
            'content' => 'Artikel ini sangat bermanfaat dan mudah dipahami.',
        ]);

        $response->assertRedirect(route('blog.show', $post->slug).'#comments');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('comments', [
            'post_id' => $post->id,
            'author_name' => 'Tamu Pengunjung',
            'author_email' => 'tamu@example.com',
        ]);
    }

    public function test_comment_submission_honeypot_rejection(): void
    {
        $post = Post::published()->first();

        $response = $this->post(route('comments.store', $post->slug), [
            'author_name' => 'Spammer Bot',
            'author_email' => 'spam@bot.test',
            'content' => 'Buy cheap stuff now!',
            'website_hp' => 'http://spam-link.test', // Bot fills hidden honeypot
        ]);

        $response->assertSessionHas('error');
        $this->assertDatabaseMissing('comments', [
            'author_name' => 'Spammer Bot',
        ]);
    }
}
