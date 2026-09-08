@props([
    'fields' => [],
])

@if (!empty($fields) && is_array($fields))
    <div {{ $attributes->merge(['class' => 'my-8 p-5 sm:p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40']) }}>
        <div class="flex items-center gap-2 mb-4 text-indigo-700 dark:text-indigo-300">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 class="text-sm font-bold uppercase tracking-wider">Informasi Tambahan Konten</h4>
        </div>

        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @foreach ($fields as $key => $val)
                <div class="p-3 bg-white rounded-xl border border-indigo-100/60 dark:bg-slate-900 dark:border-slate-800">
                    <dt class="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">
                        {{ str_replace(['_', '-'], ' ', $key) }}
                    </dt>
                    <dd class="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                        @if (is_array($val))
                            {{ json_encode($val, JSON_PRETTY_PRINT) }}
                        @else
                            {{ $val }}
                        @endif
                    </dd>
                </div>
            @endforeach
        </dl>
    </div>
@endif

