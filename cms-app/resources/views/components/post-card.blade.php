@props([
    'post',
    'layout' => 'vertical',
    'showExcerpt' => true,
    'showAuthor' => true,
    'showCategory' => true,
    'showDate' => true,
    'showReadingTime' => true,
])

@php
    $imageUrl = $post->featuredImage?->url ?? 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop';
@endphp

@if ($layout === 'horizontal')
    {{-- Layout Horizontal (List View) --}}
    <article {{ $attributes->merge(['class' => 'group flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-500/30']) }}>
        <a href="{{ route('blog.show', $post->slug) }}" class="relative w-full sm:w-48 sm:h-36 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
            <img src="{{ $imageUrl }}" alt="{{ $post->featuredImage?->alt_text ?? $post->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
            @if ($post->is_featured)
                <span class="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Unggulan
                </span>
            @endif
        </a>

        <div class="flex flex-col justify-between flex-1 min-w-0">
            <div>
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                    @if ($showCategory && $post->category)
                        <x-badge variant="primary" size="sm" :href="route('category.show', $post->category->slug)">
                            {{ $post->category->name }}
                        </x-badge>
                    @endif
                    @if ($showReadingTime)
                        <span class="text-xs text-slate-400 dark:text-slate-500">
                            • {{ $post->reading_time }} min baca
                        </span>
                    @endif
                </div>

                <h3 class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 dark:text-white dark:group-hover:text-indigo-400">
                    <a href="{{ route('blog.show', $post->slug) }}">
                        {{ $post->title }}
                    </a>
                </h3>

                @if ($showExcerpt && $post->excerpt)
                    <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {{ $post->excerpt }}
                    </p>
                @endif
            </div>

            @if ($showAuthor || $showDate)
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    @if ($showAuthor && $post->author)
                        <a href="{{ route('author.show', $post->author->username) }}" class="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white">
                            <img src="{{ $post->author->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($post->author->name) . '&background=6366f1&color=fff' }}" alt="{{ $post->author->name }}" class="w-5 h-5 rounded-full object-cover">
                            <span class="font-medium truncate max-w-[120px]">{{ $post->author->name }}</span>
                        </a>
                    @endif

                    @if ($showDate && $post->published_at)
                        <time datetime="{{ $post->published_at->toISOString() }}">
                            {{ $post->published_at->translatedFormat('d M Y') }}
                        </time>
                    @endif
                </div>
            @endif
        </div>
    </article>

@elseif ($layout === 'compact')
    {{-- Layout Compact (Sidebar / Minimal View) --}}
    <article {{ $attributes->merge(['class' => 'group flex items-start gap-3 py-3 border-b border-slate-100 last:border-0 dark:border-slate-800']) }}>
        <a href="{{ route('blog.show', $post->slug) }}" class="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 dark:bg-slate-800">
            <img src="{{ $imageUrl }}" alt="{{ $post->featuredImage?->alt_text ?? $post->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy">
        </a>
        <div class="min-w-0 flex-1">
            @if ($showCategory && $post->category)
                <a href="{{ route('category.show', $post->category->slug) }}" class="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    {{ $post->category->name }}
                </a>
            @endif
            <h4 class="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400 line-clamp-2">
                <a href="{{ route('blog.show', $post->slug) }}">
                    {{ $post->title }}
                </a>
            </h4>
            <div class="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                {{ $post->published_at ? $post->published_at->translatedFormat('d M Y') : '' }}
            </div>
        </div>
    </article>

@else
    {{-- Layout Vertical (Standard Grid Card - Default) --}}
    <article {{ $attributes->merge(['class' => 'group flex flex-col h-full rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-500/30']) }}>
        <a href="{{ route('blog.show', $post->slug) }}" class="relative block aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img src="{{ $imageUrl }}" alt="{{ $post->featuredImage?->alt_text ?? $post->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            @if ($post->is_featured)
                <span class="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Unggulan
                </span>
            @endif
        </a>

        <div class="flex flex-col flex-1 p-5 sm:p-6 justify-between">
            <div>
                <div class="flex items-center gap-2 mb-3 flex-wrap">
                    @if ($showCategory && $post->category)
                        <x-badge variant="primary" size="sm" :href="route('category.show', $post->category->slug)">
                            {{ $post->category->name }}
                        </x-badge>
                    @endif
                    @if ($showReadingTime)
                        <span class="text-xs text-slate-400 dark:text-slate-500">
                            {{ $post->reading_time }} min baca
                        </span>
                    @endif
                </div>

                <h3 class="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 dark:text-white dark:group-hover:text-indigo-400">
                    <a href="{{ route('blog.show', $post->slug) }}">
                        {{ $post->title }}
                    </a>
                </h3>

                @if ($showExcerpt && $post->excerpt)
                    <p class="mt-2.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {{ $post->excerpt }}
                    </p>
                @endif
            </div>

            @if ($showAuthor || $showDate)
                <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    @if ($showAuthor && $post->author)
                        <a href="{{ route('author.show', $post->author->username) }}" class="flex items-center gap-2.5 group/author">
                            <img src="{{ $post->author->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($post->author->name) . '&background=6366f1&color=fff' }}" alt="{{ $post->author->name }}" class="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700">
                            <span class="text-xs font-semibold text-slate-700 group-hover/author:text-indigo-600 dark:text-slate-300 dark:group-hover/author:text-indigo-400 truncate max-w-[130px]">
                                {{ $post->author->name }}
                            </span>
                        </a>
                    @endif

                    @if ($showDate && $post->published_at)
                        <time class="text-xs text-slate-400 dark:text-slate-500" datetime="{{ $post->published_at->toISOString() }}">
                            {{ $post->published_at->translatedFormat('d M Y') }}
                        </time>
                    @endif
                </div>
            @endif
        </div>
    </article>
@endif

