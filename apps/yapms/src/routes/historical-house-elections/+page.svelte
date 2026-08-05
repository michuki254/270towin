<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Historical House Election Results | Interactive U.S. House Maps</title>
	<meta
		name="description"
		content="Browse historical U.S. House election result maps. Explore House control, seat totals, and district-by-district results for completed elections."
	/>
	<link rel="canonical" href="/historical-house-elections" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Historical House Elections" />
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<article class="max-w-6xl mx-auto w-full px-4 py-6">
		<header>
			<nav class="text-xs text-neutral-500 mb-2" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Historical House Elections</span>
			</nav>
			<h1 class="text-2xl md:text-3xl font-bold text-[#001666]">Historical House Elections</h1>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
				Explore U.S. House election cycles with district-level interactive maps where historical
				district geography and winner data are available. Balance totals use the official House
				party division after each election.
			</p>
		</header>

		<section class="mt-6">
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
				{#each data.elections as e}
					<a
						href={`/historical-house-elections/${e.year}`}
						class="block bg-white rounded-md border border-neutral-200 p-3 hover:border-[#244999] hover:shadow-sm transition-colors"
					>
						<div class="flex items-baseline justify-between">
							<span class="text-lg font-bold text-[#001666]">{e.year}</span>
							<span class="text-xs text-neutral-500">
								{#if e.hasMap}
									{e.controlSeats} seats
								{:else}
									summary
								{/if}
							</span>
						</div>
						<div class="mt-2 flex items-center gap-2">
							{#if e.winnerLogo}
								<img
									src={e.winnerLogo}
									alt={e.controlName}
									loading="lazy"
									class="w-9 h-9 rounded-full shrink-0 border border-neutral-200 bg-white"
								/>
							{:else}
								<span
									class="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
									style={`background:${e.winnerColor}`}
								>
									{e.controlName
										.split(' ')
										.map((p) => p[0])
										.slice(0, 2)
										.join('')}
								</span>
							{/if}
							<span class="text-sm text-neutral-700 truncate">{e.controlName}</span>
						</div>
						<div class="mt-2 h-1.5 rounded bg-neutral-200 overflow-hidden">
							<div
								class="h-full"
								style={`width:${e.hasMap ? Math.min(100, (e.controlSeats / e.totalSeats) * 100) : 33}%;background:${e.winnerColor}`}
							></div>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			District winners are derived from MIT Election Lab constituency returns. Chamber balance
			totals are derived from the official U.S. House party division table.
		</footer>
	</article>
	<SiteFooter />
</div>
