<script lang="ts">
	/* Generated, not written.
	 *
	 * This page used to be four headlines hardcoded with the date the file was
	 * created, so it announced itself as news while ageing in place for seven
	 * weeks. The obvious replacement — have a model write election articles — is
	 * the same failure with more words, and on the one page where being confidently
	 * wrong is most visible.
	 *
	 * So it reports something that can be derived instead of composed: which races
	 * the market repriced. Every line is two prices and a subtraction, and there
	 * is nothing in it a model could get wrong.
	 *
	 * It also says something no other page here does. The rest of the site shows
	 * where a race stands; this shows which way it is moving, which is the part
	 * that is actually new.
	 */
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const DEM = '#244999';
	const GOP = '#d83a45';

	const board = $derived(data.board);

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

	const windowLabel = (n: number) => (n === 1 ? '24 hours' : n === 30 ? '30 days' : '7 days');

	/** Headline sentence for one race, built from the numbers rather than written. */
	function line(m: PageData['board']['movers'][number]): string {
		const toward = m.delta > 0 ? 'the Democrats' : 'the Republicans';
		return `${m.race} moved ${Math.abs(m.delta).toFixed(1)} points toward ${toward}`;
	}

	const biggest = $derived(board.movers[0] ?? null);
</script>

<svelte:head>
	<title>Election News | Where the Markets Moved | Path to Win</title>
	<meta
		name="description"
		content="Which 2026 and 2028 races the prediction markets repriced, biggest move first. Generated from live Polymarket prices, updated continuously."
	/>
	<meta property="og:title" content="Election News — Where the Markets Moved" />
	<meta
		property="og:description"
		content="Which 2026 and 2028 races the prediction markets repriced, biggest move first."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>News</span>
			</nav>
			<p class="text-xs font-black uppercase tracking-[0.18em] text-[#d83a45]">Election News</p>
			<h1 class="mt-1 text-3xl font-black text-[#001666]">Where the markets moved</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Every race we track, ranked by how far its price shifted over the last {windowLabel(
					board.windowDays
				)}. The rest of this site shows where each race stands; this is the part that changed.
			</p>
			{#if board.ok}
				<p class="mt-2 text-xs text-neutral-500">Prices read {readAt(board.fetchedAt)}.</p>
			{/if}
		</header>

		{#if board.ok}
			<nav class="flex flex-wrap items-center gap-2 text-sm" aria-label="Time window">
				<span class="text-xs font-bold uppercase tracking-wide text-neutral-500">Window</span>
				{#each data.windows as w}
					<a
						href={`/news?window=${w}`}
						aria-current={board.windowDays === w ? 'page' : undefined}
						class={`rounded border px-3 py-1.5 text-xs font-black ${
							board.windowDays === w
								? 'border-[#061a55] bg-[#061a55] text-white'
								: 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
						}`}
					>
						{windowLabel(w)}
					</a>
				{/each}
			</nav>

			{#if biggest}
				<!-- Lead item: the single biggest repricing, stated as a sentence. -->
				<a
					href={biggest.href}
					class="block rounded-md border-l-4 bg-white p-5 shadow-sm hover:border-neutral-300"
					style={`border-left-color:${biggest.delta > 0 ? DEM : GOP}`}
				>
					<div class="text-xs font-black uppercase tracking-wide text-neutral-500">
						Biggest move &middot; last {windowLabel(board.windowDays)}
					</div>
					<h2 class="mt-2 text-2xl font-black leading-tight text-[#061a55]">
						{line(biggest)}
					</h2>
					<p class="mt-2 text-sm text-neutral-600">
						The Democratic contract went from {biggest.previous}% to {biggest.current}%.
					</p>
				</a>
			{/if}

			<section class="rounded-md border border-neutral-200 bg-white shadow-sm">
				<div class="border-b border-neutral-200 px-5 py-3">
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
						{board.movers.length} race{board.movers.length === 1 ? '' : 's'} repriced
					</h2>
					<p class="text-xs text-neutral-500">
						Moves of at least {board.minDelta} point. {board.flat} other race{board.flat === 1
							? ''
							: 's'} held steady.
					</p>
				</div>

				{#if board.movers.length}
					<ul class="divide-y divide-neutral-100">
						{#each board.movers as m (m.race)}
							<li>
								<a
									href={m.href}
									class="flex flex-col gap-2 px-5 py-4 hover:bg-[#f9fafc] sm:flex-row sm:items-center sm:gap-4"
								>
									<div
										class="w-20 shrink-0 text-lg font-black tabular-nums"
										style={`color:${m.delta > 0 ? DEM : GOP}`}
									>
										{m.delta > 0 ? '+' : '−'}{Math.abs(m.delta).toFixed(1)}
									</div>
									<div class="min-w-0 flex-1">
										<div class="font-bold text-[#061a55]">{m.race}</div>
										<div class="text-xs text-neutral-500">
											Democratic contract {m.previous}% &rarr; {m.current}%
											&middot; toward {m.delta > 0 ? 'the Democrats' : 'the Republicans'}
										</div>
									</div>
									<!-- Bar runs from the old price to the new one, so length is the size
									     of the move and colour is its direction. -->
									<div class="hidden h-2 w-32 shrink-0 overflow-hidden rounded-full bg-neutral-100 sm:block">
										<div
											class="h-2 rounded-full"
											style={`width:${Math.min(100, Math.abs(m.delta) * 6)}%;background:${
												m.delta > 0 ? DEM : GOP
											}`}
										></div>
									</div>
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="px-5 py-8 text-center text-sm text-neutral-500">
						Nothing moved by {board.minDelta} point or more in this window. Try a longer one.
					</p>
				{/if}
			</section>

			<section class="rounded-md border border-neutral-200 bg-white p-5 text-sm leading-relaxed text-neutral-600 shadow-sm">
				<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">How this is built</h2>
				<p class="mt-3">
					Each race is tracked through its <strong>Democratic contract</strong> on Polymarket. The
					number is that contract&rsquo;s price now minus its price at the start of the window, in
					percentage points, so a positive figure means the market moved toward the Democrats and a
					negative one toward the Republicans.
				</p>
				<p class="mt-3">
					One side is quoted rather than both on purpose. The two parties trade as separate
					contracts, so combining them into a single margin would produce a number neither of them
					states. The sign carries the direction instead.
				</p>
				<p class="mt-3">
					Nothing here is written or forecast. It is two prices and a subtraction, refreshed from
					Polymarket rather than stored, so it is current whenever you load it.
				</p>
			</section>
		{:else}
			<section class="rounded-md border border-neutral-200 bg-white p-8 text-center shadow-sm">
				<h2 class="text-lg font-black text-[#061a55]">Prices are unavailable right now</h2>
				<p class="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
					This page is generated from live Polymarket prices, and Polymarket could not be reached.
					Rather than show a stale copy, it shows nothing. The
					<a class="font-semibold text-[#244999] hover:underline" href="/prediction-markets"
						>prediction markets page</a
					> and the interactive maps are unaffected.
				</p>
			</section>
		{/if}
	</main>
	<SiteFooter />
</div>
