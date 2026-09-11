<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->constrained('users')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('featured_image_id')->nullable()->constrained('media')->nullOnDelete()->cascadeOnUpdate();
            $table->string('title', 255);
            $table->string('slug', 200)->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->enum('visibility', ['public', 'private', 'password'])->default('public');
            $table->boolean('is_featured')->default(false)->index();
            $table->unsignedSmallInteger('reading_time')->default(1);
            $table->unsignedBigInteger('view_count')->default(0)->index();
            $table->unsignedInteger('comment_count')->default(0);
            $table->string('seo_title', 255)->nullable();
            $table->string('seo_description', 300)->nullable();
            $table->string('seo_keywords', 255)->nullable();
            $table->string('canonical_url', 500)->nullable();
            $table->json('custom_fields')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes()->index();

            $table->index(['status', 'published_at']);

            if (Schema::getConnection()->getDriverName() !== 'sqlite') {
                $table->fullText(['title', 'content']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};

