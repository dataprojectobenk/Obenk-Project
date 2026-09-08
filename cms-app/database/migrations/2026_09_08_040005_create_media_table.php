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
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('uploader_id')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->string('disk', 50)->default('public');
            $table->string('filename', 255);
            $table->string('original_name', 255)->index();
            $table->string('mime_type', 100)->index();
            $table->string('file_path', 500);
            $table->unsignedBigInteger('file_size');
            $table->string('alt_text', 255)->nullable();
            $table->text('caption')->nullable();
            $table->json('dimensions')->nullable();
            $table->timestamps();
            $table->softDeletes()->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
