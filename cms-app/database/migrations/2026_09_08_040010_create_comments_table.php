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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('parent_id')->nullable()->constrained('comments')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('author_name', 100)->nullable();
            $table->string('author_email', 150)->nullable()->index();
            $table->string('author_url', 255)->nullable();
            $table->string('author_ip', 45)->nullable();
            $table->text('content');
            $table->enum('status', ['approved', 'pending', 'spam'])->default('pending');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['post_id', 'status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};

