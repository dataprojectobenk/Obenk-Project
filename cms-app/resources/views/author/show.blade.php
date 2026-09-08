@extends('layouts.app', [
    'title' => "Penulis: {$author->name}",
    'description' => $author->bio ?? "Kumpulan artikel yang ditulis oleh {$author->name}.",
    'canonicalUrl' => route('author.show', $author->username),
    'ogImage' => $author->avatar_url,
])

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
    
    {{-- Author Profile Card --}}
    <header class="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img src="{{ $author->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($author->name) . '&background=6366f1&color=fff&size=200' }}" alt="{{ $author->name }}" class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md">
            
            <div class="flex-1 space-y-3">
                <div>
                    <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Profil Penulis</span>
                    <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {{ $author->name }}
                    </h1>
                    <div class="text-xs text-slate-400">
                        @ {{ $author->username }}
                    </div>
                </div>

                <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {{ $author->bio ?? 'Penulis aktif dan kontributor tulisan di platform ini.' }}
                </p>

                <div class="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span class="font-semibold text-slate-900 dark:text-white">{{ $posts->total() }}</span> Total Artikel
                    <span>•</span>
                    <span class="font-semibold text-slate-900 dark:text-white">{{ number_format($totalViews) }}</span> Total Pembaca
                </div>
            </div>
        </div>
    </header>

    {{-- Author Articles Grid --}}
    <section class="space-y-6">
        <x-section-header 
            title="Daftar Tulisan" 
            subtitle="Seluruh artikel yang dipublikasikan oleh {{ $author->name }}."
        />

        @if ($posts->isNotEmpty())
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                @foreach ($posts as $post)
                    <x-post-card :post="$post" :showAuthor="false" />
                @endforeach
            </div>

            {{-- Pagination --}}
            <div class="pt-8">
                {{ $posts->links() }}
            </div>
        @else
            <x-empty-state 
                title="Penulis Belum Memiliki Artikel"
                description="Saat ini {{ $author->name }} belum memiliki artikel yang dipublikasikan."
                :actionUrl="route('blog.index')"
                actionText="Jelajahi Artikel Lainnya"
            />
        @endif
    </section>

</div>
@endsection

