<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
</script>

<svelte:head>
	<title>2020 Presidential Election Results | Path to Win</title>
	<meta name="description" content="2020 U.S. presidential election results archive." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>2020 President</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">2020 Presidential Election Results</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">Joe Biden won the 2020 presidential election with 306 electoral votes.</p>
		</header>
		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="grid grid-cols-3 overflow-hidden rounded text-center text-white">
				<div class="bg-[#244999] p-5"><div class="text-4xl font-black">306</div><div class="text-xs font-black uppercase">Biden</div></div>
				<div class="bg-[#001666] p-5"><div class="text-4xl font-black">270</div><div class="text-xs font-black uppercase">to win</div></div>
				<div class="bg-[#d22532] p-5"><div class="text-4xl font-black">232</div><div class="text-xs font-black uppercase">Trump</div></div>
			</div>
			<a class="mt-5 inline-flex rounded bg-[#b60b03] px-4 py-2 text-sm font-bold text-white hover:bg-[#8f0802]" href="/historical-presidential-elections/2020">Open Historical Page</a>
		</section>
	</main>
	<SiteFooter />
</div>
