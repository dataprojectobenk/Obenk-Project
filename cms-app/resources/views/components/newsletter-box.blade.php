@props([
    'title' => 'Dapatkan Update Artikel & Tutorial Terbaru',
    'description' => 'Berlangganan buletin berkala kami langsung ke kotak masuk Anda. Tanpa spam, Anda dapat berhenti berlangganan kapan saja.',
])

<div {{ $attributes->merge(['class' => 'relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-8 sm:p-12 shadow-xl shadow-indigo-500/10 my-12']) }}>
    {{-- Decorative Blobs --}}
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-900/40 rounded-full blur-2xl pointer-events-none"></div>

    <div class="relative z-10 max-w-2xl mx-auto text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-white mb-4 backdrop-blur-md">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        </div>

        <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            {{ $title }}
        </h3>

        <p class="text-sm sm:text-base text-indigo-100 mb-8 leading-relaxed">
            {{ $description }}
        </p>

        <form onsubmit="event.preventDefault(); alert('Terima kasih telah berlangganan buletin kami!'); this.reset();" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" required placeholder="Masukkan alamat email Anda..." class="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-md">
            <button type="submit" class="px-6 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer flex-shrink-0">
                Langganan
            </button>
        </form>
    </div>
</div>

