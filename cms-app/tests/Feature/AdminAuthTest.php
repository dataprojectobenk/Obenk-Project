<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_guest_is_redirected_to_admin_login_when_accessing_dashboard(): void
    {
        $response = $this->get('/admin');
        $response->assertRedirect('/admin/login');
    }

    public function test_admin_login_page_renders_successfully(): void
    {
        $response = $this->get('/admin/login');
        $response->assertStatus(200);
    }

    public function test_user_can_authenticate_with_email_and_password(): void
    {
        $response = $this->post('/admin/login', [
            'login' => 'admin@obenk.test',
            'password' => 'password',
        ]);

        $response->assertRedirect('/admin');
        $this->assertAuthenticated();
    }

    public function test_user_can_authenticate_with_username(): void
    {
        $response = $this->post('/admin/login', [
            'login' => 'admin',
            'password' => 'password',
        ]);

        $response->assertRedirect('/admin');
        $this->assertAuthenticated();
    }

    public function test_user_cannot_authenticate_with_invalid_password(): void
    {
        $response = $this->post('/admin/login', [
            'login' => 'admin@obenk.test',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('login');
        $this->assertGuest();
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::where('email', 'admin@obenk.test')->first();

        $response = $this->actingAs($user)->post('/admin/logout');

        $response->assertRedirect('/admin/login');
        $this->assertGuest();
    }
}
