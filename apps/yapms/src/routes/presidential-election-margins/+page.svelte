<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Presidential Election Margins | Path to Win</title>
	<meta name="description" content="Presidential election margin archive with electoral and popular vote context." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>Margins</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">Presidential Election Margins</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Compare every mapped presidential election by Electoral College margin. Rows are generated
				from the historical interactive map files.
			</p>
		</header>
		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="overflow-x-auto">
			<table class="w-full min-w-[720px] text-left text-sm">
				<thead class="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
					<tr>
						<th class="py-3">Year</th>
						<th>Winner</th>
						<th>Winner EV</th>
						<th>Runner-up</th>
						<th>Margin</th>
						<th>Needed</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-neutral-100">
					{#each data.rows as row}
						<tr>
							<td class="py-4">
								<a class="font-black text-[#244999] hover:underline" href={row.href}>{row.year}</a>
							</td>
							<td>
								<span class="mr-2 inline-block h-3 w-3 rounded-full" style={`background:${row.winnerColor}`}></span>
								{row.winner}
							</td>
							<td class="font-bold">{row.winnerEV}</td>
							<td>{row.runnerUp} ({row.runnerUpEV})</td>
							<td class="font-black text-[#061a55]">+{row.margin}</td>
							<td>{row.needed} of {row.totalEV}</td>
						</tr>
					{/each}
				</tbody>
			</table>
			</div>
		</section>
	</main>
	<SiteFooter />
</div>
