<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CommentController as AdminCommentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TagController as AdminTagController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Public SSR Frontend
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
Route::post('/blog/{slug}/comments', [CommentController::class, 'store'])->name('comments.store');

Route::get('/category/{slug}', [CategoryController::class, 'show'])->name('category.show');
Route::get('/tag/{slug}', [TagController::class, 'show'])->name('tag.show');
Route::get('/author/{username}', [AuthorController::class, 'show'])->name('author.show');

/*
|--------------------------------------------------------------------------
| Admin Panel Routes (Inertia.js React 19 SPA)
|--------------------------------------------------------------------------
*/

Route::get('/login', fn () => redirect()->route('admin.login'))->name('login');

Route::prefix('admin')->name('admin.')->group(function () {
    // Guest auth routes
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

    // Protected admin routes
    Route::middleware(['auth'])->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Posts CRUD
        Route::resource('posts', AdminPostController::class)->except(['show']);

        // Categories CRUD
        Route::resource('categories', AdminCategoryController::class)->except(['create', 'show', 'edit']);

        // Tags CRUD
        Route::resource('tags', AdminTagController::class)->except(['create', 'show', 'edit']);

        // Media CRUD & Upload
        Route::resource('media', MediaController::class)
            ->parameters(['media' => 'media'])
            ->only(['index', 'store', 'update', 'destroy']);

        // Comments Management
        Route::get('/comments', [AdminCommentController::class, 'index'])->name('comments.index');
        Route::put('/comments/{comment}/status', [AdminCommentController::class, 'updateStatus'])->name('comments.status');
        Route::delete('/comments/{comment}', [AdminCommentController::class, 'destroy'])->name('comments.destroy');

        // Users & Roles Management
        Route::resource('users', UserController::class)->except(['show', 'create', 'edit']);
        Route::resource('roles', RoleController::class)->except(['show', 'create', 'edit']);

        // Profile Management
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

        // Settings
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

        // Activity Logs
        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::delete('/activity-logs/clear', [ActivityLogController::class, 'clear'])->name('activity-logs.clear');
    });
});
