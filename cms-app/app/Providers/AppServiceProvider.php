<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Setting;
use App\Models\Tag;
use App\Observers\CategoryObserver;
use App\Observers\CommentObserver;
use App\Observers\PostObserver;
use App\Observers\SettingObserver;
use App\Observers\TagObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Post::observe(PostObserver::class);
        Category::observe(CategoryObserver::class);
        Tag::observe(TagObserver::class);
        Comment::observe(CommentObserver::class);
        Setting::observe(SettingObserver::class);
    }
}
