<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const offices = [
		{ label: 'President', href: '/2024-presidential-election-results' },
		{ label: 'Senate', href: '/2024-senate-election-results' },
		{ label: 'House', href: '/2022-house-election-results' },
		{ label: 'Governor', href: '/2024-governor-election-results' }
	];
</script>

<svelte:head>
	<title>State Election Results | Path to Win</title>
	<meta name="description" content="State election result archive for presidential, Senate, House, and governor races." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>State Election Results</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">State Election Results</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">Navigate result archives and state-by-state election pages across major offices.</p>
		</header>
		<section class="grid gap-4 md:grid-cols-2">
			{#each offices as office}
				<a href={office.href} class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm hover:border-[#244999]">
					<h2 class="text-xl font-black text-[#061a55]">{office.label} Results</h2>
					<p class="mt-2 text-sm text-neutral-600">Open the latest available {office.label.toLowerCase()} result dashboard.</p>
				</a>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
