@php
    use App\Models\Category;
    use App\Models\Setting;

    $siteTitle = Setting::get('site_title', 'Obenk CMS');
    $siteTagline = Setting::get('site_tagline', 'Modern Tailored CMS Engine');
    $siteDescription = Setting::get('site_description', 'Ultra-fast, SEO-optimized Content Management System.');
    
    $footerCategories = Category::whereNull('parent_id')
        ->whereHas('posts', fn ($q) => $q->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now()))
        ->withCount(['posts' => fn ($q) => $q->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now())])
        ->take(6)
        ->get();

    $facebookUrl = Setting::get('social_facebook');
    $twitterUrl = Setting::get('social_twitter');
    $instagramUrl = Setting::get('social_instagram');
    $githubUrl = Setting::get('social_github');
@endphp

<footer class="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {{-- Column 1: Brand & Bio --}}
            <div class="md:col-span-2 space-y-4">
                <a href="{{ route('home') }}" class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md">
                        O
                    </div>
                    <span class="text-xl font-extrabold tracking-tight text-white">
                        {{ $siteTitle }}
                    </span>
                </a>
                <p class="text-slate-400 text-sm max-w-md leading-relaxed">
                    {{ $siteDescription }}
                </p>

                {{-- Social Icons --}}
                <div class="flex items-center gap-3 pt-2">
                    @if ($facebookUrl)
                        <a href="{{ $facebookUrl }}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-indigo-600 flex items-center justify-center transition-all">
                            <span class="sr-only">Facebook</span>
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                    @endif
                    @if ($twitterUrl)
                        <a href="{{ $twitterUrl }}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all">
                            <span class="sr-only">X Twitter</span>
                            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                    @endif
                    @if ($githubUrl)
                        <a href="{{ $githubUrl }}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all">
                            <span class="sr-only">GitHub</span>
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                        </a>
                    @endif
                </div>
            </div>

            {{-- Column 2: Categories --}}
            <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Kategori Populer</h4>
                <ul class="space-y-2 text-sm">
                    @foreach ($footerCategories as $cat)
                        <li>
                            <a href="{{ route('category.show', $cat->slug) }}" class="hover:text-indigo-400 transition-colors flex items-center justify-between">
                                <span>{{ $cat->name }}</span>
                                <span class="text-xs text-slate-500">({{ $cat->posts_count }})</span>
                            </a>
                        </li>
                    @endforeach
                </ul>
            </div>

            {{-- Column 3: Quick Navigation --}}
            <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Tautan Pintas</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="{{ route('home') }}" class="hover:text-indigo-400 transition-colors">Beranda</a></li>
                    <li><a href="{{ route('blog.index') }}" class="hover:text-indigo-400 transition-colors">Katalog Artikel</a></li>
                    <li><a href="{{ route('blog.index') }}?q=" class="hover:text-indigo-400 transition-colors">Pencarian</a></li>
                </ul>
            </div>
        </div>

        {{-- Bottom Copyright --}}
        <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
                &copy; {{ date('Y') }} {{ $siteTitle }}. All rights reserved.
            </div>
            <div>
                Built with <span class="text-indigo-400">Laravel Blade SSR</span> + <span class="text-indigo-400">Tailwind CSS</span>.
            </div>
        </div>
    </div>
</footer>

