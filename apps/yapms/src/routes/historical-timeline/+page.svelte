<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const featuredYears = ['2024', '2000', '1968', '1932', '1860', '1800'];
	const featuredEvents = data.events.filter((event) => featuredYears.includes(event.year));
	const recentEvents = data.events.slice(0, 8);

	const eras = [
		{
			label: 'Founding Era',
			years: '1788-1824',
			detail: 'Early elections shaped the Electoral College, party formation, and contingent election rules.',
			image: '/portraits/george-washington.jpg'
		},
		{
			label: 'Civil War Realignment',
			years: '1856-1876',
			detail: 'Sectional politics, Lincoln, Reconstruction, and the disputed 1876 result remade the map.',
			image: '/portraits/abraham-lincoln.jpg'
		},
		{
			label: 'New Deal Coalition',
			years: '1932-1948',
			detail: 'Depression-era elections created one of the strongest national Democratic coalitions.',
			image: '/portraits/franklin-d-roosevelt.jpg'
		},
		{
			label: 'Modern Battlegrounds',
			years: '2000-2024',
			detail: 'Close Electoral College outcomes and polarized state coalitions define the current era.',
			image: '/portraits/donald-trump.jpg'
		}
	];
</script>

<svelte:head>
	<title>Historical Election Timeline | Presidential Maps and Images | Path to Win</title>
	<meta
		name="description"
		content="Detailed timeline of major U.S. presidential election milestones with winner portraits, electoral vote margins, historical eras, and links to interactive maps."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="flex-1">
		<section class="border-b border-neutral-200 bg-white">
			<div class="mx-auto grid w-full max-w-7xl gap-6 px-4 py-7 lg:grid-cols-[1fr_420px] lg:items-center">
				<div>
					<nav class="mb-3 text-xs text-neutral-500" aria-label="Breadcrumb">
						<a href="/" class="hover:underline">Home</a>
						<span class="mx-1">/</span>
						<span>Historical Timeline</span>
					</nav>
					<p class="text-xs font-black uppercase tracking-[0.18em] text-[#b60b03]">Presidential History</p>
					<h1 class="mt-2 text-4xl font-black tracking-tight text-[#061a55] md:text-5xl">
						Historical Election Timeline
					</h1>
					<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">
						Move through every mapped U.S. presidential election from the founding era to the modern
						battleground map. Each timeline item links to an interactive Electoral College result.
					</p>
					<div class="mt-5 grid gap-3 sm:grid-cols-3">
						<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-4">
							<div class="text-3xl font-black text-[#061a55]">{data.events.length}</div>
							<div class="mt-1 text-xs font-bold uppercase tracking-wide text-neutral-500">Mapped Elections</div>
						</div>
						<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-4">
							<div class="text-3xl font-black text-[#b60b03]">270</div>
							<div class="mt-1 text-xs font-bold uppercase tracking-wide text-neutral-500">Modern Win Line</div>
						</div>
						<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-4">
							<div class="text-3xl font-black text-[#244999]">1788</div>
							<div class="mt-1 text-xs font-bold uppercase tracking-wide text-neutral-500">First Election</div>
						</div>
					</div>
				</div>
				<div class="overflow-hidden rounded-md border border-neutral-200 bg-[#061a55] text-white shadow-sm">
					<img
						src="/portraits/george-washington.jpg"
						alt="George Washington"
						class="h-72 w-full object-cover object-top"
					/>
					<div class="p-4">
						<div class="text-xs font-black uppercase tracking-wide text-[#9db8e0]">Archive starting point</div>
						<div class="mt-1 text-xl font-black">The Electoral College begins</div>
						<p class="mt-2 text-sm leading-relaxed text-[#dce6fb]">
							The timeline starts with the first presidential election and follows each major shift in
							the map through 2024.
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto w-full max-w-7xl px-4 py-6">
			<div class="mb-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
				<div>
					<h2 class="text-xl font-black text-[#061a55]">Major Turning Points</h2>
					<p class="text-sm text-neutral-600">Key elections with lasting effects on the national map.</p>
				</div>
				<a href="/historical-presidential-elections" class="text-sm font-bold text-[#244999] hover:underline">
					Browse all historical maps
				</a>
			</div>
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each featuredEvents as event}
					<a href={event.href} class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm hover:border-[#244999]">
						<div class="border-b border-neutral-200 bg-[#f7f8fb] p-3">
							<div class="flex items-center gap-3">
								<div class="flex -space-x-4">
									{#if event.winnerPortrait}
										<img
											src={event.winnerPortrait}
											alt={event.winner}
											class="h-16 w-16 rounded-full border-2 border-white object-cover object-top shadow-sm"
											style={`outline:2px solid ${event.color}`}
											loading="lazy"
										/>
									{:else}
										<div class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-sm font-black text-white shadow-sm" style={`background:${event.color}`}>
											{event.year}
										</div>
									{/if}
									{#if event.runnerUpPortrait}
										<img
											src={event.runnerUpPortrait}
											alt={event.runnerUp ?? 'Runner-up'}
											class="h-16 w-16 rounded-full border-2 border-white object-cover object-top shadow-sm"
											style={`outline:2px solid ${event.runnerUpColor ?? '#737373'}`}
											loading="lazy"
										/>
									{/if}
								</div>
								<div>
									<div class="text-xs font-black uppercase tracking-wide text-[#b60b03]">{event.year}</div>
									<div class="font-black text-[#061a55]">{event.winner}</div>
									{#if event.runnerUp}
										<div class="text-xs font-semibold text-neutral-500">def. {event.runnerUp}</div>
									{/if}
								</div>
							</div>
						</div>
						<div class="p-4">
							<div class="text-sm font-bold text-neutral-800">{event.title}</div>
							<p class="mt-2 text-sm leading-relaxed text-neutral-600">{event.detail}</p>
							<div class="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded bg-neutral-200 text-center text-xs font-bold">
								<div class="bg-white px-2 py-2">{event.winnerEV} EV</div>
								<div class="bg-white px-2 py-2">{event.margin} margin</div>
								<div class="bg-white px-2 py-2">{event.totalEV} total</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section class="mx-auto w-full max-w-7xl px-4 pb-6">
			<div class="mb-3">
				<h2 class="text-xl font-black text-[#061a55]">Historical Eras</h2>
				<p class="text-sm text-neutral-600">A quick guide to the major periods behind the timeline.</p>
			</div>
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{#each eras as era}
					<article class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
						<img src={era.image} alt="" class="h-36 w-full object-cover object-top" loading="lazy" aria-hidden="true" />
						<div class="p-4">
							<div class="text-xs font-black uppercase tracking-wide text-[#b60b03]">{era.years}</div>
							<h3 class="mt-1 font-black text-[#061a55]">{era.label}</h3>
							<p class="mt-2 text-sm leading-relaxed text-neutral-600">{era.detail}</p>
						</div>
					</article>
				{/each}
			</div>
		</section>

		<section class="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-8 lg:grid-cols-[1fr_340px]">
			<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<div class="mb-4">
					<h2 class="text-xl font-black text-[#061a55]">Full Timeline</h2>
					<p class="text-sm text-neutral-600">Newest elections appear first. Open any year for its map and full result.</p>
				</div>
				<div class="space-y-3">
					{#each data.events as event}
						<a
							href={event.href}
							class="grid gap-3 rounded-md border border-transparent p-3 transition hover:border-neutral-200 hover:bg-[#f7f8fb] md:grid-cols-[84px_128px_1fr]"
						>
							<div class="font-black text-[#b60b03]">{event.year}</div>
							<div class="flex items-center -space-x-3">
								{#if event.winnerPortrait}
									<img
										src={event.winnerPortrait}
										alt={event.winner}
										class="h-16 w-16 rounded-full border-2 border-white object-cover object-top shadow-sm"
										style={`outline:2px solid ${event.color}`}
										loading="lazy"
									/>
								{:else}
									<div class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-xs font-black text-white shadow-sm" style={`background:${event.color}`}>
										{event.winner.slice(0, 2)}
									</div>
								{/if}
								{#if event.runnerUpPortrait}
									<img
										src={event.runnerUpPortrait}
										alt={event.runnerUp ?? 'Runner-up'}
										class="h-14 w-14 rounded-full border-2 border-white object-cover object-top shadow-sm"
										style={`outline:2px solid ${event.runnerUpColor ?? '#737373'}`}
										loading="lazy"
									/>
								{:else if event.runnerUp}
									<div class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-neutral-500 text-xs font-black text-white shadow-sm">
										{event.runnerUp
											.split(' ')
											.map((part) => part[0])
											.slice(0, 2)
											.join('')}
									</div>
								{/if}
							</div>
							<div>
								<div class="flex flex-wrap items-center gap-2">
									<div class="font-bold text-[#061a55]">{event.title}</div>
									<span class="rounded bg-[#eef1f5] px-2 py-0.5 text-xs font-bold text-neutral-600">
										{event.margin} EV margin
									</span>
								</div>
								<p class="mt-1 text-sm leading-relaxed text-neutral-600">{event.detail}</p>
								{#if event.runnerUp}
									<p class="mt-1 text-xs font-semibold text-neutral-500">
										Runner-up: {event.runnerUp} {event.runnerUpEV} EV
									</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>

			<aside class="space-y-5">
				<section class="rounded-md border border-neutral-200 bg-white shadow-sm">
					<div class="border-b border-neutral-200 px-4 py-3">
						<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">Recent Elections</h2>
					</div>
					<div class="grid gap-px bg-neutral-200">
						{#each recentEvents as event}
							<a href={event.href} class="flex items-center gap-3 bg-white p-3 hover:bg-[#f7f8fb]">
								<div class="flex -space-x-2">
									{#if event.winnerPortrait}
										<img
											src={event.winnerPortrait}
											alt=""
											class="h-11 w-11 rounded-full border-2 border-white object-cover object-top shadow-sm"
											loading="lazy"
											aria-hidden="true"
										/>
									{/if}
									{#if event.runnerUpPortrait}
										<img
											src={event.runnerUpPortrait}
											alt=""
											class="h-11 w-11 rounded-full border-2 border-white object-cover object-top shadow-sm"
											loading="lazy"
											aria-hidden="true"
										/>
									{/if}
								</div>
								<div class="min-w-0">
									<div class="text-sm font-black text-[#061a55]">{event.year} - {event.winner}</div>
									<div class="text-xs text-neutral-500">{event.winnerEV} electoral votes</div>
								</div>
							</a>
						{/each}
					</div>
				</section>

				<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">How To Read It</h2>
					<p class="mt-3 text-sm leading-relaxed text-neutral-600">
						Each row shows the winner, electoral vote total, top-two margin, and historical note.
						The portrait links directly into that year&apos;s interactive Electoral College map.
					</p>
				</section>
			</aside>
		</section>
	</main>
	<SiteFooter />
</div>
