<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import { stateOfficials } from '$lib/data/stateOfficials';

	const states = Object.values(stateOfficials).sort((a, b) => a.name.localeCompare(b.name));
	const senators = states.flatMap((state) =>
		state.congress
			.filter((official) => official.title === 'Senator')
			.map((official) => ({ ...official, stateName: state.name, stateSlug: state.slug }))
	);

	const partyClass = (party: string) =>
		party === 'Democratic'
			? 'bg-[#eaf0fb] text-[#244999] border-[#b6c7e8]'
			: party === 'Republican'
				? 'bg-[#fdebed] text-[#c12735] border-[#f0b4ba]'
				: 'bg-[#f0ead8] text-[#655c3f] border-[#c8be9a]';
</script>

<svelte:head>
	<title>Contact U.S. Senators | Path to Win</title>
	<meta name="description" content="Find state elected officials pages with U.S. senator contact links." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>Contact Senators</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">Contact U.S. Senators</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Find senator websites, contact pages, office addresses, and phone numbers from the current officials dataset.
			</p>
		</header>
		<section class="grid gap-4 md:grid-cols-2">
			{#each senators as senator}
				<article class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
					<div class="flex gap-4">
						<img
							src={senator.photo}
							alt=""
							class="h-20 w-20 rounded-md border border-neutral-200 object-cover"
							loading="lazy"
						/>
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-start justify-between gap-2">
								<div>
									<h2 class="truncate text-lg font-black text-[#061a55]">{senator.name}</h2>
									<p class="text-sm font-bold text-neutral-600">{senator.stateName} · {senator.district}</p>
								</div>
								<span class={`rounded-full border px-2 py-1 text-xs font-black ${partyClass(senator.party)}`}>
									{senator.party}
								</span>
							</div>
							<div class="mt-3 grid gap-1 text-sm text-neutral-700">
								{#if senator.phone}<a class="font-bold text-[#244999] hover:underline" href={`tel:${senator.phone}`}>{senator.phone}</a>{/if}
								{#if senator.address}<span>{senator.address}</span>{/if}
							</div>
							<div class="mt-3 flex flex-wrap gap-2">
								<a class="rounded bg-[#244999] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1d397d]" href={senator.website}>Website</a>
								<a class="rounded bg-[#b60b03] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#8f0802]" href={senator.contact}>Contact</a>
								<a class="rounded border border-neutral-300 px-3 py-1.5 text-xs font-bold text-[#061a55] hover:bg-neutral-50" href={`/states/${senator.stateSlug}`}>State page</a>
							</div>
						</div>
					</div>
				</article>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
