<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	$: election = data.election;
	$: mapEmbed = election.mapRoute ? `${election.mapRoute}?embed=1` : null;
	$: metaDescription = election.hasMap
		? `Results of the ${election.year} U.S. House election: ${election.controlName} held ${election.controlSeats} of ${election.totalSeats} seats after ${election.seatsDecided} ${election.mapUnit} were mapped.`
		: `Historical summary for the ${election.year} U.S. House election cycle with House election context and source links.`;
</script>

<svelte:head>
	<title>{election.year} House Election Results | Interactive U.S. House Map</title>
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href={`/historical-house-elections/${election.year}`} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={`${election.year} House Election Results`} />
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<article class="max-w-6xl mx-auto w-full px-4 py-6">
		<header>
			<nav class="text-xs text-neutral-500 mb-2" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<a href="/historical-house-elections" class="hover:underline">Historical House Elections</a>
				<span class="mx-1">/</span>
				<span>{election.year}</span>
			</nav>

			<div class="flex items-center justify-between gap-3">
				<div class="w-28">
					{#if data.prevYear}
						<a
							href={`/historical-house-elections/${data.prevYear}`}
							class="inline-flex items-center gap-1 text-sm text-[#244999] hover:underline"
							rel="prev"
						>
							<span aria-hidden="true">&larr;</span>
							{data.prevYear}
						</a>
					{/if}
				</div>
				<h1 class="text-2xl md:text-3xl font-bold text-[#001666] text-center flex-1">
					{election.year} House Election
				</h1>
				<div class="w-28 text-right">
					{#if data.nextYear}
						<a
							href={`/historical-house-elections/${data.nextYear}`}
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
			{#if election.hasMap}
				<strong>{election.controlName}</strong> held <strong>{election.controlSeats}</strong> of
				{election.totalSeats} House seats after the {election.year} election cycle.
				{election.seatsDecided} {election.mapUnit} are mapped below.
			{:else}
				The {election.year} House election cycle is included as a historical summary page.
				Interactive map data has not yet been added for this year.
			{/if}
		</p>

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
					Party seat totals are not available in this local map dataset yet.
				</p>
			{/if}
			<p class="mt-3 text-xs text-neutral-500">
				{election.seatsDecided} {election.mapUnit} mapped &middot; {election.totalSeats} total House seats
				after the election cycle &middot; {election.majority} needed for a majority.
			</p>
		</section>

		{#if election.hasMap && mapEmbed && election.mapRoute}
			<section class="mt-5">
				<div class="rounded-md overflow-hidden border border-neutral-300 bg-white shadow-sm">
					{#key election.year}
						<iframe
							src={mapEmbed}
							title={`${election.year} House Election Interactive Map`}
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
				<h2 class="text-sm font-bold uppercase tracking-wide">{election.year} House Background</h2>
			</div>
			<div class="p-4 md:p-5">
				<p class="text-sm leading-relaxed text-neutral-700">{election.details.overview}</p>
				<div class="mt-4 rounded border border-neutral-200 p-3">
					<h3 class="text-xs font-bold uppercase tracking-wide text-[#001666]">Key Notes</h3>
					<ul class="mt-3 space-y-2 text-sm leading-relaxed text-neutral-700">
						{#each election.details.keyPoints as point}
							<li class="flex gap-2">
								<span class="mt-2 h-1.5 w-1.5 rounded-full bg-[#b60b03] shrink-0"></span>
								<span>{point}</span>
							</li>
						{/each}
					</ul>
				</div>
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
				</div>
			</div>
		</section>

		<footer class="mt-8 border-t border-neutral-200 pt-4 text-sm">
			<nav class="flex items-center justify-between gap-3">
				<div class="min-w-0">
					{#if data.prevYear}
						<a href={`/historical-house-elections/${data.prevYear}`} class="text-[#244999] hover:underline" rel="prev">
							&larr; {data.prevYear} Election
						</a>
					{/if}
				</div>
				<a href="/historical-house-elections" class="text-neutral-500 hover:underline">
					All House Elections
				</a>
				<div class="min-w-0 text-right">
					{#if data.nextYear}
						<a href={`/historical-house-elections/${data.nextYear}`} class="text-[#244999] hover:underline" rel="next">
							{data.nextYear} Election &rarr;
						</a>
					{/if}
				</div>
			</nav>
			<div class="mt-4 flex flex-col gap-2 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
				<p>
					The map shows district winners from MIT returns; the balance section uses official House
					party divisions after the election.
				</p>
				<div class="flex flex-wrap gap-x-3 gap-y-1">
					{#each election.details.sources as source}
						<a href={source.href} target="_blank" rel="noreferrer" class="text-[#244999] hover:underline">
							{source.label}
						</a>
					{/each}
				</div>
			</div>
		</footer>
	</article>
	<SiteFooter />
</div>
