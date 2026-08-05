<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
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
					href={`${election.mapRoute}?interactive=1`}
					class="inline-block px-4 py-2 rounded bg-[#b60b03] text-white text-sm font-semibold hover:bg-[#8a0802]"
				>
					Open Full Interactive Map
				</a>
			</div>
		</section>

		<!-- Election details -->
		<section class="mt-6 bg-white rounded-md border border-neutral-200 overflow-hidden">
			<div class="bg-[#001666] text-white px-4 py-2">
				<h2 class="text-sm font-bold uppercase tracking-wide">Election Details</h2>
			</div>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 text-sm">
				<div class="bg-white p-4">
					<div class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Winner</div>
					<div class="mt-1 font-bold text-neutral-900">{election.winner?.name ?? 'Unknown'}</div>
				</div>
				<div class="bg-white p-4">
					<div class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Runner-Up</div>
					<div class="mt-1 font-bold text-neutral-900">{runnerUp?.name ?? 'Unknown'}</div>
				</div>
				<div class="bg-white p-4">
					<div class="text-xs font-semibold uppercase tracking-wide text-neutral-500">EV Margin</div>
					<div class="mt-1 font-bold text-neutral-900">{margin}</div>
				</div>
				<div class="bg-white p-4">
					<div class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Needed To Win</div>
					<div class="mt-1 font-bold text-neutral-900">
						{Math.floor(election.totalEV / 2) + 1}
					</div>
				</div>
			</div>
			<div class="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
				<p class="text-neutral-600">
					The {election.year} map includes {election.totalEV} electoral votes across
					{election.candidates.length} candidate{election.candidates.length === 1 ? '' : 's'} with
					electoral votes.
				</p>
				<div class="flex flex-wrap gap-2">
					<a
						href={`${election.mapRoute}?interactive=1`}
						class="px-3 py-1.5 rounded bg-[#b60b03] text-white font-semibold hover:bg-[#8a0802]"
					>
						Open Map
					</a>
					<a
						href="/historical-presidential-elections"
						class="px-3 py-1.5 rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
					>
						All Elections
					</a>
				</div>
			</div>
		</section>

		{#if election.details}
			<section class="mt-5 bg-white rounded-md border border-neutral-200 overflow-hidden">
				<div class="bg-[#244999] text-white px-4 py-2">
					<h2 class="text-sm font-bold uppercase tracking-wide">
						{election.year} Election Background
					</h2>
				</div>
				<div class="p-4 md:p-5">
					<p class="text-sm leading-relaxed text-neutral-700">{election.details.overview}</p>

					{#if election.details.date || election.details.runningMates}
						<div class="mt-4 grid gap-px bg-neutral-200 text-sm md:grid-cols-3">
							{#if election.details.date}
								<div class="bg-white p-3">
									<div class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
										Election Day
									</div>
									<div class="mt-1 font-bold text-neutral-900">{election.details.date}</div>
								</div>
							{/if}
							{#if election.details.runningMates}
								<div class="bg-white p-3">
									<div class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
										Winner's Ticket
									</div>
									<div class="mt-1 font-bold text-neutral-900">
										{election.winner?.name} / {election.details.runningMates.winner}
									</div>
								</div>
								<div class="bg-white p-3">
									<div class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
										Runner-up Ticket
									</div>
									<div class="mt-1 font-bold text-neutral-900">
										{runnerUp?.name} / {election.details.runningMates.runnerUp}
									</div>
								</div>
							{/if}
						</div>
					{/if}

					<div
						class={`mt-4 grid gap-4 ${election.details.popularVote ? 'md:grid-cols-[1fr_1.4fr]' : ''}`}
					>
						{#if election.details.popularVote}
							<div class="rounded border border-neutral-200 p-3">
								<h3 class="text-xs font-bold uppercase tracking-wide text-[#001666]">
									Popular Vote
								</h3>
								<dl class="mt-3 space-y-2 text-sm">
									<div>
										<dt class="text-neutral-500">Winner</dt>
										<dd class="font-semibold text-neutral-900">
											{election.details.popularVote.winner}
										</dd>
									</div>
									<div>
										<dt class="text-neutral-500">Runner-up</dt>
										<dd class="font-semibold text-neutral-900">
											{election.details.popularVote.runnerUp}
										</dd>
									</div>
									<div>
										<dt class="text-neutral-500">Total</dt>
										<dd class="font-semibold text-neutral-900">
											{election.details.popularVote.total}
										</dd>
									</div>
								</dl>
							</div>
						{/if}
						<div class="rounded border border-neutral-200 p-3">
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
		{/if}

		<footer class="mt-8 border-t border-neutral-200 pt-4 text-sm">
			<nav class="flex items-center justify-between gap-3">
				<div class="min-w-0">
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
				<div class="min-w-0 text-right">
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
			<div class="mt-4 flex flex-col gap-2 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
				<p>
					Electoral vote totals are derived from the interactive {election.year} election map.
				</p>
				<div class="flex flex-wrap gap-x-3 gap-y-1">
					{#if election.details}
						{#each election.details.sources as source}
							<a href={source.href} target="_blank" rel="noreferrer" class="text-[#244999] hover:underline">
								{source.label}
							</a>
						{/each}
					{/if}
				</div>
			</div>
		</footer>
	</article>
	<SiteFooter />
</div>
