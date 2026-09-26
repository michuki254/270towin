<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	$: snapshotDate = data.dataSnapshotAt
		? new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(
				new Date(data.dataSnapshotAt)
			)
		: 'unavailable';
</script>

<svelte:head>
	<title>Historical Governor Election Results | Interactive U.S. Governor Maps</title>
	<meta
		name="description"
		content="Browse U.S. gubernatorial election cycles from 1976 through 2024 by decade. Compare state race winners and post-election party balance, with sources for each year."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Historical Governor Elections" />
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<article class="mx-auto w-full max-w-6xl px-4 py-6">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Historical Governor Elections</span>
			</nav>
			<h1 class="text-2xl font-bold text-[#001666] md:text-3xl">Historical Governor Elections</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Browse {data.elections.length} annual U.S. gubernatorial cycles from
				{data.yearRange?.first ?? '—'} through {data.yearRange?.last ?? '—'}. Each year page lists
				the states with a recorded race and the party balance across all 50 governorships after that
				cycle, including states without an election that year.
			</p>
			<nav
				class="mt-4 flex flex-wrap gap-2"
				aria-label="Browse governor election results by decade"
			>
				{#each data.decades as decade}
					<a
						href={`#${decade.id}`}
						class="rounded border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-[#244999] hover:bg-neutral-100"
					>
						{decade.label}
						<span class="font-normal text-neutral-500">({decade.elections.length})</span>
					</a>
				{/each}
			</nav>
		</header>

		{#each data.decades as decade}
			<section id={decade.id} class="mt-7 scroll-mt-4">
				<h2 class="mb-3 text-xl font-bold text-[#001666]">{decade.label}</h2>
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{#each decade.elections as e}
						<a
							href={`/historical-governor-elections/${e.year}`}
							class="block rounded-md border border-neutral-200 bg-white p-3 transition-colors hover:border-[#244999] hover:shadow-sm"
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
										class="h-9 w-9 shrink-0 rounded-full border border-neutral-200 bg-white"
									/>
								{:else}
									<span
										class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
										style={`background:${e.winnerColor}`}
									>
										{e.controlName
											.split(' ')
											.map((p) => p[0])
											.slice(0, 2)
											.join('')}
									</span>
								{/if}
								<span class="truncate text-sm text-neutral-700">{e.controlName}</span>
							</div>
							<div class="mt-2 h-1.5 overflow-hidden rounded bg-neutral-200">
								<div
									class="h-full"
									style={`width:${Math.min(100, (e.controlSeats / e.totalSeats) * 100)}%;background:${e.winnerColor}`}
								></div>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/each}

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			<p>
				Governor maps show states with a recorded race in that year. The party balance includes
				holdover governorships. This archive records winning parties, not state vote totals. Its
				bundled data file was generated {snapshotDate}; that timestamp does not mean every
				underlying result was independently reverified on that date.
			</p>
			<a
				class="mt-2 inline-block font-semibold text-[#244999] hover:underline"
				href="/election-data-methodology"
			>
				Read the election data and methodology
			</a>
		</footer>
	</article>
	<SiteFooter />
</div>
