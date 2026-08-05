<script lang="ts">
	/* This page carried the same invented figures as its interactive-map sibling.
	 *
	 * The 226/81/231 "baseline" was not a projection of anything — it appeared
	 * twice, once as a headline strip and again as "Path Math" with bar widths
	 * (83.7%, 85.6%) hardcoded to match. Only one of those numbers was real:
	 * 226 is Harris's actual 2024 total. The Republican 231 and the 81 toss-ups
	 * were made up, so the page quietly asserted a near-tie in a cycle that
	 * starts from a 312-226 Republican win.
	 *
	 * "Candidate Watch" listed four names with editorial labels — "National
	 * profile", "Large-state executive", "Governor lane" — that say nothing and
	 * cannot be checked. Its selection was also off: it carried Harris and
	 * DeSantis, priced at 4.5% and 1.6%, while omitting Rubio, Ossoff and
	 * Ocasio-Cortez, all of whom the market ranks higher.
	 *
	 * The battleground notes were the vaguest copy here ("Coalition shifts make
	 * it central to western Sun Belt paths"). The electoral vote counts were
	 * right, so they stay; the prose is replaced by each state's certified 2024
	 * margin, which is concrete and checkable. North Carolina was missing
	 * entirely, which left the set at six of the seven battlegrounds.
	 *
	 * The map itself is untouched.
	 */
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let startMode = $state<'2024map' | 'blank'>('2024map');
	const mapEmbedUrl = $derived(`/app/usa/presidential/2028/${startMode}?embed=1`);
	const mapFullUrl = $derived(`/app/usa/presidential/2028/${startMode}`);

	/* The certified 2024 result — the real starting point, and what the map
	   loads in "2024 Result" mode. */
	const TRUMP_2024 = 312;
	const HARRIS_2024 = 226;
	const TO_WIN = 270;
	/** What the losing side has to flip. 270 - 226 = 44. */
	const FLIP_NEEDED = TO_WIN - HARRIS_2024;

	const resultBlocks = [
		{ label: 'Trump (R)', value: TRUMP_2024, color: '#b60b03' },
		{ label: 'Harris (D)', value: HARRIS_2024, color: '#244999' }
	];

	/* All seven battlegrounds, with percentages from the certified 2024 returns.
	   Trump carried every one of them, Nevada for the first time since 2004. */
	const battlegrounds = [
		{
			state: 'Pennsylvania',
			ev: 19,
			margin: 1.71,
			note: 'The biggest prize of the seven, and the one the blue-wall route to 270 cannot do without.'
		},
		{
			state: 'Michigan',
			ev: 15,
			margin: 1.42,
			note: 'Second-narrowest state in the country in 2024.'
		},
		{
			state: 'Wisconsin',
			ev: 10,
			margin: 0.86,
			note: 'The closest state anywhere in 2024 — under a single point.'
		},
		{
			state: 'Georgia',
			ev: 16,
			margin: 2.19,
			note: 'Flipped back to the Republicans after going Democratic in 2020.'
		},
		{
			state: 'Arizona',
			ev: 11,
			margin: 5.53,
			note: 'The widest of the seven, so the hardest of the set to win back.'
		},
		{
			state: 'Nevada',
			ev: 6,
			margin: 3.1,
			note: 'Republican for the first time since 2004.'
		},
		{
			state: 'North Carolina',
			ev: 16,
			margin: 3.21,
			note: 'The only one of the seven no Democrat has carried since 2008.'
		}
	];

	const blueWall = ['Pennsylvania', 'Michigan', 'Wisconsin'];
	const blueWallEV = battlegrounds
		.filter((b) => blueWall.includes(b.state))
		.reduce((n, b) => n + b.ev, 0);

	const tools = [
		{ label: 'Full field & market odds', href: '/2028-presidential-election-interactive-map' },
		{ label: 'Forecasts', href: '/forecasts' },
		{ label: 'Polls', href: '/polls' },
		{ label: 'Prediction Markets', href: '/prediction-markets' },
		{ label: 'Tie Scenarios', href: '/electoral-college-tie' },
		{ label: 'Split Electoral Votes', href: '/maine-nebraska-split-electoral-votes' }
	];

	const partyColor = (party: 'Democratic' | 'Republican' | null) =>
		party === 'Democratic' ? '#244999' : party === 'Republican' ? '#b60b03' : '#655c3f';

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
</script>

