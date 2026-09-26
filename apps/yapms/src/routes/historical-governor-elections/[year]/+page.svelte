<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	$: election = data.election;
	$: mapEmbed = election.mapRoute ? `${election.mapRoute}?embed=1` : null;
	$: raceCount = election.raceWinners.reduce((total, group) => total + group.states.length, 0);
	$: raceSummary = election.raceWinners
		.map((group) => `${group.name} ${group.states.length}`)
		.join(', ');
	$: metaDescription = `${election.year} U.S. governor election results: ${raceCount} state races (${raceSummary || 'party results unavailable'}). ${election.controlName} held ${election.controlSeats} of ${election.totalSeats} governorships after the cycle.`;
	$: snapshotDate = new Intl.DateTimeFormat('en-US', {
		dateStyle: 'long',
		timeZone: 'UTC'
	}).format(new Date(election.dataSnapshotAt));
</script>

<svelte:head>
	<title>{election.year} Governor Election Results | Interactive U.S. Governor Map</title>
	<meta name="description" content={metaDescription} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={`${election.year} Governor Election Results`} />
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<article class="max-w-6xl mx-auto w-full px-4 py-6">
		<header>
			<nav class="text-xs text-neutral-500 mb-2" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<a href="/historical-governor-elections" class="hover:underline"
					>Historical Governor Elections</a
				>
				<span class="mx-1">/</span>
				<span>{election.year}</span>
			</nav>

			<div class="flex items-center justify-between gap-3">
				<div class="w-28">
					{#if data.prevYear}
						<a
							href={`/historical-governor-elections/${data.prevYear}`}
							class="inline-flex items-center gap-1 text-sm text-[#244999] hover:underline"
							rel="prev"
						>
							<span aria-hidden="true">&larr;</span>
							{data.prevYear}
						</a>
					{/if}
				</div>
				<h1 class="text-2xl md:text-3xl font-bold text-[#001666] text-center flex-1">
					{election.year} Governor Elections
				</h1>
				<div class="w-28 text-right">
					{#if data.nextYear}
						<a
							href={`/historical-governor-elections/${data.nextYear}`}
							class="inline-flex items-center gap-1 text-sm text-[#244999] hover:underline"
							rel="next"
						>
							{data.nextYear}
							<span aria-hidden="true">&rarr;</span>
						</a>
					{/if}
				</div>
			</div>
		</header>

		<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
			{#if raceCount > 0}
				The archive records {raceCount} state governor races in {election.year}. The party that won
				each listed race appears below. The balance includes all {election.totalSeats} governorships,
				including states that did not hold an election that year.
			{:else}
				The {election.year} governor election cycle is included as a historical summary page. Race outcomes
				are not available in this local dataset yet.
			{/if}
		</p>

		{#if election.raceWinners.length > 0}
			<section class="mt-5 rounded-md border border-neutral-200 bg-white p-4">
				<h2 class="text-sm font-bold uppercase tracking-wide text-[#001666]">
					Governor races by winning party
				</h2>
				<p class="mt-2 text-xs leading-relaxed text-neutral-600">
					These groups name the states with a gubernatorial race and the party recorded as the
					winner in the cited source.
				</p>
				<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each election.raceWinners as group}
						<div class="rounded border border-neutral-200 p-3">
							<h3 class="font-semibold" style={`color:${group.color}`}>
								{group.name} ({group.states.length})
							</h3>
							<ul class="mt-2 flex flex-wrap gap-1.5 text-xs text-neutral-700">
								{#each group.states as state}
									<li class="rounded bg-neutral-100 px-2 py-1">{state}</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<section class="mt-5 bg-white rounded-md border border-neutral-200 p-4">
			<h2 class="text-sm font-bold text-[#001666] uppercase tracking-wide mb-3">
				Balance After Election
			</h2>
			{#if election.candidates.length > 0}
				<div class="flex flex-col gap-3">
					{#each election.candidates as c}
						<div class="flex items-center gap-3">
							{#if c.logo}
								<img
									src={c.logo}
									alt={c.name}
									loading="lazy"
									class="w-12 h-12 rounded-full shrink-0 border border-neutral-200 bg-white"
								/>
							{:else}
								<span
									class="w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white"
									style={`background:${c.color}`}
								>
									{c.name
										.split(' ')
										.map((p) => p[0])
										.slice(0, 2)
										.join('')}
								</span>
							{/if}
							<div class="flex-1 min-w-0">
								<div class="flex justify-between text-sm font-semibold text-neutral-700">
									<span class="truncate">{c.name}</span>
									<span class="shrink-0 ml-2">{c.seats} seats</span>
								</div>
								<div class="mt-1 h-2.5 rounded bg-neutral-200 overflow-hidden">
									<div
										class="h-full"
										style={`width:${(c.seats / election.totalSeats) * 100}%;background:${c.color}`}
									></div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm leading-relaxed text-neutral-700">
					Party control totals are not available in this local map dataset yet.
				</p>
			{/if}
			<p class="mt-3 text-xs text-neutral-500">
				{election.seatsDecided} races mapped &middot; {election.totalSeats} total governorships after
				the election cycle &middot; {election.majority} needed for a majority.
			</p>
		</section>

		{#if election.hasMap && mapEmbed && election.mapRoute}
			<section class="mt-5">
				<div class="rounded-md overflow-hidden border border-neutral-300 bg-white shadow-sm">
					{#key election.year}
						<iframe
							src={mapEmbed}
							title={`${election.year} Governor Election Interactive Map`}
							class="w-full block"
							style="height: 600px; border: 0;"
						></iframe>
					{/key}
				</div>
				<div class="mt-3">
					<a
						href={`${election.mapRoute}?interactive=1`}
						class="inline-block px-4 py-2 rounded bg-[#b60b03] text-white text-sm font-semibold hover:bg-[#8a0802]"
					>
						Open Full Interactive Map
					</a>
				</div>
			</section>
		{/if}

		<section class="mt-5 bg-white rounded-md border border-neutral-200 overflow-hidden">
			<div class="bg-[#244999] text-white px-4 py-2">
				<h2 class="text-sm font-bold uppercase tracking-wide">
					{election.year} Governor Background
				</h2>
			</div>
			<div class="p-4 md:p-5">
				<p class="text-sm leading-relaxed text-neutral-700">{election.details.overview}</p>
				<div class="mt-4 border-t border-neutral-200 pt-3">
					<h3 class="text-xs font-bold uppercase tracking-wide text-neutral-500">Sources</h3>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each election.details.sources as source}
							<a
								href={source.href}
								target="_blank"
								rel="noreferrer"
								class="rounded border border-neutral-300 px-2.5 py-1 text-xs font-semibold text-[#244999] hover:bg-neutral-100"
							>
								{source.label}
							</a>
						{/each}
					</div>
					<p class="mt-3 text-xs leading-relaxed text-neutral-500">
						Bundled governor data file generated {snapshotDate}. This is the file generation date,
						not confirmation that each underlying record was independently reverified then.
						<a
							class="font-semibold text-[#244999] hover:underline"
							href="/election-data-methodology"
						>
							Data methodology
						</a>
					</p>
				</div>
			</div>
		</section>

		<footer class="mt-8 border-t border-neutral-200 pt-4 text-sm">
			<nav class="flex items-center justify-between gap-3">
				<div class="min-w-0">
					{#if data.prevYear}
						<a
							href={`/historical-governor-elections/${data.prevYear}`}
							class="text-[#244999] hover:underline"
							rel="prev"
						>
							&larr; {data.prevYear} Elections
						</a>
					{/if}
				</div>
				<a href="/historical-governor-elections" class="text-neutral-500 hover:underline">
					All Governor Elections
				</a>
				<div class="min-w-0 text-right">
					{#if data.nextYear}
						<a
							href={`/historical-governor-elections/${data.nextYear}`}
							class="text-[#244999] hover:underline"
							rel="next"
						>
							{data.nextYear} Elections &rarr;
						</a>
					{/if}
				</div>
			</nav>
			<div
				class="mt-4 flex flex-col gap-2 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between"
			>
				<p>
					The map shows states with governor races in this cycle; holdover governorships are
					included in the balance totals.
				</p>
				<div class="flex flex-wrap gap-x-3 gap-y-1">
					{#each election.details.sources as source}
						<a
							href={source.href}
							target="_blank"
							rel="noreferrer"
							class="text-[#244999] hover:underline"
						>
							{source.label}
						</a>
					{/each}
				</div>
			</div>
		</footer>
	</article>
	<SiteFooter />
</div>
