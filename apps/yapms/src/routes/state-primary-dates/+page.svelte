<script lang="ts">
	/* This page was titled "State Primary Dates" and contained neither a state
	 * nor a date. It listed six month names with notes about "Super Tuesday and
	 * major delegate allocation windows" — a description of a presidential
	 * nomination race, which 2026 is not — and admitted in its own subheading
	 * that it was "structured for official state election date feeds", meaning
	 * the data had never been added.
	 *
	 * The 2026 calendar is public, fixed a year ahead and published in one table
	 * by the Federal Voting Assistance Program, so there was nothing to invent.
	 * It now lists all 50 states plus DC and the territories, grouped by date so
	 * the shape of the calendar is visible, and marks what has already happened
	 * against today rather than freezing a snapshot.
	 */
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const MONTHS = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	/** "2026-09-09" -> "Wednesday 9 September" */
	function longDate(iso: string): string {
		const d = new Date(`${iso}T00:00:00Z`);
		return `${DOW[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
	}
	/** "2026-09-09" -> "9 Sep" */
	function shortDate(iso: string): string {
		const d = new Date(`${iso}T00:00:00Z`);
		return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)}`;
	}
	function daysFromToday(iso: string): number {
		return Math.round(
			(Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${data.today}T00:00:00Z`)) / 86_400_000
		);
	}

	// $derived, not a plain const: `data` is reactive, so capturing it once here
	// is what svelte-check flags.
	const s = $derived(data.summary);
	const past = (iso: string) => iso < data.today;

	type View = 'Calendar' | 'By state';
	let view = $state<View>('Calendar');

	// Alphabetical for the lookup view; the calendar view stays chronological.
	const alphabetical = $derived([...data.states].sort((a, b) => a.name.localeCompare(b.name)));

	// Counted from the data rather than written into the prose, so the sentence
	// cannot drift out of step with the table under it.
	const runoffStates = $derived(data.states.filter((st) => st.runoff).map((st) => st.name));
	const senateStates = $derived(data.states.filter((st) => st.senate).length);

	// Derived rather than built once, so it tracks `data` and stays in step with
	// the runoff list rendered below.
	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'When are the 2026 primary elections?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: `The 2026 congressional primary season runs from ${longDate(data.summary.firstDate)} to ${longDate(data.summary.lastDate)}. The general election is Tuesday 3 November 2026.`
				}
			},
			{
				'@type': 'Question',
				name: 'Which states hold primary runoffs?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: `${runoffStates.length} states hold a congressional runoff when no candidate clears the required share of the vote: ${runoffStates.join(', ')}.`
				}
			}
		]
	});
</script>

<svelte:head>
	<title>2026 State Primary Dates | Full Calendar | Path to Win</title>
	<meta
		name="description"
		content="Every 2026 primary date: all 50 states plus DC and the territories, grouped by date, with runoff dates, Senate races and House seats up in each."
	/>
	<link rel="canonical" href="/state-primary-dates" />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>State Primary Dates</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">2026 State Primary Dates</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				The primary season runs from {longDate(s.firstDate)} to {longDate(s.lastDate)}, and the
				general election is {longDate(data.generalElection)}. All {s.states} states are below, plus
				DC and the territories. {senateStates} of them have a Senate seat on the ballot.
			</p>
		</header>

		<section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Calendar summary">
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">Already held</div>
				<div class="mt-1 text-2xl font-black text-[#061a55]">{s.heldCount} of {s.states}</div>
				<div class="mt-1 text-xs text-neutral-500">State primaries completed</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">Still to come</div>
				<div class="mt-1 text-2xl font-black text-[#061a55]">{s.remainingCount}</div>
				<div class="mt-1 text-xs text-neutral-500">
					{#if s.remainingCount}
						Through {longDate(s.lastDate)}
					{:else}
						The primary calendar is complete
					{/if}
				</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">Next date</div>
				{#if s.nextDay}
					<div class="mt-1 text-2xl font-black text-[#061a55]">{shortDate(s.nextDay.date)}</div>
					<div class="mt-1 text-xs text-neutral-500">
						{#if daysFromToday(s.nextDay.date) === 0}
							Today
						{:else}
							In {daysFromToday(s.nextDay.date)} day{daysFromToday(s.nextDay.date) === 1 ? '' : 's'}
						{/if}
					</div>
				{:else}
					<div class="mt-1 text-2xl font-black text-neutral-400">&mdash;</div>
					<div class="mt-1 text-xs text-neutral-500">Nothing left on the calendar</div>
				{/if}
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
					General election
				</div>
				<div class="mt-1 text-2xl font-black text-[#061a55]">{s.daysToGeneral} days</div>
				<div class="mt-1 text-xs text-neutral-500">3 November 2026</div>
			</div>
		</section>

		{#if s.nextDay}
			<section
				class="rounded-md border-l-4 border-[#d83a45] bg-white p-5 shadow-sm"
				aria-label="Next primary date"
			>
				<div class="text-xs font-black uppercase tracking-wide text-neutral-500">Next up</div>
				<h2 class="mt-1 text-xl font-black text-[#061a55]">{longDate(s.nextDay.date)}</h2>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					{#if s.nextDay.primaries.length}
						Primaries in {s.nextDay.primaries.map((p) => p.name).join(', ')}.
					{/if}
					{#if s.nextDay.runoffs.length}
						Runoff{s.nextDay.runoffs.length === 1 ? '' : 's'} in {s.nextDay.runoffs
							.map((p) => p.name)
							.join(', ')}.
					{/if}
				</p>
			</section>
		{/if}

		<nav class="flex flex-wrap gap-2" aria-label="View">
			{#each ['Calendar', 'By state'] as v}
				<button
					type="button"
					onclick={() => (view = v as View)}
					class={`rounded border px-3 py-1.5 text-xs font-black ${
						view === v
							? 'border-[#061a55] bg-[#061a55] text-white'
							: 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
					}`}
				>
					{v}
				</button>
			{/each}
		</nav>

		{#if view === 'Calendar'}
			<section class="flex flex-col gap-3">
				{#each data.days as day (day.date)}
					<article
						class={`rounded-md border bg-white p-4 shadow-sm ${
							past(day.date) ? 'border-neutral-200 opacity-70' : 'border-neutral-300'
						}`}
					>
						<div class="flex flex-wrap items-baseline justify-between gap-2">
							<h2 class="text-base font-black text-[#061a55]">{longDate(day.date)}</h2>
							<span class="text-[11px] font-bold uppercase tracking-wide text-neutral-400">
								{#if past(day.date)}
									Held
								{:else if daysFromToday(day.date) === 0}
									Today
								{:else}
									In {daysFromToday(day.date)} day{daysFromToday(day.date) === 1 ? '' : 's'}
								{/if}
							</span>
						</div>

						{#if day.primaries.length}
							<div class="mt-3 flex flex-wrap gap-2">
								{#each day.primaries as p (p.name)}
									{#if p.slug}
										<a
											href={`/states/${p.slug}`}
											class="inline-flex items-baseline gap-2 rounded border border-neutral-200 px-2.5 py-1 text-sm font-semibold text-[#244999] hover:bg-[#f7f8fb]"
										>
											{p.name}
											{#if p.senate}
												<span class="text-[10px] font-black uppercase text-[#d83a45]">Senate</span>
											{/if}
										</a>
									{:else}
										<span
											class="inline-flex items-baseline gap-2 rounded border border-neutral-200 bg-[#f7f8fb] px-2.5 py-1 text-sm font-semibold text-neutral-600"
										>
											{p.name}
											<span class="text-[10px] font-black uppercase text-neutral-400">Delegate</span>
										</span>
									{/if}
								{/each}
							</div>
						{/if}

						{#if day.runoffs.length}
							<p class="mt-3 text-xs text-neutral-600">
								<span class="font-black uppercase tracking-wide text-[#7a6e43]">Runoff</span>
								&middot; {day.runoffs.map((r) => r.name).join(', ')}
							</p>
						{/if}
					</article>
				{/each}
			</section>
		{:else}
			<section class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
				<div class="overflow-x-auto">
					<table class="w-full min-w-[600px] border-collapse text-sm">
						<thead
							class="bg-[#f7f8fb] text-left text-[11px] uppercase tracking-wide text-neutral-500"
						>
							<tr class="border-b border-neutral-200">
								<th class="px-4 py-3" scope="col">State</th>
								<th class="px-4 py-3" scope="col">Primary</th>
								<th class="px-4 py-3" scope="col">Runoff</th>
								<th class="px-4 py-3 text-center" scope="col">Senate seat</th>
								<th class="px-4 py-3 text-right" scope="col">House seats</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-neutral-100">
							{#each alphabetical as st (st.name)}
								<tr class="hover:bg-[#f9fafc]">
									<td class="px-4 py-2.5 font-bold">
										<a class="text-[#244999] hover:underline" href={`/states/${st.slug}`}>
											{st.name}
										</a>
									</td>
									<td class={`px-4 py-2.5 ${st.primary && past(st.primary) ? 'text-neutral-400' : 'font-semibold'}`}>
										{st.primary ? shortDate(st.primary) : '—'}
										{#if st.primary && past(st.primary)}
											<span class="ml-1 text-[10px] uppercase">held</span>
										{/if}
									</td>
									<td class="px-4 py-2.5 text-neutral-600">
										{st.runoff ? shortDate(st.runoff) : '—'}
									</td>
									<td class="px-4 py-2.5 text-center">
										{#if st.senate}
											<span class="font-black text-[#d83a45]">Yes</span>
										{:else}
											<span class="text-neutral-400">No</span>
										{/if}
									</td>
									<td class="px-4 py-2.5 text-right font-semibold tabular-nums">{st.houseSeats}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/if}

		<section class="rounded-md border border-neutral-200 bg-white p-5 text-sm leading-relaxed text-neutral-600 shadow-sm">
			<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">About these dates</h2>
			<p class="mt-3">
				Dates are from the Federal Voting Assistance Program&rsquo;s
				<a
					class="underline hover:text-neutral-700"
					href="https://www.fvap.gov/uploads/FVAP/VAO/PrimaryElectionsCalendar.pdf"
					rel="noopener"
					target="_blank">2026 primary elections chart</a
				>, current as of May 2026, and cross-checked against Wikipedia&rsquo;s 2026 Senate
				election-dates table for the 35 states with a Senate race.
			</p>
			<p class="mt-3">
				The runoff column covers congressional runoffs, which {runoffStates.length} states hold when
				no candidate clears the required share of the vote: {runoffStates.join(', ')}. A state can
				therefore hold a runoff for another office on a date not listed here — South
				Dakota&rsquo;s gubernatorial runoff in July is one.
			</p>
			<p class="mt-3">
				Primary dates can move, and some already have: Arizona&rsquo;s was rescheduled to 21 July.
				Check your state election office for the authoritative date before relying on it to vote.
			</p>
		</section>
	</main>
	<SiteFooter />
</div>
