@props([
    'variant' => 'primary',
    'size' => 'md',
    'href' => null,
])

@php
    $baseClasses = 'inline-flex items-center font-medium transition-colors duration-150 rounded-full';
    
    $sizeClasses = match($size) {
        'sm' => 'text-xs px-2.5 py-0.5',
        'md' => 'text-xs px-3 py-1',
        'lg' => 'text-sm px-3.5 py-1.5',
        default => 'text-xs px-3 py-1',
    };

    $variantClasses = match($variant) {
        'primary' => 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60',
        'secondary' => 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        'dark' => 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900',
        'outline' => 'border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800',
        'success' => 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300',
        'warning' => 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300',
        default => 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    };

    $classes = "{$baseClasses} {$sizeClasses} {$variantClasses}";
@endphp

@if ($href)
    <a href="{{ $href }}" {{ $attributes->merge(['class' => $classes]) }}>
        {{ $slot }}
    </a>
@else
    <span {{ $attributes->merge(['class' => $classes]) }}>
        {{ $slot }}
    </span>
@endif

