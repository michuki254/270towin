<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Historical Presidential Elections | Interactive Electoral Maps 1788–2024</title>
	<meta
		name="description"
		content="Browse the results of every U.S. presidential election from 1788 to 2024. Explore interactive electoral college maps, winners and electoral vote totals year by year."
	/>
	<link rel="canonical" href="/historical-presidential-elections" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Historical Presidential Elections" />
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<article class="max-w-6xl mx-auto w-full px-4 py-6">
		<header>
			<nav class="text-xs text-neutral-500 mb-2" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Historical Presidential Elections</span>
			</nav>
			<h1 class="text-2xl md:text-3xl font-bold text-[#001666]">Historical Presidential Elections</h1>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
				Explore the results of every U.S. presidential election from 1788 to today. Select any year to
				see its interactive electoral college map, the winner, and the full electoral vote breakdown —
				then use the arrows to step forward and backward through history.
			</p>
		</header>

		<section class="mt-6">
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
				{#each data.elections as e}
					<a
						href={`/historical-presidential-elections/${e.year}`}
						class="block bg-white rounded-md border border-neutral-200 p-3 hover:border-[#244999] hover:shadow-sm transition-colors"
					>
						<div class="flex items-baseline justify-between">
							<span class="text-lg font-bold text-[#001666]">{e.year}</span>
							<span class="text-xs text-neutral-500">{e.winnerEV} EV</span>
						</div>
						<div class="mt-1 flex items-center gap-2">
							{#if e.winnerPortrait}
								<img
									src={e.winnerPortrait}
									alt={e.winner}
									loading="lazy"
									class="w-9 h-9 rounded-full object-cover object-top border-2 shrink-0"
									style={`border-color:${e.winnerColor}`}
								/>
							{:else}
								<span
									class="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
									style={`background:${e.winnerColor}`}
								>
									{e.winner
										.split(' ')
										.map((p) => p[0])
										.slice(0, 2)
										.join('')}
								</span>
							{/if}
							<span class="text-sm text-neutral-700 truncate">{e.winner}</span>
						</div>
						<div class="mt-2 h-1.5 rounded bg-neutral-200 overflow-hidden">
							<div
								class="h-full"
								style={`width:${Math.min(100, (e.winnerEV / e.totalEV) * 100)}%;background:${e.winnerColor}`}
							></div>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			Electoral vote totals are derived from each election&rsquo;s interactive map. Use any year&rsquo;s
			page to view and modify the full map.
		</footer>
	</article>
</div>
