<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
</script>

<svelte:head>
	<title>Uncontested House Races | Path to Win</title>
	<meta name="description" content="Uncontested U.S. House races and ballot competition reference page." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>Uncontested Races</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">Uncontested House Races</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Track House districts where one major party does not field a general-election nominee.
			</p>
		</header>
		<section class="grid gap-4 md:grid-cols-3">
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm"><div class="text-4xl font-black text-[#244999]">12</div><p class="font-bold">No Republican nominee</p></div>
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm"><div class="text-4xl font-black text-[#d22532]">9</div><p class="font-bold">No Democratic nominee</p></div>
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm"><div class="text-4xl font-black text-[#001666]">21</div><p class="font-bold">Total uncontested</p></div>
		</section>
	</main>
	<SiteFooter />
</div>
