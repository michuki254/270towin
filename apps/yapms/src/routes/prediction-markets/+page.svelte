<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const markets = [
		{ race: '2028 Presidential Winner', democratic: 46, republican: 54 },
		{ race: '2026 Senate Control', democratic: 42, republican: 58 },
		{ race: '2026 House Control', democratic: 51, republican: 49 },
		{ race: '2026 Governor Net Control', democratic: 48, republican: 52 }
	];
</script>

<svelte:head>
	<title>Prediction Markets | Path to Win</title>
	<meta
		name="description"
		content="Prediction market-style election probabilities for major U.S. political races."
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
				Market-style probabilities provide one view of election expectations. These indicators
				are informational and should be compared with polls, ratings, and fundamentals.
			</p>
		</header>

		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="overflow-x-auto">
				<table class="w-full min-w-[680px] text-left text-sm">
					<thead class="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
						<tr>
							<th class="py-3">Market</th>
							<th class="py-3 text-[#244999]">Democratic</th>
							<th class="py-3 text-[#d22532]">Republican</th>
							<th class="py-3">Probability Bar</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-100">
						{#each markets as market}
							<tr>
								<td class="py-4 font-black text-[#061a55]">{market.race}</td>
								<td class="py-4 font-bold">{market.democratic}%</td>
								<td class="py-4 font-bold">{market.republican}%</td>
								<td class="py-4">
									<div class="flex h-5 overflow-hidden rounded-full bg-neutral-100">
										<div class="bg-[#244999]" style={`width:${market.democratic}%`}></div>
										<div class="bg-[#d22532]" style={`width:${market.republican}%`}></div>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	</main>
	<SiteFooter />
</div>
