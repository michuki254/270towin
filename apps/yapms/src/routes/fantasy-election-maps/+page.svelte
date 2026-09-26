<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const maps = [
		{
			label: 'USA & Canada States',
			href: '/app/usa_can/states/2026001/blank',
			description: 'Cross-border state and province scenario builder.',
			embed: '/app/usa_can/states/2026001/blank?embed=1'
		},
		{
			label: 'Yapmeria Presidential',
			href: '/app/yap/presidential/2025285/blank',
			description: 'Fantasy presidential election geography.',
			embed: '/app/yap/presidential/2025285/blank?embed=1'
		},
		{
			label: 'YRC Fair Map',
			href: '/app/yrc/fair/2025294/blank',
			description: 'Alternate redistricting council map scenario.',
			embed: '/app/yrc/fair/2025294/blank?embed=1'
		}
	];
</script>

<svelte:head>
	<title>Fantasy Election Maps | Path to Win</title>
	<meta name="description" content="Fantasy and alternate election map tools." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>Fantasy Maps</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">Fantasy Election Maps</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">Alternate geography and custom scenario maps for creative election modeling.</p>
		</header>
		<section class="grid gap-4 lg:grid-cols-3">
			{#each maps as map}
				<article class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
					<div class="h-56 overflow-hidden bg-neutral-100">
						<iframe
							src={map.embed}
							title={`${map.label} preview`}
							class="h-[420px] w-full origin-top scale-[0.55] border-0"
							loading="lazy"
						></iframe>
					</div>
					<div class="p-5">
						<h2 class="text-lg font-black text-[#061a55]">{map.label}</h2>
						<p class="mt-2 text-sm leading-relaxed text-neutral-600">{map.description}</p>
						<a class="mt-4 inline-flex rounded bg-[#b60b03] px-3 py-2 text-xs font-bold text-white hover:bg-[#8f0802]" href={map.href}>
							Open Map
						</a>
					</div>
				</article>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
