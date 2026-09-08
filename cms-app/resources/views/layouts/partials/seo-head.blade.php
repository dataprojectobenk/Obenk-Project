@php
    use App\Models\Setting;

    $siteTitle = Setting::get('site_title', 'Obenk CMS');
    $siteTagline = Setting::get('site_tagline', 'Modern Tailored CMS Engine');
    
    // Page Title
    $pageTitle = isset($title) && $title 
        ? "{$title} — {$siteTitle}" 
        : "{$siteTitle} — {$siteTagline}";

    // Description
    $metaDescription = $description 
        ?? Setting::get('default_meta_description', 'Official website powered by Obenk CMS Engine.');

    // Keywords
    $metaKeywords = $keywords 
        ?? Setting::get('default_meta_keywords', 'cms, laravel, blade, react, blog');

    // Canonical URL
    $canonical = $canonicalUrl ?? url()->current();

    // OpenGraph
    $ogType = $type ?? 'website';
    $ogImage = $image ?? (Setting::get('site_logo') ?: asset('favicon.ico'));

    if ($ogType === 'article') {
        $jsonLd = [
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'headline' => $title ?? $pageTitle,
            'description' => $metaDescription,
            'image' => $ogImage,
            'author' => [
                '@type' => 'Person',
                'name' => $authorName ?? $siteTitle,
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => $siteTitle,
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => $ogImage,
                ],
            ],
            'datePublished' => isset($publishedAt) && $publishedAt ? $publishedAt->toIso8601String() : null,
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $canonical,
            ],
        ];
    } else {
        $jsonLd = [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => $siteTitle,
            'url' => url('/'),
            'description' => $metaDescription,
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => route('blog.index') . '?q={search_term_string}',
                'query-input' => 'required name=search_term_string',
            ],
        ];
    }
@endphp

{{-- Standard SEO Meta Tags --}}
<title>{{ $pageTitle }}</title>
<meta name="description" content="{{ $metaDescription }}">
<meta name="keywords" content="{{ $metaKeywords }}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{{ $canonical }}">

{{-- Open Graph / Facebook --}}
<meta property="og:type" content="{{ $ogType }}">
<meta property="og:site_name" content="{{ $siteTitle }}">
<meta property="og:url" content="{{ $canonical }}">
<meta property="og:title" content="{{ $pageTitle }}">
<meta property="og:description" content="{{ $metaDescription }}">
@if ($ogImage)
    <meta property="og:image" content="{{ $ogImage }}">
@endif
@if (isset($publishedAt) && $publishedAt)
    <meta property="article:published_time" content="{{ $publishedAt->toIso8601String() }}">
@endif
@if (isset($authorName) && $authorName)
    <meta property="article:author" content="{{ $authorName }}">
@endif

{{-- Twitter Card --}}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="{{ $canonical }}">
<meta name="twitter:title" content="{{ $pageTitle }}">
<meta name="twitter:description" content="{{ $metaDescription }}">
@if ($ogImage)
    <meta name="twitter:image" content="{{ $ogImage }}">
@endif

{{-- Schema.org JSON-LD Structured Data --}}
<script type="application/ld+json">
{!! json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) !!}
</script>

