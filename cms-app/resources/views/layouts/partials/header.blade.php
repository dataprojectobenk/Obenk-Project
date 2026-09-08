@php
    use App\Models\Category;
    use App\Models\Setting;

    $siteTitle = Setting::get('site_title', 'Obenk CMS');
    $headerCategories = Category::whereNull('parent_id')
        ->whereHas('posts', fn ($q) => $q->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now()))
        ->withCount(['posts' => fn ($q) => $q->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now())])
        ->take(5)
        ->get();
@endphp

<header class="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 dark:bg-slate-950/85 dark:border-slate-800 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20 gap-4">
            {{-- Brand Logo --}}
            <div class="flex items-center gap-6">
                <a href="{{ route('home') }}" class="flex items-center gap-2.5 group">
                    <div class="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        O
                    </div>
                    <span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {{ $siteTitle }}
                    </span>
                </a>

                {{-- Desktop Navigation Links --}}
                <nav class="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <a href="{{ route('home') }}" class="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800/60 dark:hover:text-indigo-400 transition-colors {{ request()->routeIs('home') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : '' }}">
                        Beranda
                    </a>
                    <a href="{{ route('blog.index') }}" class="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800/60 dark:hover:text-indigo-400 transition-colors {{ request()->routeIs('blog.*') && !request()->routeIs('home') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : '' }}">
                        Blog & Artikel
                    </a>

                    {{-- Categories Dropdown / Links --}}
                    @foreach ($headerCategories as $cat)
                        <a href="{{ route('category.show', $cat->slug) }}" class="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800/60 dark:hover:text-indigo-400 transition-colors">
                            {{ $cat->name }}
                        </a>
                    @endforeach
                </nav>
            </div>

            {{-- Right Header Section: Search & Admin Link --}}
            <div class="flex items-center gap-3">
                {{-- Quick Search Bar --}}
                <form action="{{ route('blog.index') }}" method="GET" class="hidden sm:flex relative items-center">
                    <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari artikel..." class="w-44 lg:w-60 text-xs py-2 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:w-72 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-white">
                    <svg class="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </form>

                {{-- Mobile Hamburger Toggle --}}
                <button type="button" onclick="document.getElementById('mobile-drawer').classList.toggle('hidden')" class="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer" aria-label="Buka Menu">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    {{-- Mobile Drawer Menu --}}
    <div id="mobile-drawer" class="hidden md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 dark:bg-slate-950 dark:border-slate-800">
        <form action="{{ route('blog.index') }}" method="GET" class="relative mb-3">
            <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari artikel..." class="w-full text-sm py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-white">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </form>

        <div class="flex flex-col space-y-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <a href="{{ route('home') }}" class="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Beranda</a>
            <a href="{{ route('blog.index') }}" class="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Blog & Artikel</a>
            @foreach ($headerCategories as $cat)
                <a href="{{ route('category.show', $cat->slug) }}" class="px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 pl-6">
                    {{ $cat->name }}
                </a>
            @endforeach
        </div>
    </div>
</header>

