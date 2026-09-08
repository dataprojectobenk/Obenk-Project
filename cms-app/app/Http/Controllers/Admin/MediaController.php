<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $query = Media::with('uploader:id,name');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('original_name', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%")
                    ->orWhere('caption', 'like', "%{$search}%");
            });
        }

        if ($request->filled('mime_type')) {
            $query->where('mime_type', 'like', $request->input('mime_type').'%');
        }

        $media = $query->latest('id')->paginate($request->input('per_page', 24))->withQueryString();

        // Transform collection to append url attribute
        $media->getCollection()->transform(function ($item) {
            $item->url = $item->url;

            return $item;
        });

        if (!$request->hasHeader('X-Inertia') && ($request->wantsJson() || $request->ajax() || $request->has('json'))) {
            return response()->json($media);
        }

        return Inertia::render('Admin/Media/Index', [
            'media' => $media,
            'filters' => $request->only(['search', 'mime_type']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:10240'], // max 10MB
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:255'],
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $mimeType = $file->getMimeType() ?: 'application/octet-stream';
        $size = $file->getSize();
        $extension = $file->getClientOriginalExtension() ?: 'bin';

        $filename = Str::uuid().'.'.$extension;
        $folder = 'uploads/'.date('Y/m');
        $path = $file->storeAs($folder, $filename, 'public');

        $dimensions = null;
        if (str_starts_with($mimeType, 'image/')) {
            $imageSize = @getimagesize($file->getRealPath());
            if ($imageSize) {
                $dimensions = [
                    'width' => $imageSize[0],
                    'height' => $imageSize[1],
                ];
            }
        }

        $media = Media::create([
            'uploader_id' => Auth::id(),
            'disk' => 'public',
            'filename' => $filename,
            'original_name' => $originalName,
            'mime_type' => $mimeType,
            'file_path' => $path,
            'file_size' => $size,
            'alt_text' => $request->input('alt_text'),
            'caption' => $request->input('caption'),
            'dimensions' => $dimensions,
        ]);

        $media->url = $media->url;

        // If called via direct AJAX/Fetch (e.g. MediaPickerModal or Tiptap) rather than Inertia router.post
        if (!$request->hasHeader('X-Inertia') && ($request->wantsJson() || $request->ajax())) {
            return response()->json([
                'success' => true,
                'media' => $media,
            ]);
        }

        return redirect()->back()->with('success', 'File media berhasil diunggah.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Media $media): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:255'],
        ]);

        $media->update($validated);

        if (!$request->hasHeader('X-Inertia') && ($request->wantsJson() || $request->ajax())) {
            return response()->json(['success' => true, 'media' => $media]);
        }

        return redirect()->back()->with('success', 'Informasi media diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Media $media): RedirectResponse|JsonResponse
    {
        // Unset featured_image_id on any referencing posts
        \App\Models\Post::where('featured_image_id', $media->id)->update(['featured_image_id' => null]);

        if ($media->file_path && Storage::disk($media->disk ?? 'public')->exists($media->file_path)) {
            Storage::disk($media->disk ?? 'public')->delete($media->file_path);
        }

        $media->delete();

        if (!$request->hasHeader('X-Inertia') && ($request->wantsJson() || $request->ajax())) {
            return response()->json(['success' => true]);
        }

        return redirect()->back()->with('success', 'Media berhasil dihapus.');
    }
}
