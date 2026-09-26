<script lang="ts">
	import '$lib/styles/global.css';
	import '@fontsource/roboto/400.css';
	import { PUBLIC_UMAMI_URI, PUBLIC_UMAMI_DATA_WEBSITE_ID } from '$env/static/public';
	import SiteNav from '$lib/components/sitenav/SiteNav.svelte';
	import ImportModal from '$lib/components/modals/importmodal/ImportModal.svelte';
	import ThemeModal from '$lib/components/modals/thememodal/ThemeModal.svelte';
	import AuthModal from '$lib/components/modals/authmodal/AuthModal.svelte';
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import SitePageShell from '$lib/components/sitepage/SitePageShell.svelte';

	let { children }: { children: Snippet } = $props();

	// Hide the site nav when a page is loaded in embed mode (e.g. the home page hero iframe).
	let embed = $derived($page.url.searchParams.has('embed'));
	let isHomePage = $derived($page.url.pathname === '/');
	const electionPages = new Map<string, string>([
		['/2028-presidential-election', 'President'],
		['/2028-presidential-election-interactive-map', 'President'],
		['/2026-house-interactive-map', 'House'],
		['/2026-senate-interactive-map', 'Senate'],
		['/2026-governor-interactive-map', 'Governor']
	]);
	const widePagePrefixes = [
		'/elected-officials',
		'/historical-',
		'/maps',
		'/presidential-election-margins',
		'/simulator',
		'/state-election-results',
		'/state-primary-dates',
		'/state-primary-results',
		'/state-trifectas',
		'/state-voting',
		'/states',
		'/election-countdown-clock',
		'/contact-senators',
		'/house-crossover-districts',
		'/house-retirements',
		'/poll-closing-times',
		'/uncontested-house-races'
	];

	function activeSection(pathname: string): string {
		if (pathname === '/news' || pathname.startsWith('/news/')) return 'News';
		if (
			pathname.startsWith('/states') ||
			pathname.startsWith('/state-') ||
			pathname === '/elected-officials'
		)
			return 'States';
		if (pathname.includes('senate')) return 'Senate';
		if (pathname.includes('house')) return 'House';
		if (pathname.includes('governor')) return 'Governor';
		if (pathname.includes('presidential') || pathname.includes('electoral')) return 'President';
		return 'More';
	}

	function isWideContent(pathname: string): boolean {
		return (
			widePagePrefixes.some((prefix) => pathname.startsWith(prefix)) ||
			(/^\/\d{4}-.+-election-results$/.test(pathname) && pathname !== '/2024-election-results')
		);
	}

	let pathname = $derived($page.url.pathname);
	let isAppSurface = $derived(
		pathname === '/view' || pathname === '/app' || pathname.startsWith('/app/')
	);
	let compactCountdown = $derived(
		pathname === '/election-countdown-clock' && $page.url.searchParams.has('compact')
	);
	let hasOwnPageShell = $derived(isHomePage || electionPages.has(pathname));
	let usePublicPageShell = $derived(
		!embed && !compactCountdown && !isAppSurface && !hasOwnPageShell
	);
	let useHomepageNavigation = $derived(!embed && !isAppSurface && !compactCountdown);
	let activeElection = $derived(electionPages.get(pathname) ?? activeSection(pathname));
	let widePublicPage = $derived(isWideContent(pathname));
</script>

<svelte:head>
	<!-- Site-wide canonical + social defaults, derived from the request origin
	     so a future domain move is DNS-only. Pages add their own og:title /
	     og:description; anything they don't set falls back to these. -->
	<link rel="canonical" href={$page.url.origin + ($page.url.pathname.replace(/\/+$/, '') || '/')} />
	<meta property="og:site_name" content="Path to Win" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.origin + $page.url.pathname} />
	<meta property="og:image" content={$page.url.origin + '/og-image.png'} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	{#if PUBLIC_UMAMI_URI}
		<script async src={PUBLIC_UMAMI_URI} data-website-id={PUBLIC_UMAMI_DATA_WEBSITE_ID}></script>
	{/if}
	{#if !isHomePage}
		<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1660456925957249"
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>

<div class="flex flex-col h-full">
	{#if !embed}
		<SiteNav home={useHomepageNavigation} active={activeElection} />
	{/if}
	<div class="flex-1 min-h-0">
		{#if usePublicPageShell}
			<SitePageShell wide={widePublicPage}>{@render children()}</SitePageShell>
		{:else}
			{@render children()}
		{/if}
	</div>
</div>

<ImportModal />
<ThemeModal />
<AuthModal />
