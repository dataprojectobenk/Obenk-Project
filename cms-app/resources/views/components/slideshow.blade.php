@props([
    'settingKey' => null,
    'category' => null,
    'tag' => null,
    'featured' => false,
    'images' => null,
    'posts' => null,
    'slides' => null,
    'limit' => 5,
    'aspect' => '16/9',
    'effect' => 'slide',
    'autoplay' => true,
    'interval' => 5000,
    'showArrows' => true,
    'showDots' => true,
    'showCounter' => false,
    'pauseOnHover' => true,
    'loop' => true,
])

@php
    use App\Models\Media;
    use App\Models\Post;
    use App\Models\Setting;

    $normalizedSlides = [];

    // 1. Resolve from Setting Key
    if ($settingKey) {
        $settingValue = Setting::get($settingKey);
        if (is_string($settingValue)) {
            $decoded = json_decode($settingValue, true);
            $settingValue = json_last_error() === JSON_ERROR_NONE ? $decoded : $settingValue;
        }

        if (is_array($settingValue)) {
            // Check if array of media IDs or URL strings
            if (!empty($settingValue) && is_numeric($settingValue[0])) {
                $images = Media::whereIn('id', $settingValue)->get();
            } else {
                $images = $settingValue;
            }
        }
    }

    // 2. Resolve from Featured Post Flag
    if ($featured && empty($posts)) {
        $posts = Post::published()
            ->where('is_featured', true)
            ->with(['category', 'featuredImage', 'author'])
            ->latest('published_at')
            ->take($limit)
            ->get();
    }

    // 3. Resolve from Category Slug
    if ($category && empty($posts)) {
        $posts = Post::published()
            ->whereHas('category', fn ($q) => $q->where('slug', $category))
            ->with(['category', 'featuredImage', 'author'])
            ->latest('published_at')
            ->take($limit)
            ->get();
    }

    // 4. Resolve from Tag Slug
    if ($tag && empty($posts)) {
        $posts = Post::published()
            ->whereHas('tags', fn ($q) => $q->where('slug', $tag))
            ->with(['category', 'featuredImage', 'author'])
            ->latest('published_at')
            ->take($limit)
            ->get();
    }

    // 5. Normalize Posts Collection
    if ($posts instanceof \Illuminate\Support\Collection || is_array($posts)) {
        foreach ($posts as $post) {
            $imageUrl = $post->featuredImage?->url ?? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop';
            $normalizedSlides[] = [
                'image' => $imageUrl,
                'alt' => $post->featuredImage?->alt_text ?? $post->title,
                'title' => $post->title,
                'description' => $post->excerpt,
                'badge' => $post->category?->name,
                'badgeUrl' => $post->category ? route('category.show', $post->category->slug) : null,
                'link' => route('blog.show', $post->slug),
                'author' => $post->author?->name,
                'authorAvatar' => $post->author?->avatar_url,
                'date' => $post->published_at ? $post->published_at->translatedFormat('d M Y') : null,
            ];
        }
    }

    // 6. Normalize Images (Array of strings, metadata arrays, or Media Collection)
    elseif ($images) {
        foreach ($images as $img) {
            if (is_string($img)) {
                $normalizedSlides[] = [
                    'image' => $img,
                    'alt' => 'Slideshow Image',
                    'title' => null,
                    'description' => null,
                    'badge' => null,
                    'link' => null,
                ];
            } elseif ($img instanceof Media) {
                $normalizedSlides[] = [
                    'image' => $img->url,
                    'alt' => $img->alt_text ?? $img->original_name,
                    'title' => $img->caption,
                    'description' => null,
                    'badge' => null,
                    'link' => null,
                ];
            } elseif (is_array($img)) {
                $normalizedSlides[] = [
                    'image' => $img['url'] ?? $img['image'] ?? $img['file_path'] ?? '',
                    'alt' => $img['alt'] ?? $img['alt_text'] ?? 'Slideshow Image',
                    'title' => $img['title'] ?? $img['caption'] ?? null,
                    'description' => $img['description'] ?? null,
                    'badge' => $img['badge'] ?? null,
                    'link' => $img['link'] ?? $img['url_link'] ?? null,
                ];
            }
        }
    }

    // 7. Normalize Custom Slides Array
    elseif ($slides && is_array($slides)) {
        $normalizedSlides = $slides;
    }

    $totalSlides = count($normalizedSlides);

    // Aspect Ratio Class Mapping
    $aspectClasses = match($aspect) {
        '16/9' => 'aspect-[16/9]',
        '16/10' => 'aspect-[16/10]',
        '21/9' => 'aspect-[21/9] min-h-[360px]',
        '4/3' => 'aspect-[4/3]',
        '1/1' => 'aspect-square',
        'auto' => 'min-h-[320px] sm:min-h-[460px]',
        default => 'aspect-[16/9]',
    };
