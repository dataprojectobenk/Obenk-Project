@props([
    'title',
    'subtitle' => null,
    'actionUrl' => null,
    'actionText' => 'Lihat Semua',
    'badge' => null,
])

<div {{ $attributes->merge(['class' => 'flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8']) }}>
    <div class="space-y-1">
        @if ($badge)
            <div class="mb-2">
                <x-badge variant="primary" size="sm">{{ $badge }}</x-badge>
            </div>
        @endif
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ $title }}
        </h2>
        @if ($subtitle)
            <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl">
                {{ $subtitle }}
            </p>
        @endif
    </div>

    @if ($actionUrl)
        <div class="flex-shrink-0">
            <a href="{{ $actionUrl }}" class="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 group transition-colors">
                <span>{{ $actionText }}</span>
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>
        </div>
    @endif
</div>

