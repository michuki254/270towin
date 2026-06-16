<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: election = data.election;
	$: runnerUp = election.candidates[1];
	$: margin = runnerUp ? election.winner!.ev - runnerUp.ev : election.winner?.ev ?? 0;
	$: mapEmbed = `${election.mapRoute}?embed=1`;
</script>

<svelte:head>
	<title>{election.year} Presidential Election Results | Interactive Electoral Map</title>
	<meta
		name="description"
		content={`Results of the ${election.year} U.S. presidential election: ${election.winner?.name} won with ${election.winner?.ev} electoral votes. Explore the interactive electoral college map.`}
	/>
	<link rel="canonical" href={`/historical-presidential-elections/${election.year}`} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={`${election.year} Presidential Election Results`} />
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<article class="max-w-6xl mx-auto w-full px-4 py-6">
		<header>
			<nav class="text-xs text-neutral-500 mb-2" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<a href="/historical-presidential-elections" class="hover:underline">Historical Elections</a>
				<span class="mx-1">/</span>
				<span>{election.year}</span>
			</nav>

			<!-- Year navigation -->
			<div class="flex items-center justify-between gap-3">
				<div class="w-28">
					{#if data.prevYear}
						<a
							href={`/historical-presidential-elections/${data.prevYear}`}
							class="inline-flex items-center gap-1 text-sm text-[#244999] hover:underline"
							rel="prev"
						>
							<span aria-hidden="true">&larr;</span>
							{data.prevYear}
						</a>
					{/if}
				</div>
				<h1 class="text-2xl md:text-3xl font-bold text-[#001666] text-center flex-1">
					{election.year} Presidential Election
				</h1>
				<div class="w-28 text-right">
					{#if data.nextYear}
						<a
							href={`/historical-presidential-elections/${data.nextYear}`}
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

		<!-- Winner summary -->
		{#if election.winner}
			<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
				<strong>{election.winner.name}</strong> won the {election.year} presidential election with
				<strong>{election.winner.ev}</strong> of {election.totalEV} electoral votes{#if runnerUp}, defeating
				<strong>{runnerUp.name}</strong> ({runnerUp.ev}) by a margin of {margin} electoral votes{/if}. Explore
				the full interactive map below.
			</p>
		{/if}

		<!-- Results breakdown -->
		<section class="mt-5 bg-white rounded-md border border-neutral-200 p-4">
			<h2 class="text-sm font-bold text-[#001666] uppercase tracking-wide mb-3">
				Electoral Vote Results
			</h2>
			<div class="flex flex-col gap-3">
				{#each election.candidates as c}
					<div class="flex items-center gap-3">
						{#if c.portrait}
							<img
								src={c.portrait}
								alt={c.name}
								loading="lazy"
								class="w-12 h-12 rounded-full object-cover object-top border-2 shrink-0"
								style={`border-color:${c.color}`}
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
								<span class="shrink-0 ml-2">{c.ev} EV</span>
							</div>
							<div class="mt-1 h-2.5 rounded bg-neutral-200 overflow-hidden">
								<div
									class="h-full"
									style={`width:${(c.ev / election.totalEV) * 100}%;background:${c.color}`}
								></div>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<p class="mt-3 text-xs text-neutral-500">
				{election.totalEV} total electoral votes{#if election.totalEV >= 270}&nbsp;&middot; {Math.floor(
						election.totalEV / 2
					) + 1} needed to win{/if}.
			</p>
		</section>

		<!-- Interactive map -->
		<section class="mt-5">
			<div class="rounded-md overflow-hidden border border-neutral-300 bg-white shadow-sm">
				{#key election.year}
					<iframe
						src={mapEmbed}
						title={`${election.year} Presidential Election Interactive Map`}
						class="w-full block"
						style="height: 600px; border: 0;"
					></iframe>
				{/key}
			</div>
			<div class="mt-3">
				<a
					href={election.mapRoute}
					class="inline-block px-4 py-2 rounded bg-[#b60b03] text-white text-sm font-semibold hover:bg-[#8a0802]"
				>
					Open Full Interactive Map
				</a>
			</div>
		</section>

		<!-- Bottom navigation -->
		<nav class="mt-8 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm">
			<div>
				{#if data.prevYear}
					<a
						href={`/historical-presidential-elections/${data.prevYear}`}
						class="text-[#244999] hover:underline"
						rel="prev"
					>
						&larr; {data.prevYear} Election
					</a>
				{/if}
			</div>
			<a href="/historical-presidential-elections" class="text-neutral-500 hover:underline">
				All Elections
			</a>
			<div class="text-right">
				{#if data.nextYear}
					<a
						href={`/historical-presidential-elections/${data.nextYear}`}
						class="text-[#244999] hover:underline"
						rel="next"
					>
						{data.nextYear} Election &rarr;
					</a>
				{/if}
			</div>
		</nav>
	</article>
</div>
