@extends('layouts.app')

@php
    $pageTitle = 'Katalog Artikel & Publikasi';
    if ($searchQuery) {
        $pageTitle = "Hasil Pencarian: \"{$searchQuery}\"";
    } elseif ($activeCategory) {
        $pageTitle = "Kategori: {$activeCategory->name}";
    } elseif ($activeTag) {
        $pageTitle = "Tag: #{$activeTag->name}";
    }
@endphp

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
    
    {{-- Page Header & Filter Info --}}
    <div class="space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800">
            <div>
                <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {{ $pageTitle }}
                </h1>
                <p class="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">
                    Menampilkan {{ $posts->total() }} artikel publikasi terdaftar.
                </p>
            </div>

            {{-- Filter Search Input --}}
            <form action="{{ route('blog.index') }}" method="GET" class="relative flex items-center w-full md:w-80">
                @if ($activeCategory)
                    <input type="hidden" name="category" value="{{ $activeCategory->slug }}">
                @endif
                @if ($activeTag)
                    <input type="hidden" name="tag" value="{{ $activeTag->slug }}">
                @endif

                <input type="text" name="q" value="{{ $searchQuery }}" placeholder="Cari dalam artikel..." class="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-white">
                <svg class="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </form>
        </div>

        {{-- Active Filters Chips --}}
        @if ($searchQuery || $activeCategory || $activeTag)
            <div class="flex items-center gap-2 flex-wrap text-xs">
                <span class="text-slate-400 font-medium">Filter Aktif:</span>
                @if ($searchQuery)
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        Pencarian: "{{ $searchQuery }}"
                        <a href="{{ route('blog.index', array_filter(['category' => request('category'), 'tag' => request('tag')])) }}" class="hover:text-rose-500 ml-1">×</a>
                    </span>
                @endif
                @if ($activeCategory)
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        Kategori: {{ $activeCategory->name }}
                        <a href="{{ route('blog.index', array_filter(['q' => request('q'), 'tag' => request('tag')])) }}" class="hover:text-rose-500 ml-1">×</a>
                    </span>
                @endif
                @if ($activeTag)
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        Tag: #{{ $activeTag->name }}
                        <a href="{{ route('blog.index', array_filter(['q' => request('q'), 'category' => request('category')])) }}" class="hover:text-rose-500 ml-1">×</a>
                    </span>
                @endif
                <a href="{{ route('blog.index') }}" class="text-indigo-600 hover:underline font-semibold ml-2">
                    Reset Filter
                </a>
            </div>
        @endif

        {{-- Categories Filter Tabs --}}
        @if ($categories->isNotEmpty())
            <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <a href="{{ route('blog.index') }}" class="px-3 py-1.5 rounded-xl text-xs font-semibold {{ !$activeCategory ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300' }} transition-colors">
                    Semua
                </a>
                @foreach ($categories as $cat)
                    <a href="{{ route('blog.index', ['category' => $cat->slug]) }}" class="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap {{ $activeCategory && $activeCategory->id === $cat->id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300' }} transition-colors">
                        {{ $cat->name }}
                    </a>
                @endforeach
            </div>
        @endif
    </div>

    {{-- Posts Grid / List --}}
    @if ($posts->isNotEmpty())
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            @foreach ($posts as $post)
                <x-post-card :post="$post" />
            @endforeach
        </div>

        {{-- Pagination --}}
        <div class="pt-8">
            {{ $posts->links() }}
        </div>
    @else
        <x-empty-state 
            title="Tidak Ada Artikel Ditemukan"
            description="Belum ada artikel yang cocok dengan filter atau kata kunci yang Anda masukkan. Silakan coba kata kunci lain atau reset filter."
            :actionUrl="route('blog.index')"
            actionText="Lihat Semua Artikel"
        />
    @endif

</div>
@endsection

