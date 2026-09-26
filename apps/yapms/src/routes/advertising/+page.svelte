<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
</script>

<svelte:head>
	<title>Advertising | Path to Win</title>
	<meta
		name="description"
		content="Advertising and sponsorship opportunities on Path to Win election maps and political data dashboards."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-10">
		<nav class="text-xs text-neutral-500" aria-label="Breadcrumb">
			<a href="/" class="hover:underline">Home</a>
			<span class="mx-1">/</span>
			<span>Advertising</span>
		</nav>
		<section class="rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
			<h1 class="text-3xl font-black text-[#001666]">Advertising</h1>
			<p class="mt-4 leading-relaxed text-neutral-700">
				Path to Win reaches readers who are actively exploring political maps, forecasts,
				historical results, and election data. Sponsorships can be aligned with national map
				pages, historical archives, state dashboards, and embeddable tools.
			</p>
			<a
				class="mt-6 inline-flex rounded bg-[#b60b03] px-4 py-2 text-sm font-bold text-white hover:bg-[#8f0802]"
				href="mailto:advertising@pathtowin.com"
			>
				Request Media Kit
			</a>
		</section>
	</main>
	<SiteFooter />
</div>
