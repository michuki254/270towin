<script lang="ts">
	/* Everything below the map used to be invented.
	 *
	 * The page shipped a "Prediction Market Forecast" of 52.1% GOP, a 226/81/231
	 * electoral college "projection", and a ten-row contender table whose
	 * probabilities were written by hand — then hedged with "market-style",
	 * "Live-style model" and "modeled dashboard indicators" so none of it was
	 * quite a claim. The numbers were not merely unsourced, they were wrong
	 * about the shape of the race: the real market has the Democrats favoured,
	 * not the Republicans, has Harris fourth among Democrats rather than first,
	 * and prices Ossoff and Ocasio-Cortez in the top five while the table
	 * omitted both.
	 *
	 * There is a real source for all of it, and the site already talks to it for
	 * the Senate page, so every number here now comes from Polymarket via the
	 * server load, carries the time it was read, and disappears rather than
	 * degrading to a placeholder when the API is down.
	 *
	 * Three columns are gone rather than re-sourced. "Since" and "Term" were
	 * borrowed from a governor table and were false for most of the field —
	 * Haley's "2011" was her governorship, Ramaswamy has never held office. The
	 * "Consensus" column rated people Safe/Likely/Lean/Tilt/Toss-Up, which is
	 * the scale for how reliably a *state* votes; it means nothing applied to a
	 * person, and the filter buttons built on it meant nothing either.
	 *
	 * The map itself is untouched.
	 */
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let startMode = $state<'2024map' | 'blank'>('2024map');
	const mapEmbedUrl = $derived(`/app/usa/presidential/2028/${startMode}?embed=1`);
	const mapFullUrl = $derived(`/app/usa/presidential/2028/${startMode}`);

	// Text colour is applied inline from `color` so the badge cannot drift out of
	// step with the bar next to it.
	const partyStyles = {
		Democratic: {
			color: '#2E5AAC',
			bg: 'bg-[#eaf0fb]',
			logo: '/party-logos/democrats.png'
		},
		Republican: {
			color: '#D83A45',
			bg: 'bg-[#fdebed]',
			logo: '/party-logos/republicans.png'
		}
	} as const;

	function styleFor(party: 'Democratic' | 'Republican' | null) {
		return party ? partyStyles[party] : null;
	}

	/** "2026-08-06T11:20:31.000Z" -> "6 Aug 2026, 11:20 UTC" */
	function readAt(iso: string): string {
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return 'unknown';
		const month = [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
			'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
		][d.getUTCMonth()];
		const hh = String(d.getUTCHours()).padStart(2, '0');
		const mm = String(d.getUTCMinutes()).padStart(2, '0');
		return `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}, ${hh}:${mm} UTC`;
	}

	const partyLeader = $derived(data.party.ok ? data.party.odds[0] : null);
	const fieldLeader = $derived(data.board.ok ? data.board.candidates[0] : null);

	// Filter by party, which the data actually carries, instead of by the
	// state-rating scale the old buttons used.
	const partyFilters = ['All', 'Democratic', 'Republican'] as const;
	let selectedParty = $state<(typeof partyFilters)[number]>('All');
	const shownCandidates = $derived(
		selectedParty === 'All'
			? data.board.candidates
			: data.board.candidates.filter((c) => c.party === selectedParty)
	);

	/* The certified 2024 result — a real baseline, and literally what the map's
	   "2024 Result" mode loads. It replaces the invented 2028 projection. */
	const result2024 = [
		{ label: 'Trump (R)', value: 312, color: '#D83A45' },
		{ label: 'Harris (D)', value: 226, color: '#2E5AAC' }
	];

	const faqs = [
		{
			q: 'How many electoral votes does it take to win?',
			a: '270 of the 538 available. If nobody reaches 270 — including a 269-269 tie — the election goes to the House of Representatives, where each state delegation casts a single vote.'
		},
		{
			q: 'Is this the official 2028 field?',
			a: 'No, and it cannot be yet: no party has nominated anyone and the first primaries are still years out. The names listed are the contenders who have a tradeable market on Polymarket, ordered by price. People enter and leave that list as traders take an interest in them.'
		},
		{
			q: 'Where do the percentages come from?',
			a: "They are live prices from Polymarket's 2028 presidential markets, not a forecast produced by this site. A contract pays out if the candidate wins, so its price reads directly as the market's implied probability. Party is worked out by checking which of the two nomination markets prices a candidate higher."
		},
		{
			q: 'Why do the two party percentages not add up to 100?',
			a: 'Each party is a separate contract rather than a share of one pool, so the prices are quoted independently and the total drifts a little either side of 100. The gap is the spread traders are leaving, not a rounding mistake.'
		},
		{
			q: 'Can I share a map I have built?',
			a: 'Yes. Open the full interactive map and use the Share button for a link or embed code. Your changes stay in the link, so anyone opening it sees your map rather than the default.'
		}
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};

	const relatedMaps = [
		{ label: '2024 Presidential Election Results', href: '/2024-presidential-election-results' },
		{ label: 'Historical Presidential Elections', href: '/historical-presidential-elections' },
		{ label: '2026 Senate Interactive Map', href: '/2026-senate-interactive-map' },
		{ label: '2026 Governor Interactive Map', href: '/2026-governor-interactive-map' }
	];
