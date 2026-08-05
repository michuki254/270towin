<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Historical Governor Election Results | Interactive U.S. Governor Maps</title>
	<meta
		name="description"
		content="Browse historical U.S. gubernatorial election result maps. Explore governor party control, state races, and post-election balance totals."
	/>
	<link rel="canonical" href="/historical-governor-elections" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Historical Governor Elections" />
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<article class="max-w-6xl mx-auto w-full px-4 py-6">
		<header>
			<nav class="text-xs text-neutral-500 mb-2" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Historical Governor Elections</span>
			</nav>
			<h1 class="text-2xl md:text-3xl font-bold text-[#001666]">Historical Governor Elections</h1>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
				Explore U.S. gubernatorial election cycles from 1976 through 2024. Each mapped year
				shows the states that held governor elections and the post-election party balance across
				the 50 governorships.
			</p>
		</header>

		<section class="mt-6">
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
				{#each data.elections as e}
					<a
						href={`/historical-governor-elections/${e.year}`}
						class="block bg-white rounded-md border border-neutral-200 p-3 hover:border-[#244999] hover:shadow-sm transition-colors"
					>
						<div class="flex items-baseline justify-between">
							<span class="text-lg font-bold text-[#001666]">{e.year}</span>
							<span class="text-xs text-neutral-500">
								{#if e.hasMap}
									{e.seatsDecided} races
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
								style={`width:${Math.min(100, (e.controlSeats / e.totalSeats) * 100)}%;background:${e.winnerColor}`}
							></div>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			Governor maps show states decided in that year. Balance totals include holdover
			governorships after the election cycle.
		</footer>
	</article>
	<SiteFooter />
</div>
