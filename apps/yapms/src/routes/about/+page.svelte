<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
</script>

<svelte:head>
	<title>About | Path to Win</title>
	<meta
		name="description"
		content="About Path to Win, an election mapping and political data dashboard for forecasts, results, and historical elections."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-10">
		<nav class="text-xs text-neutral-500" aria-label="Breadcrumb">
			<a href="/" class="hover:underline">Home</a>
			<span class="mx-1">/</span>
			<span>About</span>
		</nav>
		<section class="rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
			<h1 class="text-3xl font-black text-[#001666]">About Path to Win</h1>
			<p class="mt-4 leading-relaxed text-neutral-700">
				Path to Win is an election mapping and political data dashboard for building scenarios,
				reviewing results, and exploring historical election trends across presidential, Senate,
				House, governor, and state-level offices.
			</p>
			<p class="mt-4 leading-relaxed text-neutral-700">
				The site combines interactive maps, race tables, elected official profiles, historical
				archives, and forecasting-style summaries in a clean data-heavy interface.
			</p>
			<p class="mt-4 leading-relaxed text-neutral-700">
				Election results, race ratings, market prices, and map scenarios use different sources and
				have different limits. Read the
				<a class="font-semibold text-[#244999] underline" href="/election-data-methodology">
					election data and methodology
				</a>
				for source notes and definitions.
			</p>
		</section>
	</main>
	<SiteFooter />
</div>
