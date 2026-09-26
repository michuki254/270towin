<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
</script>

<svelte:head>
	<title>2024 House Election Results | Path to Win</title>
	<meta name="description" content="2024 U.S. House election results archive and chamber control summary." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>2024 House</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">2024 House Election Results</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Archive page for the 2024 U.S. House election cycle and chamber control result.
			</p>
		</header>
		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="grid gap-4 md:grid-cols-3">
				<div><div class="text-4xl font-black text-[#d22532]">220</div><p class="font-bold">Republicans</p></div>
				<div><div class="text-4xl font-black text-[#244999]">215</div><p class="font-bold">Democrats</p></div>
				<div class="flex items-center">
					<a class="rounded bg-[#b60b03] px-4 py-2 text-sm font-bold text-white hover:bg-[#8f0802]" href="/historical-house-elections/2024">
						Open Historical Page
					</a>
				</div>
			</div>
		</section>
	</main>
	<SiteFooter />
</div>
