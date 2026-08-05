<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const cycles = ['2026', '2024', '2022', '2020'];
</script>

<svelte:head>
	<title>State Primary Results | Path to Win</title>
	<meta name="description" content="State primary election results archive for federal and statewide races." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>State Primary Results</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">State Primary Results</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">Browse primary result archives by cycle. These pages are ready for state-by-state primary result feeds.</p>
		</header>
		<section class="grid gap-4 md:grid-cols-4">
			{#each cycles as cycle}
				<div class="rounded-md border border-neutral-200 bg-white p-5 text-center shadow-sm">
					<div class="text-3xl font-black text-[#001666]">{cycle}</div>
					<div class="mt-2 text-sm font-bold text-neutral-600">Primary Results</div>
				</div>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
