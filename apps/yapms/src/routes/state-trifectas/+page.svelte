<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const rows = [
		{ category: 'Republican trifecta', count: 23, color: '#d22532' },
		{ category: 'Democratic trifecta', count: 15, color: '#244999' },
		{ category: 'Divided government', count: 12, color: '#c8be9a' }
	];
</script>

<svelte:head>
	<title>State Government Trifectas | Path to Win</title>
	<meta name="description" content="State government trifecta dashboard for governor and legislative control." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>State Trifectas</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">State Government Trifectas</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">A state has a trifecta when one party controls the governorship and both legislative chambers.</p>
		</header>
		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="grid gap-4 md:grid-cols-3">
				{#each rows as row}
					<div class="rounded-md bg-[#f7f8fb] p-5">
						<div class="text-4xl font-black" style={`color:${row.color}`}>{row.count}</div>
						<div class="mt-2 text-sm font-black uppercase tracking-wide text-neutral-600">{row.category}</div>
					</div>
				{/each}
			</div>
		</section>
	</main>
	<SiteFooter />
</div>