@endphp

@if ($totalSlides > 0)
    <div 
        x-data="slideshow({
            total: {{ $totalSlides }},
            autoplay: {{ $autoplay ? 'true' : 'false' }},
            interval: {{ (int) $interval }},
            loop: {{ $loop ? 'true' : 'false' }},
            pauseOnHover: {{ $pauseOnHover ? 'true' : 'false' }},
            effect: '{{ $effect }}'
        })"
        @mouseenter="pauseOnHover && stopAutoplay()"
        @mouseleave="pauseOnHover && autoplay && startAutoplay()"
        @keydown.arrow-right.window="current < total - 1 ? next() : (loop && goTo(0))"
        @keydown.arrow-left.window="current > 0 ? prev() : (loop && goTo(total - 1))"
        @touchstart="handleTouchStart($event)"
        @touchend="handleTouchEnd($event)"
        tabindex="0"
        role="region"
        aria-roledescription="carousel"
        aria-label="Image Slideshow"
        {{ $attributes->merge(['class' => 'relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 select-none group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2']) }}
    >
        {{-- Slides Container --}}
        <div class="relative w-full {{ $aspectClasses }} overflow-hidden">
            @if ($effect === 'fade')
                {{-- FADE EFFECT --}}
                @foreach ($normalizedSlides as $index => $slide)
                    <div 
                        x-show="current === {{ $index }}"
                        x-transition:enter="transition ease-out duration-700"
                        x-transition:enter-start="opacity-0 scale-98"
                        x-transition:enter-end="opacity-100 scale-100"
                        x-transition:leave="transition ease-in duration-500 absolute inset-0"
                        x-transition:leave-start="opacity-100 scale-100"
                        x-transition:leave-end="opacity-0 scale-102"
                        class="absolute inset-0 w-full h-full"
                    >
                        {{-- Slide Image --}}
                        <img 
                            src="{{ $slide['image'] }}" 
                            alt="{{ $slide['alt'] ?? 'Slide image' }}" 
                            class="w-full h-full object-cover object-center"
                            @if ($index === 0) fetchpriority="high" @else loading="lazy" @endif
                        >

                        {{-- Optional Caption / Banner Overlay --}}
                        @if (!empty($slide['title']) || !empty($slide['badge']) || !empty($slide['description']))
                            <div class="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/50 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-14 text-white">
                                <div class="max-w-3xl space-y-3">
                                    @if (!empty($slide['badge']))
                                        <div class="mb-2">
                                            @if (!empty($slide['badgeUrl']))
                                                <x-badge variant="primary" size="sm" :href="$slide['badgeUrl']">
                                                    {{ $slide['badge'] }}
                                                </x-badge>
                                            @else
                                                <x-badge variant="primary" size="sm">
                                                    {{ $slide['badge'] }}
                                                </x-badge>
                                            @endif
                                        </div>
                                    @endif

                                    @if (!empty($slide['title']))
                                        <h3 class="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white hover:text-indigo-300 transition-colors">
                                            @if (!empty($slide['link']))
                                                <a href="{{ $slide['link'] }}">{{ $slide['title'] }}</a>
                                            @else
                                                {{ $slide['title'] }}
                                            @endif
                                        </h3>
                                    @endif

                                    @if (!empty($slide['description']))
                                        <p class="text-xs sm:text-sm md:text-base text-slate-300 line-clamp-2 leading-relaxed">
                                            {{ $slide['description'] }}
                                        </p>
                                    @endif

                                    @if (!empty($slide['author']) || !empty($slide['date']))
                                        <div class="flex items-center gap-3 pt-3 text-xs text-slate-400">
                                            @if (!empty($slide['author']))
                                                <span class="font-medium text-slate-300">{{ $slide['author'] }}</span>
                                            @endif
                                            @if (!empty($slide['date']))
                                                <span>• {{ $slide['date'] }}</span>
                                            @endif
                                        </div>
                                    @endif
                                </div>
                            </div>
                        @endif
                    </div>
                @endforeach
            @else
                {{-- SLIDE EFFECT (TRANSFORMS / TRANSLATE) --}}
                <div 
                    class="flex h-full w-full transition-transform duration-500 ease-out"
                    :style="'transform: translateX(-' + (current * 100) + '%)'"
                >
                    @foreach ($normalizedSlides as $index => $slide)
                        <div class="relative w-full h-full shrink-0">
                            {{-- Slide Image --}}
                            <img 
                                src="{{ $slide['image'] }}" 
                                alt="{{ $slide['alt'] ?? 'Slide image' }}" 
                                class="w-full h-full object-cover object-center"
                                @if ($index === 0) fetchpriority="high" @else loading="lazy" @endif
                            >

                            {{-- Optional Caption / Overlay --}}
                            @if (!empty($slide['title']) || !empty($slide['badge']) || !empty($slide['description']))
                                <div class="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/50 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-14 text-white">
                                    <div class="max-w-3xl space-y-3">
                                        @if (!empty($slide['badge']))
                                            <div class="mb-2">
                                                @if (!empty($slide['badgeUrl']))
                                                    <x-badge variant="primary" size="sm" :href="$slide['badgeUrl']">
                                                        {{ $slide['badge'] }}
                                                    </x-badge>
                                                @else
                                                    <x-badge variant="primary" size="sm">
                                                        {{ $slide['badge'] }}
                                                    </x-badge>
                                                @endif
                                            </div>
                                        @endif

                                        @if (!empty($slide['title']))
                                            <h3 class="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white hover:text-indigo-300 transition-colors">
                                                @if (!empty($slide['link']))
                                                    <a href="{{ $slide['link'] }}">{{ $slide['title'] }}</a>
                                                @else
                                                    {{ $slide['title'] }}
                                                @endif
                                            </h3>
                                        @endif

                                        @if (!empty($slide['description']))
                                            <p class="text-xs sm:text-sm md:text-base text-slate-300 line-clamp-2 leading-relaxed">
                                                {{ $slide['description'] }}
                                            </p>
                                        @endif

                                        @if (!empty($slide['author']) || !empty($slide['date']))
                                            <div class="flex items-center gap-3 pt-3 text-xs text-slate-400">
                                                @if (!empty($slide['author']))
                                                    <span class="font-medium text-slate-300">{{ $slide['author'] }}</span>
                                                @endif
                                                @if (!empty($slide['date']))
                                                    <span>• {{ $slide['date'] }}</span>
                                                @endif
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            @endif
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        {{-- Navigation Arrows (Next / Prev) --}}
        @if ($showArrows && $totalSlides > 1)
            <button 
                type="button" 
                @click="prev()" 
                class="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-slate-900/90 hover:scale-105 transition-all shadow-lg cursor-pointer focus:opacity-100 z-20"
                aria-label="Slide sebelumnya"
            >
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button 
                type="button" 
                @click="next()" 
                class="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-slate-900/90 hover:scale-105 transition-all shadow-lg cursor-pointer focus:opacity-100 z-20"
                aria-label="Slide berikutnya"
            >
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        @endif

        {{-- Dots Pagination Indicators --}}
        @if ($showDots && $totalSlides > 1)
            <div class="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10">
                @foreach ($normalizedSlides as $index => $slide)
                    <button 
                        type="button" 
                        @click="goTo({{ $index }})" 
                        class="h-2 rounded-full transition-all duration-300 cursor-pointer"
                        :class="current === {{ $index }} ? 'w-7 bg-indigo-500 shadow-sm shadow-indigo-400' : 'w-2 bg-white/50 hover:bg-white/80'"
                        aria-label="Ke slide {{ $index + 1 }}"
                    ></button>
                @endforeach
            </div>
        @endif

        {{-- Optional Slide Counter Indicator (e.g. 01 / 05) --}}
        @if ($showCounter && $totalSlides > 1)
            <div class="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono font-bold tracking-wider">
                <span x-text="String(current + 1).padStart(2, '0')"></span> / {{ str_pad($totalSlides, 2, '0', STR_PAD_LEFT) }}
            </div>
        @endif
    </div>
@endif

