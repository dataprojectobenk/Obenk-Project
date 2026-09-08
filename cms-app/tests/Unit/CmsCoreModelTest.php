<?php

namespace Tests\Unit;

use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CmsCoreModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_user_rbac_and_relationships(): void
    {
        $admin = User::where('username', 'admin')->first();
        $this->assertNotNull($admin);
        $this->assertTrue($admin->hasRole('super-admin'));
        $this->assertTrue($admin->hasPermission('posts.publish'));
        $this->assertTrue($admin->hasPermission('settings.edit'));

        $author = User::where('username', 'author')->first();
        $this->assertNotNull($author);
        $this->assertTrue($author->hasRole('author'));
        $this->assertTrue($author->hasPermission('posts.create'));
        $this->assertFalse($author->hasPermission('settings.edit'));
    }

    public function test_category_and_hierarchy(): void
    {
        $tech = Category::where('slug', 'teknologi')->first();
        $this->assertNotNull($tech);

        $laravel = Category::where('slug', 'laravel')->first();
        $this->assertNotNull($laravel);
        $this->assertEquals($tech->id, $laravel->parent_id);
        $this->assertEquals($tech->name, $laravel->parent->name);
        $this->assertTrue($tech->children->pluck('slug')->contains('laravel'));
    }

    public function test_post_observer_auto_slug_and_reading_time(): void
    {
        $admin = User::where('username', 'admin')->first();
        $cat = Category::first();

        $post = Post::create([
            'author_id' => $admin->id,
            'category_id' => $cat->id,
            'title' => 'Menguji Auto Slug dan Estimasi Waktu Baca Secara Otomatis',
            'content' => str_repeat('Kata demi kata dirangkai menjadi sebuah kalimat panjang untuk menguji perhitungan waktu baca. ', 50),
            'status' => 'draft',
        ]);

        $this->assertNotEmpty($post->slug);
        $this->assertEquals('menguji-auto-slug-dan-estimasi-waktu-baca-secara-otomatis', $post->slug);
        $this->assertGreaterThanOrEqual(1, $post->reading_time);

        $post->forceDelete();
    }

    public function test_category_counter_cache_observer(): void
    {
        $admin = User::where('username', 'admin')->first();
        $cat = Category::create(['name' => 'Counter Cache Test Category']);
        $this->assertEquals(0, $cat->fresh()->post_count);

        $post = Post::create([
            'author_id' => $admin->id,
            'category_id' => $cat->id,
            'title' => 'Post Counter Cache Testing',
            'content' => 'Content here',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->assertEquals(1, $cat->fresh()->post_count);

        $post->status = 'draft';
        $post->save();
        $this->assertEquals(0, $cat->fresh()->post_count);

        $post->status = 'published';
        $post->save();
        $this->assertEquals(1, $cat->fresh()->post_count);

        $post->delete();
        $this->assertEquals(0, $cat->fresh()->post_count);

        $post->restore();
        $this->assertEquals(1, $cat->fresh()->post_count);

        $post->forceDelete();
        $cat->delete();
    }

    public function test_comment_observer_counter_cache(): void
    {
        $admin = User::where('username', 'admin')->first();
        $cat = Category::first();

        $post = Post::create([
            'author_id' => $admin->id,
            'category_id' => $cat->id,
            'title' => 'Comment Counter Test Post',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->assertEquals(0, $post->fresh()->comment_count);

        $comment = Comment::create([
            'post_id' => $post->id,
            'user_id' => $admin->id,
            'content' => 'This is a test comment',
            'status' => 'approved',
        ]);

        $this->assertEquals(1, $post->fresh()->comment_count);

        $comment->status = 'spam';
        $comment->save();
        $this->assertEquals(0, $post->fresh()->comment_count);

        $comment->status = 'approved';
        $comment->save();
        $this->assertEquals(1, $post->fresh()->comment_count);

        $comment->delete();
        $this->assertEquals(0, $post->fresh()->comment_count);

        $comment->forceDelete();
        $post->forceDelete();
    }

    public function test_settings_caching_and_helpers(): void
    {
        Setting::set('test_key', 'test_value', 'general', true);
        $this->assertEquals('test_value', Setting::get('test_key'));

        Setting::set('test_key', 'updated_value', 'general', true);
        $this->assertEquals('updated_value', Setting::get('test_key'));

        Setting::where('key_name', 'test_key')->delete();
        Setting::clearCache('test_key');
    }

    public function test_activity_log_record(): void
    {
        $admin = User::where('username', 'admin')->first();
        $log = ActivityLog::record('test.action', $admin, ['old' => 'val'], ['new' => 'val'], $admin);

        $this->assertNotNull($log);
        $this->assertEquals('test.action', $log->action_name);
        $this->assertEquals($admin->id, $log->user_id);
        $this->assertEquals(User::class, $log->entity_type);
        $this->assertEquals($admin->id, $log->entity_id);

        $log->delete();
    }
}
