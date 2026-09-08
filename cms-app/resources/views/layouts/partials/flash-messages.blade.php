@if (session('success'))
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div class="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm shadow-sm dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200">
            <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1 font-medium">
                {{ session('success') }}
            </div>
        </div>
    </div>
@endif

@if (session('error'))
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div class="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm shadow-sm dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200">
            <svg class="w-5 h-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1 font-medium">
                {{ session('error') }}
            </div>
        </div>
    </div>
@endif

