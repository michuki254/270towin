<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
</script>

<svelte:head>
	<title>States Visited Map | Path to Win</title>
	<meta name="description" content="Create a custom states visited map using the Path to Win map app." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>States Visited</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">States Visited Map</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Use a blank U.S. map to mark visited states, travel goals, or custom regional categories.
			</p>
		</header>
		<section class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
			<iframe
				src="/app/usa/states_and_territories/2023001/blank?embed=1"
				title="States visited interactive map"
				class="block h-[560px] w-full border-0"
				loading="lazy"
			></iframe>
		</section>
		<a class="w-fit rounded bg-[#b60b03] px-4 py-2 text-sm font-bold text-white hover:bg-[#8f0802]" href="/app/usa/states_and_territories/2023001/blank">
			Open Full States Map
		</a>
	</main>
	<SiteFooter />
</div>
