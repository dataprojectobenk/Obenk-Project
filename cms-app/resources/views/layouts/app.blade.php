<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Dynamic SEO Head Tags --}}
    @include('layouts.partials.seo-head', [
        'title' => $title ?? null,
        'description' => $description ?? null,
        'keywords' => $keywords ?? null,
        'canonicalUrl' => $canonicalUrl ?? null,
        'image' => $ogImage ?? null,
        'type' => $ogType ?? 'website',
        'publishedAt' => $publishedAt ?? null,
        'authorName' => $authorName ?? null,
    ])

    {{-- Styles & Scripts via Vite --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('styles')
</head>
<body class="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-100">
    {{-- Header Navigation --}}
    @include('layouts.partials.header')

    {{-- Flash Notifications --}}
    @include('layouts.partials.flash-messages')

    {{-- Main Content Area --}}
    <main class="flex-1">
        {{ $slot ?? '' }}
        @yield('content')
    </main>

    {{-- Footer --}}
    @include('layouts.partials.footer')

    @stack('scripts')
</body>
</html>

