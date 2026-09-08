@extends('layouts.app', [
    'title' => "Tag: #{$tag->name}",
    'description' => "Kumpulan artikel dengan label topik #{$tag->name}.",
    'canonicalUrl' => route('tag.show', $tag->slug),
])

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
    
    {{-- Tag Header --}}
    <header class="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-2">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Arsip Label Topik</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            #{{ $tag->name }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
            Ditemukan {{ $posts->total() }} artikel yang diberi label topik ini.
        </p>
    </header>

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
            title="Belum Ada Artikel dengan Tag Ini"
            description="Saat ini belum ada artikel yang diberi label #{{ $tag->name }}."
            :actionUrl="route('blog.index')"
            actionText="Lihat Artikel Lainnya"
        />
    @endif

</div>
@endsection

