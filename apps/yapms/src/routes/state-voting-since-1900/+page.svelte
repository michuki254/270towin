<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>State Voting Since 1900 | Path to Win</title>
	<meta name="description" content="State presidential voting history since 1900." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>Since 1900</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">State Voting Since 1900</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Long-run state presidential voting patterns from the 20th century through the modern era,
				derived from bundled historical presidential maps.
			</p>
		</header>
		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="overflow-x-auto">
				<table class="w-full min-w-[720px] text-left text-sm">
					<thead class="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
						<tr>
							<th class="py-3">State</th>
							<th>Democratic color wins</th>
							<th>Republican color wins</th>
							<th>Other color wins</th>
							<th>Latest winner</th>
							<th>Visual split</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-100">
						{#each data.states as state}
							<tr>
								<td class="py-4 font-black text-[#061a55]">{state.region} · {state.state}</td>
								<td>{state.democratic}</td>
								<td>{state.republican}</td>
								<td>{state.other}</td>
								<td>{state.lastWinner}</td>
								<td>
									<div class="flex h-4 overflow-hidden rounded-full bg-neutral-200">
										<div class="bg-[#244999]" style={`width:${(state.democratic / state.total) * 100}%`}></div>
										<div class="bg-[#d22532]" style={`width:${(state.republican / state.total) * 100}%`}></div>
										<div class="bg-[#c8be9a]" style={`width:${(state.other / state.total) * 100}%`}></div>
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
