<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminMediaManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $role = Role::create([
            'name' => 'Super Administrator',
            'slug' => 'super-admin',
            'description' => 'Akses penuh seluruh modul',
        ]);

        $this->adminUser = User::factory()->create([
            'email' => 'admin@obenk.test',
            'username' => 'admin',
        ]);

        $this->adminUser->roles()->attach($role->id);
    }

    public function test_admin_can_view_media_library_via_inertia(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->get('/admin/media');

        $response->assertStatus(200);
    }

    public function test_admin_can_upload_media_via_inertia_and_receive_redirect_response(): void
    {
        $file = UploadedFile::fake()->create('test-photo.jpg', 100, 'image/jpeg');

        $response = $this->actingAs($this->adminUser)
            ->withHeader('X-Inertia', 'true')
            ->from('/admin/media')
            ->post('/admin/media', [
                'file' => $file,
                'alt_text' => 'Test Photo',
                'caption' => 'A test caption',
            ]);

        $response->assertRedirect('/admin/media');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('media', [
            'original_name' => 'test-photo.jpg',
            'alt_text' => 'Test Photo',
            'caption' => 'A test caption',
        ]);
    }

    public function test_admin_can_upload_media_via_json_api(): void
    {
        $file = UploadedFile::fake()->create('api-photo.png', 100, 'image/png');

        $response = $this->actingAs($this->adminUser)
            ->postJson('/admin/media', [
                'file' => $file,
                'alt_text' => 'API Photo',
            ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'media' => ['id', 'original_name', 'url'],
        ]);
    }

    public function test_admin_can_update_media_metadata(): void
    {
        $media = Media::create([
            'uploader_id' => $this->adminUser->id,
            'disk' => 'public',
            'filename' => 'old.jpg',
            'original_name' => 'old.jpg',
            'mime_type' => 'image/jpeg',
            'file_path' => 'uploads/old.jpg',
            'file_size' => 5000,
            'alt_text' => 'Old Alt',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->withHeader('X-Inertia', 'true')
            ->from('/admin/media')
            ->put("/admin/media/{$media->id}", [
                'alt_text' => 'Updated Alt Text',
                'caption' => 'Updated Caption',
            ]);

        $response->assertRedirect('/admin/media');
        $this->assertDatabaseHas('media', [
            'id' => $media->id,
            'alt_text' => 'Updated Alt Text',
            'caption' => 'Updated Caption',
        ]);
    }

    public function test_admin_can_delete_media(): void
    {
        $file = UploadedFile::fake()->create('to-delete.jpg', 100, 'image/jpeg');
        $path = $file->storeAs('uploads', 'to-delete.jpg', 'public');

        $media = Media::create([
            'uploader_id' => $this->adminUser->id,
            'disk' => 'public',
            'filename' => 'to-delete.jpg',
            'original_name' => 'to-delete.jpg',
            'mime_type' => 'image/jpeg',
            'file_path' => $path,
            'file_size' => 5000,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->withHeader('X-Inertia', 'true')
            ->from('/admin/media')
            ->delete("/admin/media/{$media->id}");

        $response->assertRedirect('/admin/media');
        $this->assertSoftDeleted('media', ['id' => $media->id]);
    }
}

