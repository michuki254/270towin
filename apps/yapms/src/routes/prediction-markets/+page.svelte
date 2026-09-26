<script lang="ts">
	/* A page called "Prediction Markets" on which no number came from a market.
	 *
	 * All four rows were hardcoded, and two of them were close to backwards.
	 * 2026 House control was published as 51 D / 49 R when Polymarket has the
	 * Democrats as heavy favourites, and the 2028 presidency as 46 D / 54 R when
	 * the market favours the Democrats. "2026 Governor Net Control" was not a
	 * market at all — nobody trades a national governor-majority contract — so
	 * that row is replaced by a count derived from the individual state races,
	 * which do exist.
	 *
	 * Everything here now comes from Gamma via +page.server.ts and carries the
	 * time it was read.
	 */
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const DEM = '#244999';
	const GOP = '#d22532';

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

	const pctFor = (panel: PageData['senate'], party: string) =>
		panel.odds.find((o) => o.party === party)?.pct ?? null;

	type Row = {
		race: string;
		href: string;
		dem: number | null;
		gop: number | null;
		ok: boolean;
		fetchedAt: string;
	};

	const rows = $derived<Row[]>(
		[
			{
				race: 'Which party wins the 2028 presidency',
				href: '/2028-presidential-election-interactive-map',
				panel: data.presidential
			},
			{
				race: 'Which party wins the Senate in 2026',
				href: '/2026-senate-interactive-map',
				panel: data.senate
			},
			{
				race: 'Which party wins the House in 2026',
				href: '/2026-house-interactive-map',
				panel: data.house
			}
		].map(({ race, href, panel }) => ({
			race,
			href,
			dem: pctFor(panel, 'Democratic'),
			gop: pctFor(panel, 'Republican'),
			ok: panel.ok,
			fetchedAt: panel.fetchedAt
		}))
	);

	const gov = $derived(data.governors);
	const govDem = $derived(gov.races.filter((r) => r.democratic.pct > r.republican.pct).length);
	const anyOk = $derived(rows.some((r) => r.ok) || gov.ok);
	const readStamp = $derived(rows.find((r) => r.ok)?.fetchedAt ?? gov.fetchedAt);
</script>

<svelte:head>
	<title>Prediction Markets | Live Election Odds | Path to Win</title>
	<meta
		name="description"
		content="Live Polymarket prices on control of the Senate, the House and the 2028 presidency, plus every 2026 governor race the market prices."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Prediction Markets</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">Prediction Markets</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				What traders are actually paying for each outcome on Polymarket. A contract settles at $1 if
				it happens, so its price reads directly as an implied probability. These are prices, not a
				forecast &mdash; they move all day, they can be wrong, and they are worth reading alongside
				polls and race ratings rather than instead of them.
			</p>
			{#if anyOk}
				<p class="mt-2 text-xs text-neutral-500">Read {readAt(readStamp)}.</p>
			{/if}
		</header>

		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">Control of each chamber</h2>
			<div class="mt-4 overflow-x-auto">
				<table class="w-full min-w-[680px] text-left text-sm">
					<thead
						class="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500"
					>
						<tr>
							<th class="py-3" scope="col">Market</th>
							<th class="py-3 text-right" style={`color:${DEM}`} scope="col">Democratic</th>
							<th class="py-3 text-right" style={`color:${GOP}`} scope="col">Republican</th>
							<th class="py-3 pl-6" scope="col">Split</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-100">
						{#each rows as row (row.race)}
							<tr>
								<td class="py-4 pr-4 font-black text-[#061a55]">
									<a class="hover:underline" href={row.href}>{row.race}</a>
								</td>
								{#if row.ok && row.dem !== null && row.gop !== null}
									<td
										class="py-4 text-right font-bold"
										style={`color:${row.dem >= row.gop ? DEM : '#8a8f98'}`}>{row.dem}%</td
									>
									<td
										class="py-4 text-right font-bold"
										style={`color:${row.gop > row.dem ? GOP : '#8a8f98'}`}>{row.gop}%</td
									>
									<td class="py-4 pl-6">
										<div class="flex h-5 overflow-hidden rounded-full bg-neutral-100">
											<div style={`width:${row.dem}%;background:${DEM}`}></div>
											<div class="ml-auto" style={`width:${row.gop}%;background:${GOP}`}></div>
										</div>
									</td>
								{:else}
									<td class="py-4 text-right text-neutral-400" colspan="3">
										Market unavailable right now
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="mt-4 text-xs leading-relaxed text-neutral-500">
				Each party trades as its own contract rather than as a share of one pool, so a row&rsquo;s two
				prices are quoted independently and need not total 100%.
			</p>
		</section>

		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
				2026 governor races
			</h2>
			{#if gov.ok}
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					There is no market on who holds a majority of governorships, so this is counted from the
					individual state races: of the <strong>{gov.races.length}</strong> that Polymarket prices,
					the Democrats lead in <strong>{govDem}</strong> and the Republicans in
					<strong>{gov.races.length - govDem}</strong>.
				</p>
				<div class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{#each gov.races.slice(0, 6) as r (r.state)}
						<a
							href="/2026-governor-interactive-map"
							class="rounded border border-neutral-200 px-3 py-2 hover:bg-[#f7f8fb]"
						>
							<div class="flex items-baseline justify-between gap-2">
								<span class="font-black text-[#061a55]">{r.state}</span>
								<span class="text-xs font-bold text-neutral-600">
									{r.democratic.pct}% D &middot; {r.republican.pct}% R
								</span>
							</div>
							<div class="mt-2 flex h-2 overflow-hidden rounded-full bg-neutral-100">
								<div style={`width:${r.democratic.pct}%;background:${DEM}`}></div>
								<div class="ml-auto" style={`width:${r.republican.pct}%;background:${GOP}`}></div>
							</div>
						</a>
					{/each}
				</div>
				<p class="mt-3 text-xs text-neutral-500">
					The six closest shown.
					<a class="underline hover:text-neutral-700" href="/2026-governor-interactive-map"
						>See all {gov.races.length} priced races</a
					>.
					{#if gov.skipped.length}
						No party-readable market for {gov.skipped.join(', ')}.
					{/if}
				</p>
			{:else}
				<p class="mt-2 text-sm text-neutral-500">
					Polymarket could not be reached, so no prices are shown rather than stale ones.
				</p>
			{/if}
		</section>
	</main>
	<SiteFooter />
</div>
