@props([
    'post',
    'parentId' => null,
    'isReply' => false,
])

<form action="{{ route('comments.store', $post->slug) }}" method="POST" {{ $attributes->merge(['class' => 'space-y-4']) }}>
    @csrf
    
    {{-- Parent ID for threaded replies --}}
    @if ($parentId)
        <input type="hidden" name="parent_id" value="{{ $parentId }}">
    @endif

    {{-- Honeypot field (hidden from real users) --}}
    <div class="hidden" aria-hidden="true">
        <label for="website_hp">Jangan isi kolom ini:</label>
        <input type="text" name="website_hp" id="website_hp" tabindex="-1" autocomplete="off">
    </div>

    @auth
        {{-- Authenticated user info --}}
        <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 dark:bg-slate-800/60 dark:border-slate-700">
            <img src="{{ auth()->user()->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode(auth()->user()->name) . '&background=6366f1&color=fff' }}" alt="{{ auth()->user()->name }}" class="w-8 h-8 rounded-full object-cover">
            <div class="text-xs">
                <span class="text-slate-500 dark:text-slate-400">Masuk sebagai</span>
                <strong class="text-slate-800 dark:text-white ml-1">{{ auth()->user()->name }}</strong>
            </div>
        </div>
    @else
        {{-- Guest user inputs --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label for="author_name_{{ $parentId ?? 'root' }}" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap <span class="text-rose-500">*</span>
                </label>
                <input type="text" name="author_name" id="author_name_{{ $parentId ?? 'root' }}" required value="{{ old('author_name') }}" placeholder="cth. Budi Pratama" class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                @error('author_name')
                    <p class="text-xs text-rose-500 mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="author_email_{{ $parentId ?? 'root' }}" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alamat Email <span class="text-rose-500">*</span>
                </label>
                <input type="email" name="author_email" id="author_email_{{ $parentId ?? 'root' }}" required value="{{ old('author_email') }}" placeholder="budi@example.com" class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                @error('author_email')
                    <p class="text-xs text-rose-500 mt-1">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <div>
            <label for="author_url_{{ $parentId ?? 'root' }}" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Situs Web (Opsional)
            </label>
            <input type="url" name="author_url" id="author_url_{{ $parentId ?? 'root' }}" value="{{ old('author_url') }}" placeholder="https://websiteanda.com" class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-white">
        </div>
    @endauth

    <div>
        <label for="content_{{ $parentId ?? 'root' }}" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {{ $isReply ? 'Tulis Balasan' : 'Pesan Komentar' }} <span class="text-rose-500">*</span>
        </label>
        <textarea name="content" id="content_{{ $parentId ?? 'root' }}" rows="{{ $isReply ? 3 : 4 }}" required placeholder="{{ $isReply ? 'Tulis balasan Anda di sini...' : 'Tulis pandangan atau pertanyaan Anda mengenai artikel ini...' }}" class="w-full text-sm p-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y dark:bg-slate-900 dark:border-slate-700 dark:text-white">{{ old('content') }}</textarea>
        @error('content')
            <p class="text-xs text-rose-500 mt-1">{{ $message }}</p>
        @enderror
    </div>

    <div class="flex items-center justify-between gap-3">
        @if ($isReply)
            <button type="button" onclick="document.getElementById('reply-form-{{ $parentId }}').classList.add('hidden')" class="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">
                Batal
            </button>
        @else
            <span class="text-xs text-slate-400">Komentar dimoderasi sebelum tampil.</span>
        @endif

        <x-button type="submit" variant="primary" size="md">
            <span>{{ $isReply ? 'Kirim Balasan' : 'Kirim Komentar' }}</span>
        </x-button>
    </div>
</form>

