<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';
	import type { Party } from '$lib/data/stateOfficials';

	export let data: PageData;

	const state = data.state;

	const partyStyles: Record<Party, { bg: string; text: string; border: string; dot: string }> = {
		Democratic: {
			bg: 'bg-[#eaf0fb]',
			text: 'text-[#2e5aac]',
			border: 'border-[#b6c7e8]',
			dot: 'bg-[#2e5aac]'
		},
		Republican: {
			bg: 'bg-[#fdebed]',
			text: 'text-[#d83a45]',
			border: 'border-[#f0b4ba]',
			dot: 'bg-[#d83a45]'
		},
		Independent: {
			bg: 'bg-[#f0ead8]',
			text: 'text-[#655c3f]',
			border: 'border-[#c8be9a]',
			dot: 'bg-[#c8be9a]'
		},
		Other: {
			bg: 'bg-neutral-100',
			text: 'text-neutral-700',
			border: 'border-neutral-300',
			dot: 'bg-neutral-500'
		}
	};

	const ratings = [
		{ label: 'Safe Democrat', color: '#244999', value: 100 },
		{ label: 'Likely Democrat', color: '#5f7fca', value: 82 },
		{ label: 'Lean Democrat', color: '#96afea', value: 66 },
		{ label: 'Toss-Up', color: '#c8be9a', value: 54 },
		{ label: 'Lean Republican', color: '#ef8d98', value: 66 },
		{ label: 'Likely Republican', color: '#e65e6a', value: 82 },
		{ label: 'Safe Republican', color: '#c12735', value: 100 }
	];

	function handlePortraitError(event: Event) {
		const image = event.currentTarget as HTMLImageElement;
		image.src = '/favicon.svg';
		image.classList.remove('object-cover');
		image.classList.add('object-contain', 'bg-white', 'p-1');
	}

	const totalComposition = state.composition.reduce(
		(acc, row) => ({
			democrat: acc.democrat + row.democrat,
			republican: acc.republican + row.republican,
			other: acc.other + row.other,
			vacant: acc.vacant + row.vacant,
			total: acc.total + row.total
		}),
		{ democrat: 0, republican: 0, other: 0, vacant: 0, total: 0 }
	);

	const pct = (value: number, total: number) => (total > 0 ? (value / total) * 100 : 0);
	const updatedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(state.updated));
	const stateChambers = state.composition.filter((row) => row.body.startsWith('State '));

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'GovernmentOrganization',
		name: `${state.name} Elected Officials`,
		areaServed: state.name,
		url: `/states/${state.slug}`,
		address: {
			'@type': 'PostalAddress',
			addressLocality: state.capital,
			addressRegion: state.abbreviation,
			addressCountry: 'US'
		}
	};
</script>

