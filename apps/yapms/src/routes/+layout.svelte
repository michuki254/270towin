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
	<script async src={PUBLIC_UMAMI_URI} data-website-id={PUBLIC_UMAMI_DATA_WEBSITE_ID}></script>
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
