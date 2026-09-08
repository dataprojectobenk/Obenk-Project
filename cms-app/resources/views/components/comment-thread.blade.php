@props([
    'comments' => [],
    'post',
])

<div {{ $attributes->merge(['class' => 'space-y-6']) }}>
    @forelse ($comments as $comment)
        <div id="comment-{{ $comment->id }}" class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 transition-colors">
            {{-- Top author info & timestamp --}}
            <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex items-center gap-3">
                    <img src="{{ $comment->user?->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($comment->displayName) . '&background=6366f1&color=fff' }}" alt="{{ $comment->displayName }}" class="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700">
                    <div>
                        <div class="flex items-center gap-2">
                            <h5 class="text-sm font-bold text-slate-900 dark:text-white">
                                @if ($comment->author_url)
                                    <a href="{{ $comment->author_url }}" target="_blank" rel="nofollow noopener" class="hover:text-indigo-600 dark:hover:text-indigo-400">
                                        {{ $comment->displayName }}
                                    </a>
                                @else
                                    {{ $comment->displayName }}
                                @endif
                            </h5>

                            @if ($comment->user && $comment->user->id === $post->author_id)
                                <span class="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full dark:bg-indigo-950 dark:text-indigo-300">
                                    Penulis
                                </span>
                            @endif
                        </div>
                        <time class="text-xs text-slate-400" datetime="{{ $comment->created_at->toISOString() }}">
                            {{ $comment->created_at->diffForHumans() }}
                        </time>
                    </div>
                </div>

                {{-- Reply trigger button --}}
                <button type="button" onclick="document.getElementById('reply-form-{{ $comment->id }}').classList.toggle('hidden')" class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span>Balas</span>
                </button>
            </div>

            {{-- Comment content --}}
            <div class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-12">
                {{ $comment->content }}
            </div>

            {{-- Hidden Reply Form --}}
            <div id="reply-form-{{ $comment->id }}" class="hidden mt-4 pl-12 pt-4 border-t border-slate-100 dark:border-slate-800">
                <x-comment-form :post="$post" :parentId="$comment->id" :isReply="true" />
            </div>

            {{-- Nested Replies --}}
            @if ($comment->approvedReplies->isNotEmpty())
                <div class="mt-4 pl-8 sm:pl-12 space-y-4 border-l-2 border-indigo-100 dark:border-slate-800">
                    @foreach ($comment->approvedReplies as $reply)
                        <div id="comment-{{ $reply->id }}" class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                            <div class="flex items-center justify-between gap-3 mb-2">
                                <div class="flex items-center gap-2.5">
                                    <img src="{{ $reply->user?->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($reply->displayName) . '&background=6366f1&color=fff' }}" alt="{{ $reply->displayName }}" class="w-7 h-7 rounded-full object-cover">
                                    <div>
                                        <div class="flex items-center gap-1.5">
                                            <span class="text-xs font-bold text-slate-900 dark:text-white">{{ $reply->displayName }}</span>
                                            @if ($reply->user && $reply->user->id === $post->author_id)
                                                <span class="bg-indigo-100 text-indigo-700 text-[9px] font-bold px-1.5 py-0.2 rounded-full dark:bg-indigo-950 dark:text-indigo-300">
                                                    Penulis
                                                </span>
                                            @endif
                                        </div>
                                        <time class="text-[11px] text-slate-400" datetime="{{ $reply->created_at->toISOString() }}">
                                            {{ $reply->created_at->diffForHumans() }}
                                        </time>
                                    </div>
                                </div>
                            </div>
                            <div class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                                {{ $reply->content }}
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    @empty
        <div class="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <p class="text-sm text-slate-500 dark:text-slate-400">Belum ada komentar untuk artikel ini. Jadilah yang pertama memberikan tanggapan!</p>
        </div>
    @endforelse
</div>

