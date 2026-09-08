<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>{{ config('app.name', 'Obenk CMS') }} - Admin</title>

    <script>
        // Check theme preference immediately to prevent flash
        (function() {
            try {
                const storedTheme = localStorage.getItem('admin_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (storedTheme === 'dark' || (!storedTheme && prefersDark) || !storedTheme) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } catch (e) {}
        })();
    </script>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

    <!-- Scripts -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/admin.jsx'])
    @inertiaHead
</head>
<body class="h-full font-sans antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
    @inertia
</body>
</html>

