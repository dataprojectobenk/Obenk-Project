@props([
    'author',
    'showCount' => true,
])

<div {{ $attributes->merge(['class' => 'p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-5 dark:bg-slate-900/60 dark:border-slate-800']) }}>
    <a href="{{ route('author.show', $author->username) }}" class="n">
        <img src="{{ $author->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($author->name) . '&background=6366f1&color=fff&size=128' }}" alt="{{ $author->name }}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-md">
    </a>

    <div class="flex-1 min-w-0">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
            <div>
                <span class="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">Penulis Artikel</span>
                <h4 class="text-lg font-bold text-slate-900 dark:text-white">
                    <a href="{{ route('author.show', $author->username) }}" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {{ $author->name }}
                    </a>
                </h4>
            </div>

            @if ($showCount && isset($author->posts_count))
                <x-badge variant="secondary" size="sm">
                    {{ $author->posts_count }} Artikel
                </x-badge>
            @endif
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ $author->bio ?? 'Penulis konten dan kontributor di publikasi ini.' }}
        </p>

        <div class="mt-3">
            <a href="{{ route('author.show', $author->username) }}" class="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                <span>Lihat semua tulisan {{ $author->name }}</span>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </a>
        </div>
    </div>
</div>

