@extends('layouts.app', [
    'title' => "Kategori: {$category->name}",
    'description' => $category->description ?? "Arsip kumpulan artikel dalam kategori {$category->name}.",
    'canonicalUrl' => route('category.show', $category->slug),
    'ogImage' => $category->image_url,
])

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
    
    {{-- Category Header Banner --}}
    <header class="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        @if ($category->image_url)
            <img src="{{ $category->image_url }}" alt="{{ $category->name }}" class="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>
        @endif

        <div class="relative z-10 max-w-3xl space-y-3">
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Arsip Kategori</span>
            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                {{ $category->name }}
            </h1>
            @if ($category->description)
                <p class="text-base sm:text-lg text-slate-300 leading-relaxed">
                    {{ $category->description }}
                </p>
            @endif

            <div class="pt-2 text-xs text-slate-400">
                Total {{ $posts->total() }} artikel dipublikasikan
            </div>
        </div>
    </header>

    {{-- Subcategories pills if any --}}
    @if ($category->children->isNotEmpty())
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex-shrink-0">Sub-kategori:</span>
            @foreach ($category->children as $child)
                <a href="{{ route('category.show', $child->slug) }}" class="flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
                    {{ $child->name }} ({{ $child->posts_count }})
                </a>
            @endforeach
        </div>
    @endif

    {{-- Articles Grid --}}
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
            title="Belum Ada Artikel dalam Kategori Ini"
            description="Saat ini belum ada artikel yang diterbitkan di bawah kategori {{ $category->name }}."
            :actionUrl="route('blog.index')"
            actionText="Lihat Artikel Lainnya"
        />
    @endif

</div>
@endsection