</script>

<svelte:head>
	<title>2028 Presidential Election Interactive Map | Electoral College &amp; Market Odds</title>
	<meta
		name="description"
		content="Build a 2028 electoral college map from the 2024 result or a blank slate, and see live Polymarket prices for both parties and the individual contenders."
	/>
	<link rel="canonical" href="/2028-presidential-election-interactive-map" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2028 Presidential Election Interactive Map" />
	<meta
		property="og:description"
		content="Build your own path to 270, alongside live market prices for the 2028 field."
	/>
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
</svelte:head>

<div class="h-full overflow-y-auto bg-[#f3f5f8] text-neutral-900">
	<article class="mx-auto w-full max-w-7xl px-4 py-6">
		<header class="border-b border-neutral-200 pb-4">
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>2028 Presidential Election</span>
			</nav>
			<p class="text-xs font-bold uppercase tracking-[0.18em] text-[#2E5AAC]">
				U.S. Presidential Election
			</p>
			<h1 class="mt-1 text-3xl font-black tracking-tight text-[#061a55] md:text-4xl">
				2028 Presidential Election Interactive Map
			</h1>
			<p class="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
				Colour in the states yourself and watch the electoral college total move, starting either
				from the 2024 result or an empty map. Below it, what the betting markets currently make of
				the field.
			</p>
		</header>

		<section class="mt-5">
			<div class="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
				<div>
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
						Interactive Map Projection
					</h2>
					<p class="text-xs text-neutral-500">
						Start from the 2024 result or a blank map, then build your own path to 270.
					</p>
				</div>
				<div class="inline-flex overflow-hidden rounded-md border border-neutral-300 text-sm">
					<button
						type="button"
						class={`px-3 py-1.5 font-bold ${
							startMode === '2024map'
								? 'bg-[#2E5AAC] text-white'
								: 'bg-white text-neutral-700 hover:bg-neutral-100'
						}`}
						aria-pressed={startMode === '2024map'}
						onclick={() => (startMode = '2024map')}
					>
						2024 Result
					</button>
					<button
						type="button"
						class={`border-l border-neutral-300 px-3 py-1.5 font-bold ${
							startMode === 'blank'
								? 'bg-[#2E5AAC] text-white'
								: 'bg-white text-neutral-700 hover:bg-neutral-100'
						}`}
						aria-pressed={startMode === 'blank'}
						onclick={() => (startMode = 'blank')}
					>
						Blank Map
					</button>
				</div>
			</div>
			<div class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
				{#key startMode}
					<iframe
						src={mapEmbedUrl}
						title="2028 Presidential Election Interactive Electoral College Map"
						class="block w-full"
						style="height: 610px; border: 0;"
					></iframe>
				{/key}
			</div>
			<div class="mt-3 flex flex-wrap gap-2 text-sm">
				<a
					href={mapFullUrl}
					class="rounded bg-[#D83A45] px-4 py-2 font-bold text-white hover:bg-[#b92f39]"
				>
					Open Full Interactive Map
				</a>
			</div>
		</section>

		<section class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="Key numbers">
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#061a55"></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">To win</div>
				<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">270</div>
				<div class="mt-1 text-xs leading-relaxed text-neutral-500">of 538 electoral votes</div>
			</div>

			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#7a6e43"></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">Election day</div>
				<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">Nov 7, 2028</div>
				<div class="mt-1 text-xs leading-relaxed text-neutral-500">
					{data.daysToElection.toLocaleString()} days away
				</div>
			</div>

			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div
					class="mb-3 h-1.5 w-12 rounded-full"
					style={`background:${partyLeader?.color ?? '#c9ccd4'}`}
				></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
					Market favours
				</div>
				{#if partyLeader}
					<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">
						{partyLeader.party} {partyLeader.pct}%
					</div>
					<div class="mt-1 text-xs leading-relaxed text-neutral-500">
						Polymarket, read {readAt(data.party.fetchedAt)}
					</div>
				{:else}
					<div class="mt-1 text-2xl font-black tracking-tight text-neutral-400">—</div>
					<div class="mt-1 text-xs leading-relaxed text-neutral-500">
						Market data unavailable right now
					</div>
				{/if}
			</div>

			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div
					class="mb-3 h-1.5 w-12 rounded-full"
					style={`background:${styleFor(fieldLeader?.party ?? null)?.color ?? '#c9ccd4'}`}
				></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
					Shortest odds
				</div>
				{#if fieldLeader}
					<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">
						{fieldLeader.name}
					</div>
					<div class="mt-1 text-xs leading-relaxed text-neutral-500">
						{fieldLeader.pct}% to take office
					</div>
				{:else}
					<div class="mt-1 text-2xl font-black tracking-tight text-neutral-400">—</div>
					<div class="mt-1 text-xs leading-relaxed text-neutral-500">
						Market data unavailable right now
					</div>
				{/if}
			</div>
		</section>

		<div class="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
			<section class="rounded-md border border-neutral-200 bg-white shadow-sm">
				<div
					class="flex flex-col gap-3 border-b border-neutral-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
				>
					<div>
						<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
							The 2028 field, by market price
						</h2>
						<p class="text-xs text-neutral-500">
							{#if data.board.ok}
								Chance of taking office, from Polymarket. Read {readAt(data.board.fetchedAt)}.
							{:else}
								Live prices are unavailable right now.
							{/if}
						</p>
					</div>
					{#if data.board.ok}
						<div class="flex flex-wrap gap-2">
							{#each partyFilters as p}
								<button
									type="button"
									onclick={() => (selectedParty = p)}
									class={`rounded border px-3 py-1.5 text-xs font-black ${
										selectedParty === p
											? 'border-[#061a55] bg-[#061a55] text-white'
											: 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
									}`}
								>
									{p}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				{#if data.board.ok}
					<div class="overflow-x-auto">
						<table class="w-full min-w-[560px] border-collapse text-sm">
							<thead
								class="bg-[#f7f8fb] text-left text-[11px] uppercase tracking-wide text-neutral-500"
							>
								<tr class="border-b border-neutral-200">
									<th class="px-4 py-3" scope="col">Contender</th>
									<th class="px-4 py-3" scope="col">Party</th>
									<th class="px-4 py-3" scope="col">Chance of winning</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-neutral-100">
								{#each shownCandidates as c (c.name)}
									<tr class="hover:bg-[#f9fafc]">
										<td class="px-4 py-3">
											<div class="flex items-center gap-3">
												{#if c.photo}
													<img
														src={c.photo}
														alt=""
														class="h-10 w-10 shrink-0 rounded-full border border-neutral-200 object-cover object-top"
														loading="lazy"
													/>
												{:else}
													<div
														class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-[#eef1f5] text-xs font-black text-[#061a55]"
														aria-hidden="true"
													>
														{c.initials}
													</div>
												{/if}
												<span class="font-bold text-neutral-900">{c.name}</span>
											</div>
										</td>
										<td class="px-4 py-3">
											{#if c.party}
												{@const s = partyStyles[c.party]}
												<span
													class={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-black ${s.bg}`}
													style={`color:${s.color}`}
												>
													<img
														src={s.logo}
														alt=""
														class="h-5 w-5 rounded-full object-contain"
														loading="lazy"
													/>
													{c.party}
												</span>
											{:else}
												<span class="text-xs text-neutral-400">Not in either primary market</span>
											{/if}
										</td>
										<td class="px-4 py-3">
											<div class="flex items-center gap-3">
												<div class="h-2 w-28 shrink-0 rounded-full bg-neutral-100">
													<div
														class="h-2 rounded-full"
														style={`width:${c.pct}%;background:${styleFor(c.party)?.color ?? '#7a6e43'}`}
													></div>
												</div>
												<span class="w-14 text-right font-black text-[#061a55]">{c.pct}%</span>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<p class="border-t border-neutral-100 px-4 py-3 text-xs leading-relaxed text-neutral-500">
						Contenders priced under 1% are left out. Prices are quoted per candidate rather than
						carved out of a single pool, so the column does not total 100%.
					</p>
				{:else}
					<p class="px-4 py-8 text-center text-sm text-neutral-500">
						Polymarket could not be reached. The map above is unaffected.
					</p>
				{/if}
			</section>

			<div class="flex flex-col gap-5">
				<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
						Which party wins
					</h2>
					{#if data.party.ok}
						<p class="text-xs text-neutral-500">
							Polymarket, read {readAt(data.party.fetchedAt)}.
						</p>
						<div class="mt-4 space-y-3">
							{#each data.party.odds as o (o.party)}
								<div>
									<div class="mb-1 flex justify-between text-xs font-bold">
										<span style={`color:${o.color}`}>{o.party}</span><span>{o.pct}%</span>
									</div>
									<div class="h-2 rounded-full bg-neutral-100">
										<div
											class="h-2 rounded-full"
											style={`width:${o.pct}%;background:${o.color}`}
										></div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p class="mt-3 text-sm text-neutral-500">
							Polymarket could not be reached, so no prices are shown rather than stale ones.
						</p>
					{/if}
				</section>

				<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
						Where the map starts
					</h2>
					<p class="text-xs text-neutral-500">
						The certified 2024 result, which the map above loads in "2024 Result" mode.
					</p>
					<div
						class="mt-4 grid grid-cols-2 overflow-hidden rounded border border-neutral-200 text-center text-white"
					>
						{#each result2024 as block}
							<div class="py-3" style={`background:${block.color}`}>
								<div class="text-2xl font-black leading-none">{block.value}</div>
								<div class="mt-1 text-[11px] font-bold uppercase tracking-wide opacity-90">
									{block.label}
								</div>
							</div>
						{/each}
					</div>
					<p class="mt-3 text-xs leading-relaxed text-neutral-500">
						A Republican hold in 2028 means defending 312; the Democrats need to flip 44 electoral
						votes' worth of states to reach 270.
					</p>
				</section>
			</div>
		</div>

		<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
			<section class="lg:col-span-2">
				<h2 class="mb-3 text-sm font-black uppercase tracking-wide text-[#061a55]">
					Frequently Asked Questions
				</h2>
				<div class="grid gap-2">
					{#each faqs as f}
						<details class="rounded-md border border-neutral-200 bg-white p-3 shadow-sm">
							<summary class="cursor-pointer font-bold text-[#2E5AAC]">{f.q}</summary>
							<p class="mt-2 text-sm leading-relaxed text-neutral-700">{f.a}</p>
						</details>
					{/each}
				</div>
			</section>

			<aside class="flex flex-col gap-4">
				<div class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
					<div class="bg-[#061a55] px-3 py-2 text-sm font-bold text-white">Related Maps</div>
					<ul class="divide-y divide-neutral-100">
						{#each relatedMaps as m}
							<li>
								<a
									href={m.href}
									class="block px-3 py-2 text-sm font-semibold text-[#2E5AAC] hover:bg-[#f7f8fb]"
								>
									{m.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div
					class="rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-700 shadow-sm"
				>
					<h2 class="mb-1 text-base font-black text-[#061a55]">Key Facts</h2>
					<ul class="flex list-inside list-disc flex-col gap-1">
						<li><strong>538</strong> electoral votes, <strong>270</strong> to win</li>
						<li>A <strong>269-269</strong> tie goes to the House</li>
						<li>Election Day: <strong>November 7, 2028</strong></li>
						<li>Incumbent party: <strong>Republican</strong></li>
					</ul>
				</div>
			</aside>
		</div>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500">
			Percentages on this page are live prices from Polymarket, carrying the time they were read.
			They are what traders are paying, not a forecast produced by this site, and they change
			throughout the day. Electoral vote totals for 2024 are the certified result.
		</footer>
	</article>
	<SiteFooter />
</div>