<svelte:head>
	<title>{state.name} Elected Officials | Path to Win</title>
	<meta
		name="description"
		content={`Find ${state.name} elected officials, partisan composition, Congress members, governor details, legislature data, and election ratings.`}
	/>
	<link rel="canonical" href={`/states/${state.slug}`} />
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</` + `script>`}
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<section class="border-b border-[#2f5bbf] bg-[#001666] text-white">
		<div class="mx-auto max-w-7xl px-4 py-8">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<nav class="text-xs font-semibold text-[#9db8e0]" aria-label="Breadcrumb">
						<a href="/" class="hover:underline">Home</a>
						<span class="mx-1">/</span>
						<span>States</span>
						<span class="mx-1">/</span>
						<span>{state.name}</span>
					</nav>
					<h1 class="mt-3 text-4xl font-black tracking-tight md:text-5xl">
						{state.name} Elected Officials
					</h1>
					<p class="mt-3 max-w-3xl text-sm leading-relaxed text-[#d7e2f7]">
						Search local representation, review partisan composition, and compare federal and state
						officials for {state.name}. Federal officials, governor data, and chamber composition
						are loaded from public online datasets.
					</p>
					<p class="mt-2 text-xs font-semibold uppercase tracking-wide text-[#9db8e0]">
						Data refreshed: {updatedDate}
					</p>
				</div>
				<div class="flex flex-wrap gap-2">
					<a class="rounded bg-[#244999] px-3 py-2 text-xs font-black hover:bg-[#2f5bbf]" href="#share">
						Facebook
					</a>
					<a class="rounded bg-[#244999] px-3 py-2 text-xs font-black hover:bg-[#2f5bbf]" href="#share">
						WhatsApp
					</a>
					<a class="rounded bg-[#244999] px-3 py-2 text-xs font-black hover:bg-[#2f5bbf]" href="#share">
						Reddit
					</a>
					<a class="rounded bg-[#d83a45] px-3 py-2 text-xs font-black hover:bg-[#b92f39]" href={`mailto:?subject=${state.name} Elected Officials`}>
						Email
					</a>
				</div>
			</div>

			<form class="mt-7 grid gap-3 rounded-md border border-[#2f5bbf] bg-white p-3 shadow-lg md:grid-cols-[1fr_auto]">
				<label class="sr-only" for="representative-search">Search by address, ZIP code, or city</label>
				<input
					id="representative-search"
					type="search"
					placeholder="Enter an address, ZIP code, or city"
					class="min-h-12 rounded border border-neutral-300 px-4 text-base text-neutral-900 outline-none focus:border-[#2e5aac] focus:ring-2 focus:ring-[#2e5aac]/20"
				/>
				<button
					type="button"
					class="min-h-12 rounded bg-[#d83a45] px-6 text-sm font-black uppercase tracking-wide text-white hover:bg-[#b92f39]"
				>
					Find Officials
				</button>
			</form>
		</div>
	</section>

	<main class="mx-auto max-w-7xl px-4 py-7">
		<nav class="mb-6 flex flex-wrap gap-2" aria-label={`${state.name} state detail pages`}>
			<a class="rounded bg-white px-3 py-2 text-xs font-black text-[#244999] shadow-sm hover:bg-[#f7f8fb]" href={`/states/${state.slug}/voting-history`}>
				Voting History
			</a>
			<a class="rounded bg-white px-3 py-2 text-xs font-black text-[#244999] shadow-sm hover:bg-[#f7f8fb]" href={`/states/${state.slug}/election-results`}>
				Election Results
			</a>
			<a class="rounded bg-white px-3 py-2 text-xs font-black text-[#244999] shadow-sm hover:bg-[#f7f8fb]" href={`/states/${state.slug}/primary-results`}>
				Primary Results
			</a>
			<a class="rounded bg-white px-3 py-2 text-xs font-black text-[#244999] shadow-sm hover:bg-[#f7f8fb]" href={`/states/${state.slug}/trifectas`}>
				Trifecta
			</a>
		</nav>

		<section class="grid gap-4 md:grid-cols-4" aria-label="State summary">
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="text-xs font-black uppercase tracking-wide text-neutral-500">Capital</div>
				<div class="mt-1 text-2xl font-black text-[#061a55]">{state.capital}</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="text-xs font-black uppercase tracking-wide text-neutral-500">Democrats</div>
				<div class="mt-1 text-2xl font-black text-[#2e5aac]">{totalComposition.democrat}</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="text-xs font-black uppercase tracking-wide text-neutral-500">Republicans</div>
				<div class="mt-1 text-2xl font-black text-[#d83a45]">{totalComposition.republican}</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="text-xs font-black uppercase tracking-wide text-neutral-500">Tracked Seats</div>
				<div class="mt-1 text-2xl font-black text-[#061a55]">{totalComposition.total}</div>
			</div>
		</section>

		<section class="mt-6 rounded-md border border-neutral-200 bg-white shadow-sm">
			<div class="border-b border-neutral-200 px-4 py-3">
				<h2 class="text-lg font-black text-[#061a55]">Partisan Composition</h2>
				<p class="text-sm text-neutral-600">Federal, statewide, and state legislative balance.</p>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full min-w-[760px] border-collapse text-sm">
					<thead class="bg-[#f7f8fb] text-left text-xs font-black uppercase tracking-wide text-neutral-500">
						<tr>
							<th class="px-4 py-3">Office</th>
							<th class="px-4 py-3 text-right">Democrat</th>
							<th class="px-4 py-3 text-right">Republican</th>
							<th class="px-4 py-3 text-right">Other</th>
							<th class="px-4 py-3 text-right">Vacant</th>
							<th class="px-4 py-3 text-right">Total</th>
							<th class="px-4 py-3">Representation</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-100">
						{#each state.composition as row}
							<tr>
								<td class="px-4 py-3 font-bold text-neutral-900">{row.body}</td>
								<td class="px-4 py-3 text-right font-black text-[#2e5aac]">{row.democrat}</td>
								<td class="px-4 py-3 text-right font-black text-[#d83a45]">{row.republican}</td>
								<td class="px-4 py-3 text-right font-semibold text-neutral-600">{row.other}</td>
								<td class="px-4 py-3 text-right font-semibold text-neutral-600">{row.vacant}</td>
								<td class="px-4 py-3 text-right font-black">{row.total}</td>
								<td class="px-4 py-3">
									<div class="flex h-3 overflow-hidden rounded-full bg-neutral-200">
										<div class="bg-[#2e5aac]" style={`width:${pct(row.democrat, row.total)}%`}></div>
										<div class="bg-[#d83a45]" style={`width:${pct(row.republican, row.total)}%`}></div>
										<div class="bg-[#c8be9a]" style={`width:${pct(row.other, row.total)}%`}></div>
										<div class="bg-neutral-400" style={`width:${pct(row.vacant, row.total)}%`}></div>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<section class="mt-6 rounded-md border border-neutral-200 bg-white shadow-sm">
			<div class="border-b border-neutral-200 px-4 py-3">
				<h2 class="text-lg font-black text-[#061a55]">United States Congress</h2>
				<p class="text-sm text-neutral-600">Current senators and representatives from public Congress legislator data.</p>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full min-w-[1040px] border-collapse text-sm">
					<thead class="bg-[#f7f8fb] text-left text-xs font-black uppercase tracking-wide text-neutral-500">
						<tr>
							<th class="px-4 py-3">District</th>
							<th class="px-4 py-3">Title</th>
							<th class="px-4 py-3">Official</th>
							<th class="px-4 py-3">Party</th>
							<th class="px-4 py-3">Since</th>
							<th class="px-4 py-3">Current Term</th>
							<th class="px-4 py-3">Next Election</th>
							<th class="px-4 py-3">Office</th>
							<th class="px-4 py-3">Links</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-100">
						{#each state.congress as official}
							<tr class="align-top hover:bg-[#f9fafc]">
								<td class="px-4 py-3 font-black text-[#061a55]">{official.district}</td>
								<td class="px-4 py-3 font-semibold">{official.title}</td>
								<td class="px-4 py-3">
									<div class="flex items-center gap-3">
										<img
											src={official.photo}
											alt={`${official.name} portrait`}
											class="h-14 w-14 rounded-full border border-neutral-200 object-cover"
											loading="lazy"
											onerror={handlePortraitError}
										/>
										<div>
											<div class="font-black text-neutral-900">{official.name}</div>
											<div class="mt-1 flex gap-1 text-xs text-neutral-500">
												<span aria-label="Facebook">f</span>
												<span aria-label="X">X</span>
											</div>
										</div>
									</div>
								</td>
								<td class="px-4 py-3">
									<span class={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-black ${partyStyles[official.party].bg} ${partyStyles[official.party].text} ${partyStyles[official.party].border}`}>
										<span class={`h-2 w-2 rounded-full ${partyStyles[official.party].dot}`}></span>
										{official.party}
									</span>
								</td>
								<td class="px-4 py-3 font-semibold">{official.since}</td>
								<td class="px-4 py-3 font-semibold">{official.currentTerm}</td>
								<td class="px-4 py-3">
									<span class={`rounded px-2.5 py-1 text-xs font-black text-white ${official.party === 'Democratic' ? 'bg-[#2e5aac]' : official.party === 'Republican' ? 'bg-[#d83a45]' : 'bg-neutral-500'}`}>
										{official.nextElection}
									</span>
								</td>
								<td class="px-4 py-3 text-xs leading-relaxed text-neutral-600">
									<div>{official.address}</div>
									<div class="mt-1 font-bold">{official.phone}</div>
								</td>
								<td class="px-4 py-3">
									<div class="flex flex-col gap-2">
										<a class="rounded bg-[#061a55] px-3 py-1.5 text-center text-xs font-black text-white" href={official.website}>
											Website
										</a>
										<a class="rounded border border-neutral-300 px-3 py-1.5 text-center text-xs font-black text-[#061a55]" href={official.contact}>
											Contact
										</a>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<div class="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
			<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<h2 class="text-lg font-black text-[#061a55]">Governor</h2>
				<div class="mt-4 flex flex-col gap-4 sm:flex-row">
					<img
						src={state.governor.photo}
						alt={`${state.governor.name} portrait`}
						class="h-32 w-32 rounded-md border border-neutral-200 object-cover"
						loading="lazy"
						onerror={handlePortraitError}
					/>
					<div class="min-w-0 flex-1">
						<div class="text-2xl font-black text-neutral-900">{state.governor.name}</div>
						<span class={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-black ${partyStyles[state.governor.party].bg} ${partyStyles[state.governor.party].text} ${partyStyles[state.governor.party].border}`}>
							{state.governor.party}
						</span>
						<dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
							<div>
								<dt class="text-xs font-black uppercase text-neutral-500">Since</dt>
								<dd class="font-bold">{state.governor.since}</dd>
							</div>
							<div>
								<dt class="text-xs font-black uppercase text-neutral-500">Term</dt>
								<dd class="font-bold">{state.governor.currentTerm}</dd>
							</div>
							<div>
								<dt class="text-xs font-black uppercase text-neutral-500">Next Election</dt>
								<dd class="font-bold">{state.governor.nextElection}</dd>
							</div>
							<div>
								<dt class="text-xs font-black uppercase text-neutral-500">Phone</dt>
								<dd class="font-bold">{state.governor.phone}</dd>
							</div>
						</dl>
						<p class="mt-3 text-sm text-neutral-600">{state.governor.address}</p>
						<div class="mt-4 flex gap-2">
							<a class="rounded bg-[#061a55] px-3 py-2 text-xs font-black text-white" href={state.governor.website}>Website</a>
							<a class="rounded border border-neutral-300 px-3 py-2 text-xs font-black text-[#061a55]" href={state.governor.contact}>Contact</a>
						</div>
					</div>
				</div>
			</section>

			<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<h2 class="text-lg font-black text-[#061a55]">State Legislature</h2>
				<p class="mt-1 text-sm text-neutral-600">
					Current chamber composition from the online legislative partisan splits dataset.
				</p>
				<div class="mt-4 space-y-4">
					{#each stateChambers as chamber}
						<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-4">
							<div class="flex items-center justify-between gap-3">
								<h3 class="font-black text-[#061a55]">{chamber.body}</h3>
								<span class="rounded bg-white px-2.5 py-1 text-xs font-black text-neutral-600">
									{chamber.total} seats
								</span>
							</div>
							<div class="mt-3 flex h-3 overflow-hidden rounded-full bg-neutral-200">
								<div class="bg-[#2e5aac]" style={`width:${pct(chamber.democrat, chamber.total)}%`}></div>
								<div class="bg-[#d83a45]" style={`width:${pct(chamber.republican, chamber.total)}%`}></div>
								<div class="bg-[#c8be9a]" style={`width:${pct(chamber.other, chamber.total)}%`}></div>
								<div class="bg-neutral-400" style={`width:${pct(chamber.vacant, chamber.total)}%`}></div>
							</div>
							<div class="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
								<div class="rounded bg-white p-2">
									<div class="font-black text-[#2e5aac]">{chamber.democrat}</div>
									<div class="font-semibold text-neutral-500">Dem</div>
								</div>
								<div class="rounded bg-white p-2">
									<div class="font-black text-[#d83a45]">{chamber.republican}</div>
									<div class="font-semibold text-neutral-500">Rep</div>
								</div>
								<div class="rounded bg-white p-2">
									<div class="font-black text-[#655c3f]">{chamber.other}</div>
									<div class="font-semibold text-neutral-500">Other</div>
								</div>
								<div class="rounded bg-white p-2">
									<div class="font-black text-neutral-600">{chamber.vacant}</div>
									<div class="font-semibold text-neutral-500">Vacant</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>

			<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<h2 class="text-lg font-black text-[#061a55]">Election Ratings</h2>
				<p class="mt-1 text-sm text-neutral-600">Reusable forecast scale for state and district races.</p>
				<div class="mt-4 space-y-3">
					{#each ratings as rating}
						<div>
							<div class="mb-1 flex justify-between text-xs font-black uppercase tracking-wide text-neutral-500">
								<span>{rating.label}</span>
								<span>{rating.value}%</span>
							</div>
							<div class="h-3 overflow-hidden rounded-full bg-neutral-100">
								<div class="h-full rounded-full" style={`width:${rating.value}%;background:${rating.color}`}></div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		</div>

		<section class="mt-6 rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<h2 class="text-lg font-black text-[#061a55]">Data Sources</h2>
			<p class="mt-1 text-sm text-neutral-600">
				This page is generated from online public datasets and cached locally for fast rendering.
			</p>
			<ul class="mt-4 grid gap-3 md:grid-cols-3">
				{#each state.sources as source}
					<li class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-3">
						<a class="text-sm font-black text-[#2e5aac] hover:underline" href={source.url}>
							{source.name}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	</main>

	<SiteFooter />
</div>