<svelte:head>
	<title>2028 Presidential Election | Battlegrounds &amp; Interactive Map | Path to Win</title>
	<meta
		name="description"
		content="The 2028 presidential race from the 2024 result: an interactive electoral college map, all seven battleground states with their certified 2024 margins, and live market odds on the field."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="flex-1">
		<section class="border-b border-neutral-200 bg-white">
			<div class="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[0.9fr_1.4fr]">
				<div class="flex flex-col justify-between gap-5">
					<div>
						<nav class="mb-3 text-xs text-neutral-500" aria-label="Breadcrumb">
							<a href="/" class="hover:underline">Home</a>
							<span class="mx-1">/</span>
							<span>2028 President</span>
						</nav>
						<p class="text-xs font-black uppercase tracking-[0.18em] text-[#b60b03]">
							Interactive Electoral College
						</p>
						<h1 class="mt-2 text-4xl font-black tracking-tight text-[#061a55] md:text-5xl">
							2028 Presidential Election
						</h1>
						<p class="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600">
							The Republicans start this cycle defending {TRUMP_2024} electoral votes. Click states in
							the map to move them and see who gets to {TO_WIN} first, either from the 2024 result or
							from an empty board.
						</p>
					</div>

					<div>
						<div
							class="grid grid-cols-2 overflow-hidden rounded-md border border-neutral-200 text-center text-white"
						>
							{#each resultBlocks as block}
								<div class="px-3 py-4" style={`background:${block.color}`}>
									<div class="text-3xl font-black leading-none">{block.value}</div>
									<div class="mt-1 text-[11px] font-black uppercase tracking-wide opacity-90">
										{block.label}
									</div>
								</div>
							{/each}
						</div>
						<p class="mt-2 text-xs text-neutral-500">
							The certified 2024 result, not a 2028 projection.
						</p>
					</div>

					<div class="grid gap-3 sm:grid-cols-2">
						<a
							href={mapFullUrl}
							class="rounded-md bg-[#b60b03] px-4 py-3 text-center text-sm font-black text-white shadow-sm hover:bg-[#8f0802]"
						>
							Open Full Map
						</a>
						<a
							href="/2028-presidential-election-interactive-map"
							class="rounded-md border border-[#244999] bg-white px-4 py-3 text-center text-sm font-black text-[#244999] hover:bg-[#f3f6fd]"
						>
							Full Field &amp; Odds
						</a>
					</div>
				</div>

				<div class="min-w-0">
					<div class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
								Build Your 2028 Map
							</h2>
							<p class="text-xs text-neutral-500">
								Switch the starting point and click states inside the map.
							</p>
						</div>
						<div class="inline-flex w-fit overflow-hidden rounded-md border border-neutral-300 text-sm">
							<button
								type="button"
								class={`px-3 py-1.5 font-bold ${
									startMode === '2024map'
										? 'bg-[#244999] text-white'
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
										? 'bg-[#244999] text-white'
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
								style="height: min(68vh, 650px); min-height: 430px; border: 0;"
							></iframe>
						{/key}
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 xl:grid-cols-[1.35fr_0.75fr]">
			<div class="space-y-5">
				<section>
					<div class="mb-3 flex items-end justify-between gap-3">
						<div>
							<h2 class="text-xl font-black text-[#061a55]">The Seven Battlegrounds</h2>
							<p class="text-sm text-neutral-600">
								Trump carried all seven in 2024. Each card shows that margin.
							</p>
						</div>
						<div
							class="hidden text-xs font-bold uppercase tracking-wide text-neutral-500 sm:block"
						>
							{TO_WIN} needed to win
						</div>
					</div>
					<div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
						{#each battlegrounds as state}
							<article class="flex flex-col rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
								<div class="flex items-start justify-between gap-3">
									<h3 class="font-black text-[#061a55]">{state.state}</h3>
									<div
										class="shrink-0 rounded bg-[#f0ead8] px-2 py-1 text-xs font-black text-[#655c3f]"
									>
										{state.ev} EV
									</div>
								</div>
								<div class="mt-2 text-sm font-bold" style="color:#b60b03">
									2024: Trump +{state.margin.toFixed(2)}
								</div>
								<p class="mt-2 text-sm leading-relaxed text-neutral-600">{state.note}</p>
							</article>
						{/each}
					</div>
					<p class="mt-3 text-xs leading-relaxed text-neutral-500">
						Margins are the difference in vote share from the certified 2024 returns, as compiled on
						<a
							class="underline hover:text-neutral-700"
							href="https://en.wikipedia.org/wiki/2024_United_States_presidential_election#Results_by_state"
							rel="noopener"
							target="_blank">Wikipedia's results-by-state table</a
						>, which cites each state's own election authority.
					</p>
				</section>

				<section>
					<div class="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h2 class="text-xl font-black text-[#061a55]">Who The Market Backs</h2>
							<p class="text-sm text-neutral-600">
								{#if data.board.ok}
									Chance of taking office, priced on Polymarket. Read {readAt(data.board.fetchedAt)}.
								{:else}
									Live prices are unavailable right now.
								{/if}
							</p>
						</div>
						{#if data.board.ok}
							<a
								class="text-sm font-bold text-[#244999] hover:underline"
								href="/2028-presidential-election-interactive-map">See the full field →</a
							>
						{/if}
					</div>

					{#if data.board.ok}
						<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{#each data.board.candidates as c (c.name)}
								<article
									class="flex items-center gap-3 rounded-md border border-neutral-200 bg-white p-3 shadow-sm"
								>
									{#if c.photo}
										<img
											src={c.photo}
											alt=""
											class="h-14 w-14 shrink-0 rounded-full border border-neutral-200 object-cover object-top"
											loading="lazy"
										/>
									{:else}
										<div
											class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-[#e9edf5] text-sm font-black text-[#061a55]"
											aria-hidden="true"
										>
											{c.initials}
										</div>
									{/if}
									<div class="min-w-0">
										<div
											class="text-[11px] font-black uppercase tracking-wide"
											style={`color:${partyColor(c.party)}`}
										>
											{c.party ?? 'No primary market'}
										</div>
										<h3 class="truncate font-black text-[#061a55]">{c.name}</h3>
										<div class="mt-0.5 text-sm font-bold text-neutral-700">{c.pct}%</div>
									</div>
								</article>
							{/each}
						</div>
					{:else}
						<p class="rounded-md border border-neutral-200 bg-white p-4 text-sm text-neutral-500 shadow-sm">
							Polymarket could not be reached, so no prices are shown rather than stale ones. The map
							above is unaffected.
						</p>
					{/if}
				</section>
			</div>

			<aside class="space-y-5">
				<section class="rounded-md border border-neutral-200 bg-white shadow-sm">
					<div class="border-b border-neutral-200 px-4 py-3">
						<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">Election Tools</h2>
					</div>
					<div class="grid gap-px bg-neutral-200">
						{#each tools as tool}
							<a
								href={tool.href}
								class="bg-white px-4 py-3 text-sm font-bold text-[#244999] hover:bg-[#f7f8fb]"
							>
								{tool.label}
							</a>
						{/each}
					</div>
				</section>

				<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">Path Math</h2>
					<div class="mt-4 space-y-4">
						<div>
							<div class="flex justify-between text-xs font-bold text-neutral-600">
								<span>Republicans hold</span>
								<span>{TRUMP_2024} / {TO_WIN}</span>
							</div>
							<div class="mt-1 h-2 overflow-hidden rounded bg-neutral-200">
								<div class="h-full bg-[#b60b03]" style="width: 100%"></div>
							</div>
						</div>
						<div>
							<div class="flex justify-between text-xs font-bold text-neutral-600">
								<span>Democrats hold</span>
								<span>{HARRIS_2024} / {TO_WIN}</span>
							</div>
							<div class="mt-1 h-2 overflow-hidden rounded bg-neutral-200">
								<div
									class="h-full bg-[#244999]"
									style={`width: ${((HARRIS_2024 / TO_WIN) * 100).toFixed(1)}%`}
								></div>
							</div>
						</div>
						<p class="text-sm leading-relaxed text-neutral-600">
							Starting from 2024, the Democrats need to flip <strong>{FLIP_NEEDED}</strong> electoral
							votes to reach {TO_WIN}. Pennsylvania, Michigan and Wisconsin are worth exactly
							{blueWallEV} between them — win those three back and nothing else changes, and the map
							reads {TO_WIN}-{TRUMP_2024 - FLIP_NEEDED}. That is why those three carry the whole
							cycle, and all three were decided by under two points.
						</p>
					</div>
				</section>
			</aside>
		</section>
	</main>
	<SiteFooter />
</div>
