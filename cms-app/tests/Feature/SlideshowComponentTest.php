<?php

namespace Tests\Feature;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Blade;
use Tests\TestCase;

class SlideshowComponentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_renders_image_only_slideshow(): void
    {
        $html = Blade::render('<x-slideshow :images="$images" aspect="16/9" />', [
            'images' => [
                'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
                'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200',
            ],
        ]);

        $this->assertStringContainsString('photo-1518770660439-4636190af475', $html);
        $this->assertStringContainsString('photo-1507238691740-187a5b1d37b8', $html);
        $this->assertStringContainsString('x-data="slideshow({', $html);
        $this->assertStringContainsString('total: 2', $html);
    }

    public function test_renders_featured_posts_slideshow_dynamically(): void
    {
        $html = Blade::render('<x-slideshow :featured="true" :limit="3" effect="fade" />');

        $this->assertStringContainsString('x-data="slideshow({', $html);
        $this->assertStringContainsString("effect: 'fade'", $html);
        $this->assertStringContainsString('Membangun CMS Modern', $html);
    }

    public function test_renders_category_posts_slideshow_dynamically(): void
    {
        $html = Blade::render('<x-slideshow :category="\'laravel\'" :limit="2" />');

        $this->assertStringContainsString('x-data="slideshow({', $html);
        $this->assertStringContainsString('Membangun CMS Modern', $html);
    }

    public function test_renders_setting_key_slideshow_dynamically(): void
    {
        Setting::set('test_slideshow_key', json_encode([
            'https://example.com/banner-1.jpg',
            'https://example.com/banner-2.jpg',
        ]), 'general', true);

        $html = Blade::render('<x-slideshow :settingKey="\'test_slideshow_key\'" />');

        $this->assertStringContainsString('banner-1.jpg', $html);
        $this->assertStringContainsString('banner-2.jpg', $html);
        $this->assertStringContainsString('total: 2', $html);
    }

    public function test_renders_empty_when_no_data(): void
    {
        $html = Blade::render('<x-slideshow :images="[]" />');

        $this->assertEmpty(trim($html));
    }
}
