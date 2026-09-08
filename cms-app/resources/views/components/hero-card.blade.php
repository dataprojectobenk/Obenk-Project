@props([
    'post',
])

@php
    $imageUrl = $post->featuredImage?->url ?? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop';
@endphp

<section {{ $attributes->merge(['class' => 'relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl shadow-slate-950/20 text-white']) }}>
    {{-- Background Image with Gradient Overlay --}}
    <div class="absolute inset-0 z-0">
        <img src="{{ $imageUrl }}" alt="{{ $post->featuredImage?->alt_text ?? $post->title }}" class="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity hover:scale-105 transition-transform duration-700">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>
    </div>

    {{-- Content --}}
    <div class="relative z-10 p-6 sm:p-10 md:p-16 max-w-4xl flex flex-col justify-end min-h-[420px] sm:min-h-[480px]">
        <div class="flex items-center gap-3 mb-4 flex-wrap">
            <span class="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-indigo-500/30">
                Sorotan Utama
            </span>
            @if ($post->category)
                <x-badge variant="dark" size="md" :href="route('category.show', $post->category->slug)" class="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20">
                    {{ $post->category->name }}
                </x-badge>
            @endif
            <span class="text-xs text-slate-300">
                • {{ $post->reading_time }} min baca
            </span>
        </div>

        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4 hover:text-indigo-300 transition-colors">
            <a href="{{ route('blog.show', $post->slug) }}">
                {{ $post->title }}
            </a>
        </h1>

        @if ($post->excerpt)
            <p class="text-base sm:text-lg text-slate-300 mb-8 line-clamp-3 max-w-3xl leading-relaxed">
                {{ $post->excerpt }}
            </p>
        @endif

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
            @if ($post->author)
                <a href="{{ route('author.show', $post->author->username) }}" class="flex items-center gap-3 group">
                    <img src="{{ $post->author->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($post->author->name) . '&background=6366f1&color=fff' }}" alt="{{ $post->author->name }}" class="w-10 h-10 rounded-full object-cover ring-2 ring-white/20">
                    <div>
                        <div class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {{ $post->author->name }}
                        </div>
                        <div class="text-xs text-slate-400">
                            {{ $post->published_at ? $post->published_at->translatedFormat('d F Y') : '' }}
                        </div>
                    </div>
                </a>
            @endif

            <div>
                <x-button variant="primary" size="md" :href="route('blog.show', $post->slug)">
                    <span>Baca Selengkapnya</span>
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </x-button>
            </div>
        </div>
    </div>
</section>

