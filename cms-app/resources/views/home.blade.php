@extends('layouts.app')

@php
    use App\Models\Setting;
    $siteTagline = Setting::get('site_tagline', 'Modern Tailored CMS Engine');
@endphp

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-20">
    
    {{-- 1. Hero Featured Post --}}
    @if ($featuredPost)
        <x-hero-card :post="$featuredPost" />
    @endif

    {{-- 2. Popular Categories Bar --}}
    @if ($categories->isNotEmpty())
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Jelajahi Topik Populer
                </h3>
            </div>
            <div class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                <a href="{{ route('blog.index') }}" class="shrink-0 px-4 py-2 rounded-2xl text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm hover:scale-105 transition-transform">
                    Semua Topik
                </a>
                @foreach ($categories as $cat)
                    <a href="{{ route('category.show', $cat->slug) }}" class="shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold bg-white border border-slate-200/80 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:text-indigo-400">
                        <span>{{ $cat->name }}</span>
                        <span class="text-[10px] text-slate-400 dark:text-slate-500">({{ $cat->posts_count }})</span>
                    </a>
                @endforeach
            </div>
        </section>
    @endif

    {{-- 3. Recent Articles Section --}}
    <section>
        <x-section-header 
            title="Artikel Terbaru" 
            subtitle="Temukan wawasan, tutorial teknis, dan informasi terhangat yang dirilis oleh para kontributor kami."
            :actionUrl="route('blog.index')"
            actionText="Lihat Semua Artikel"
            badge="Terbitan Baru"
        />

        @if ($recentPosts->isNotEmpty())
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                @foreach ($recentPosts as $post)
                    <x-post-card :post="$post" />
                @endforeach
            </div>
        @else
            <x-empty-state />
        @endif
    </section>

    {{-- 4. Newsletter / Call to Action Box --}}
    <x-newsletter-box />

</div>
@endsection

