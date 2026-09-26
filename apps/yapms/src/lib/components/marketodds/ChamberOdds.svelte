<script lang="ts">
	/* Chamber-control odds from Polymarket.
	 *
	 * Shared because the Senate and House pages had each grown their own
	 * "Market Signal" panel with hand-written percentages and a "Live-style
	 * model" badge. One component means one place where the numbers come from
	 * and one place that renders an honest empty state.
	 */
	import type { MarketPanel } from '$lib/server/polymarket';

	let {
		panel,
		title = 'Market odds',
		question
	}: { panel: MarketPanel; title?: string; question: string } = $props();

	/** "2026-08-06T11:20:31Z" -> "6 Aug 2026, 11:20 UTC" */
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

<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
	<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">{title}</h2>
	{#if panel.ok}
		<p class="text-xs text-neutral-500">
			&ldquo;{question}&rdquo; &middot; Polymarket, read {readAt(panel.fetchedAt)}.
		</p>
		<div class="mt-4 space-y-3">
			{#each panel.odds as o (o.party)}
				<div>
					<div class="mb-1 flex justify-between text-xs font-bold">
						<span style={`color:${o.color}`}>{o.party}</span><span>{o.pct}%</span>
					</div>
					<div class="h-2 rounded-full bg-neutral-100">
						<div class="h-2 rounded-full" style={`width:${o.pct}%;background:${o.color}`}></div>
					</div>
				</div>
			{/each}
		</div>
		<p class="mt-3 text-xs leading-relaxed text-neutral-500">
			Each party trades as its own contract rather than as a share of one pool, so the two prices
			are quoted independently and need not total 100%.
		</p>
	{:else}
		<!-- No stale copy and no placeholder: if Gamma is unreachable the page says so. -->
		<p class="mt-3 text-sm text-neutral-500">
			Polymarket could not be reached, so no prices are shown rather than out-of-date ones.
		</p>
	{/if}
</section>
