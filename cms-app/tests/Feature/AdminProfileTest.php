<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        Storage::fake('public');
    }

    public function test_guest_cannot_access_profile_page(): void
    {
        $response = $this->get('/admin/profile');
        $response->assertRedirect('/admin/login');
    }

    public function test_authenticated_user_can_view_profile_page(): void
    {
        $user = User::where('email', 'admin@obenk.test')->first();

        $response = $this->actingAs($user)->get('/admin/profile');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Profile/Index')
            ->has('user')
            ->where('user.email', $user->email)
            ->where('user.username', $user->username)
        );
    }

    public function test_user_can_update_profile_info(): void
    {
        $user = User::where('email', 'admin@obenk.test')->first();

        $response = $this->actingAs($user)->post('/admin/profile', [
            'name' => 'Super Administrator Baru',
            'username' => 'superadmin_new',
            'email' => 'superadmin_new@obenk.test',
            'bio' => 'Ini adalah bio profil terbaru admin.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $user->refresh();
        $this->assertEquals('Super Administrator Baru', $user->name);
        $this->assertEquals('superadmin_new', $user->username);
        $this->assertEquals('superadmin_new@obenk.test', $user->email);
        $this->assertEquals('Ini adalah bio profil terbaru admin.', $user->bio);
    }

    public function test_user_cannot_update_profile_with_duplicate_username_or_email(): void
    {
        $user1 = User::where('email', 'admin@obenk.test')->first();
        $user2 = User::factory()->create([
            'username' => 'existinguser',
            'email' => 'existing@obenk.test',
        ]);

        $response = $this->actingAs($user1)->post('/admin/profile', [
            'name' => 'Admin Test',
            'username' => 'existinguser',
            'email' => 'existing@obenk.test',
        ]);

        $response->assertSessionHasErrors(['username', 'email']);
    }

    public function test_user_can_upload_avatar(): void
    {
        $user = User::where('email', 'admin@obenk.test')->first();
        $file = UploadedFile::fake()->create('avatar.jpg', 100, 'image/jpeg');

        $response = $this->actingAs($user)->post('/admin/profile', [
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'avatar' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $user->refresh();
        $this->assertNotNull($user->avatar_url);
        $this->assertStringContainsString('uploads/avatars/', $user->avatar_url);
    }

    public function test_user_can_update_password_with_correct_current_password(): void
    {
        $user = User::where('email', 'admin@obenk.test')->first();

        $response = $this->actingAs($user)->put('/admin/profile/password', [
            'current_password' => 'password',
            'password' => 'NewSecretPassword123!',
            'password_confirmation' => 'NewSecretPassword123!',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $user->refresh();
        $this->assertTrue(Hash::check('NewSecretPassword123!', $user->password));
    }

    public function test_user_cannot_update_password_with_incorrect_current_password(): void
    {
        $user = User::where('email', 'admin@obenk.test')->first();

        $response = $this->actingAs($user)->put('/admin/profile/password', [
            'current_password' => 'wrong-current-password',
            'password' => 'NewSecretPassword123!',
            'password_confirmation' => 'NewSecretPassword123!',
        ]);

        $response->assertSessionHasErrors('current_password');

        $user->refresh();
        $this->assertTrue(Hash::check('password', $user->password));
    }

    public function test_user_cannot_update_password_without_matching_confirmation(): void
    {
        $user = User::where('email', 'admin@obenk.test')->first();

        $response = $this->actingAs($user)->put('/admin/profile/password', [
            'current_password' => 'password',
            'password' => 'NewSecretPassword123!',
            'password_confirmation' => 'MismatchPassword456!',
        ]);

        $response->assertSessionHasErrors('password');
    }
}
