@extends('layouts.app', [
    'title' => $post->seo_title ?: $post->title,
    'description' => $post->seo_description ?: $post->excerpt,
    'keywords' => $post->seo_keywords,
    'canonicalUrl' => $post->canonical_url ?: route('blog.show', $post->slug),
    'ogImage' => $post->featuredImage?->url,
    'ogType' => 'article',
    'publishedAt' => $post->published_at,
    'authorName' => $post->author?->name,
])

@section('content')
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
    
    {{-- 1. Article Header & Meta --}}
    <header class="space-y-4 text-center sm:text-left">
        <div class="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
            @if ($post->category)
                <x-badge variant="primary" size="md" :href="route('category.show', $post->category->slug)">
                    {{ $post->category->name }}
                </x-badge>
            @endif

            @if ($post->is_featured)
                <span class="bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Unggulan
                </span>
            @endif

            <span class="text-xs text-slate-400 dark:text-slate-500">
                • {{ $post->reading_time }} min baca
            </span>
            <span class="text-xs text-slate-400 dark:text-slate-500">
                • {{ number_format($post->view_count) }} kali dilihat
            </span>
        </div>

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {{ $post->title }}
        </h1>

        @if ($post->excerpt)
            <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {{ $post->excerpt }}
            </p>
        @endif

        {{-- Author Bar --}}
        @if ($post->author)
            <div class="flex items-center justify-center sm:justify-start gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <a href="{{ route('author.show', $post->author->username) }}">
                    <img src="{{ $post->author->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($post->author->name) . '&background=6366f1&color=fff' }}" alt="{{ $post->author->name }}" class="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20">
                </a>
                <div class="text-left text-xs">
                    <a href="{{ route('author.show', $post->author->username) }}" class="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {{ $post->author->name }}
                    </a>
                    <div class="text-slate-400 dark:text-slate-500">
                        Dipublikasikan pada {{ $post->published_at ? $post->published_at->translatedFormat('d F Y') : '' }}
                    </div>
                </div>
            </div>
        @endif
    </header>

    {{-- 2. Featured Image Banner --}}
    @if ($post->featuredImage)
        <figure class="rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-lg dark:bg-slate-900 dark:border-slate-800">
            <img src="{{ $post->featuredImage->url }}" alt="{{ $post->featuredImage->alt_text ?? $post->title }}" class="w-full h-auto max-h-[520px] object-cover object-center">
            @if ($post->featuredImage->caption)
                <figcaption class="p-3 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800">
                    {{ $post->featuredImage->caption }}
                </figcaption>
            @endif
        </figure>
    @endif

    {{-- 3. Article Content (Prose Typography) --}}
    <div class="prose prose-slate lg:prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-2xl prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
        {!! $post->content !!}
    </div>

    {{-- 4. Custom Dynamic Fields Viewer --}}
    @if (!empty($post->custom_fields))
        <x-custom-fields-viewer :fields="$post->custom_fields" />
    @endif

    {{-- 5. Tags & Share Bar --}}
    <div class="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {{-- Tags --}}
        @if ($post->tags->isNotEmpty())
            <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">Tags:</span>
                @foreach ($post->tags as $tag)
                    <x-badge variant="secondary" size="sm" :href="route('tag.show', $tag->slug)">
                        #{{ $tag->name }}
                    </x-badge>
                @endforeach
            </div>
        @endif

        {{-- Share Buttons --}}
        <x-share-buttons :url="url()->current()" :title="$post->title" />
    </div>

    {{-- 6. Author Bio Card --}}
    @if ($post->author)
        <div class="pt-4">
            <x-author-box :author="$post->author" />
        </div>
    @endif

    {{-- 7. Related Posts Grid --}}
    @if ($relatedPosts->isNotEmpty())
        <section class="pt-10 border-t border-slate-200/80 dark:border-slate-800 space-y-6">
            <x-section-header 
                title="Artikel Terkait" 
                subtitle="Baca juga artikel pilihan lainnya dalam kategori yang sama."
            />
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @foreach ($relatedPosts as $related)
                    <x-post-card :post="$related" layout="vertical" :showExcerpt="false" />
                @endforeach
            </div>
        </section>
    @endif

    {{-- 8. Comments & Discussion Section --}}
    <section id="comments" class="pt-12 border-t border-slate-200/80 dark:border-slate-800 space-y-8">
        <div class="flex items-center justify-between">
            <h3 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Diskusi Komentar ({{ $post->approvedComments->count() }})
            </h3>
        </div>

        {{-- Top-Level Comment Submission Form --}}
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 dark:bg-slate-900/60 dark:border-slate-800">
            <h4 class="text-base font-bold text-slate-900 dark:text-white mb-4">Tinggalkan Komentar</h4>
            <x-comment-form :post="$post" />
        </div>

        {{-- Threaded Comments List --}}
        <div class="pt-4">
            <x-comment-thread :comments="$post->approvedComments" :post="$post" />
        </div>
    </section>

</article>
@endsection

