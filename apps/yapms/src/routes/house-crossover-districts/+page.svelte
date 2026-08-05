<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const rows = [
		{ type: 'Republican member in Democratic presidential district', count: 17, color: '#d22532' },
		{ type: 'Democratic member in Republican presidential district', count: 13, color: '#244999' }
	];
</script>

<svelte:head>
	<title>House Crossover Districts | Path to Win</title>
	<meta name="description" content="House crossover district dashboard for split-ticket congressional seats." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>Crossover Districts</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">House Crossover Districts</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Crossover districts are seats represented by one party while voting for the other party for president.
			</p>
		</header>
		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="grid gap-4 md:grid-cols-2">
				{#each rows as row}
					<div class="rounded bg-[#f7f8fb] p-5">
						<div class="text-4xl font-black" style={`color:${row.color}`}>{row.count}</div>
						<p class="mt-2 text-sm font-bold text-neutral-700">{row.type}</p>
					</div>
				{/each}
			</div>
		</section>
	</main>
	<SiteFooter />
</div>
