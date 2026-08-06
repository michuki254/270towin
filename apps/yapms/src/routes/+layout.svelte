<script lang="ts">
	import '$lib/styles/global.css';
	import '@fontsource/roboto/400.css';
	import { PUBLIC_UMAMI_URI, PUBLIC_UMAMI_DATA_WEBSITE_ID } from '$env/static/public';
	import SiteNav from '$lib/components/sitenav/SiteNav.svelte';
	import ImportModal from '$lib/components/modals/importmodal/ImportModal.svelte';
	import ThemeModal from '$lib/components/modals/thememodal/ThemeModal.svelte';
	import AuthModal from '$lib/components/modals/authmodal/AuthModal.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	// Hide the site nav when a page is loaded in embed mode (e.g. the home page hero iframe).
	$: embed = browser && $page.url.searchParams.has('embed');
	$: isHomePage = $page.url.pathname === '/';
</script>

<svelte:head>
	<!-- Site-wide canonical + social defaults, derived from the request origin
	     so a future domain move is DNS-only. Pages add their own og:title /
	     og:description; anything they don't set falls back to these. The home
	     page renders the same interactive map as the 2028 page, so it
	     canonicalises there; every other route canonicalises to itself. -->
	<link
		rel="canonical"
		href={$page.url.origin +
			($page.url.pathname === '/' ? '/2028-presidential-election-interactive-map' : $page.url.pathname)}
	/>
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
		<SiteNav />
	{/if}
	<div class="flex-1 min-h-0">
		<slot />
	</div>
</div>

<ImportModal />
<ThemeModal />
<AuthModal />
