@props([
    'title' => 'Tidak Ada Artikel Ditemukan',
    'description' => 'Maaf, belum ada artikel yang sesuai dengan kriteria atau kata kunci pencarian Anda.',
    'actionUrl' => null,
    'actionText' => 'Kembali ke Blog',
])

<div {{ $attributes->merge(['class' => 'text-center py-16 px-6 max-w-md mx-auto']) }}>
    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center dark:bg-slate-800 dark:text-slate-400">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
    </div>

    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {{ $title }}
    </h3>

    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        {{ $description }}
    </p>

    @if ($actionUrl)
        <x-button variant="primary" size="md" :href="$actionUrl">
            {{ $actionText }}
        </x-button>
    @endif
</div>

