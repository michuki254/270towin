<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const rows = [
		{ state: 'Maine', statewide: 2, districts: 2, total: 4 },
		{ state: 'Nebraska', statewide: 2, districts: 3, total: 5 }
	];
</script>

<svelte:head>
	<title>Maine and Nebraska Split Electoral Votes | Path to Win</title>
	<meta
		name="description"
		content="How Maine and Nebraska split electoral votes by statewide result and congressional district."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Maine and Nebraska</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">Maine and Nebraska Split Electoral Votes</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Maine and Nebraska award two electoral votes to the statewide winner and one electoral
				vote to the winner of each congressional district.
			</p>
		</header>

		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<table class="w-full text-left text-sm">
				<thead class="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
					<tr>
						<th class="py-3">State</th>
						<th class="py-3">Statewide Votes</th>
						<th class="py-3">District Votes</th>
						<th class="py-3">Total</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-neutral-100">
					{#each rows as row}
						<tr>
							<td class="py-4 font-black text-[#061a55]">{row.state}</td>
							<td class="py-4">{row.statewide}</td>
							<td class="py-4">{row.districts}</td>
							<td class="py-4 font-black">{row.total}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	</main>
	<SiteFooter />
</div>
