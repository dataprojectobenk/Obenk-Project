<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of activity logs.
     */
    public function index(Request $request): Response
    {
        $query = ActivityLog::with('user:id,name,username,email,avatar_url');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('action_name', 'like', "%{$search}%")
                    ->orWhere('entity_type', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        $logs = $query->latest('id')->paginate(25)->withQueryString();

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'user_id']),
        ]);
    }

    /**
     * Clear all activity logs.
     */
    public function clear(): RedirectResponse
    {
        ActivityLog::truncate();

        return redirect()->back()->with('success', 'Semua riwayat aktivitas telah dibersihkan.');
    }
}
