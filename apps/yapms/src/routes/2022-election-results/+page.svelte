<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const results = [
		{ office: 'Senate', winner: 'Democrats', total: '51 seats', href: '/2022-senate-election-results', color: '#244999' },
		{ office: 'House', winner: 'Republicans', total: '222 seats', href: '/2022-house-election-results', color: '#d22532' },
		{ office: 'Governor', winner: 'Republicans', total: '26 governorships', href: '/2022-governor-election-results', color: '#d22532' }
	];
</script>

<svelte:head>
	<title>2022 Election Results | Path to Win</title>
	<meta name="description" content="2022 U.S. midterm election results hub for Senate, House, and governor races." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>2022 Results</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">2022 Election Results</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">Midterm result hub for Senate, House, and governor elections.</p>
		</header>
		<section class="grid gap-4 md:grid-cols-3">
			{#each results as result}
				<a href={result.href} class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm hover:border-[#244999]">
					<div class="h-1.5 w-14 rounded-full" style={`background:${result.color}`}></div>
					<h2 class="mt-4 text-xl font-black text-[#061a55]">{result.office}</h2>
					<p class="mt-2 text-sm font-bold" style={`color:${result.color}`}>{result.winner} · {result.total}</p>
				</a>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
