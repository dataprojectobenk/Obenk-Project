@props([
    'url',
    'title',
])

@php
    $encodedUrl = urlencode($url);
    $encodedTitle = urlencode($title);
@endphp

<div {{ $attributes->merge(['class' => 'flex items-center gap-2 flex-wrap']) }}>
    <span class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2">
        Bagikan:
    </span>

    {{-- WhatsApp --}}
    <a href="https://api.whatsapp.com/send?text={{ $encodedTitle }}%20{{ $encodedUrl }}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all duration-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white" title="Bagikan ke WhatsApp">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
    </a>

    {{-- X / Twitter --}}
    <a href="https://x.com/intent/tweet?text={{ $encodedTitle }}&url={{ $encodedUrl }}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all duration-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-900" title="Bagikan ke X">
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
    </a>

    {{-- Facebook --}}
    <a href="https://www.facebook.com/sharer/sharer.php?u={{ $encodedUrl }}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-200 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white" title="Bagikan ke Facebook">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
    </a>

    {{-- LinkedIn --}}
    <a href="https://www.linkedin.com/sharing/share-offsite/?url={{ $encodedUrl }}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white flex items-center justify-center transition-all duration-200 dark:bg-sky-950/40 dark:text-sky-400 dark:hover:bg-sky-600 dark:hover:text-white" title="Bagikan ke LinkedIn">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
    </a>

    {{-- Copy Link Button --}}
    <button type="button" onclick="navigator.clipboard.writeText('{{ $url }}'); alert('Tautan artikel berhasil disalin!');" class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer" title="Salin Tautan">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    </button>
</div>

