@props([
    'variant' => 'primary',
    'size' => 'md',
    'href' => null,
    'type' => 'button',
])

@php
    $baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer';

    $sizeClasses = match($size) {
        'sm' => 'text-xs px-3 py-1.5 gap-1.5',
        'md' => 'text-sm px-4 py-2.5 gap-2',
        'lg' => 'text-base px-5 py-3 gap-2.5 font-semibold',
        default => 'text-sm px-4 py-2.5 gap-2',
    };

    $variantClasses = match($variant) {
        'primary' => 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 focus:ring-indigo-500 dark:shadow-none',
        'secondary' => 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus:ring-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white',
        'outline' => 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
        'ghost' => 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800',
        'danger' => 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm',
        default => 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    };

    $classes = "{$baseClasses} {$sizeClasses} {$variantClasses}";
@endphp

@if ($href)
    <a href="{{ $href }}" {{ $attributes->merge(['class' => $classes]) }}>
        {{ $slot }}
    </a>
@else
    <button type="{{ $type }}" {{ $attributes->merge(['class' => $classes]) }}>
        {{ $slot }}
    </button>
@endif

