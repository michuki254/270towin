<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(value: string): string {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return 'date unavailable';
		return new Intl.DateTimeFormat('en-US', {
			dateStyle: 'long',
			timeZone: 'UTC'
		}).format(date);
	}
</script>

<svelte:head>
	<title>Election Data &amp; Methodology | Path to Win</title>
	<meta
		name="description"
		content="See how Path to Win distinguishes certified election results, historical summaries, race ratings, live market prices, and editable election scenarios."
	/>
	<meta property="og:title" content="Election Data &amp; Methodology | Path to Win" />
	<meta
		property="og:description"
		content="Sources, scope, and limitations for Path to Win election data and interactive maps."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-8">
		<nav class="text-xs text-neutral-500" aria-label="Breadcrumb">
			<a href="/" class="hover:underline">Home</a>
			<span class="mx-1">/</span>
			<a href="/about" class="hover:underline">About</a>
			<span class="mx-1">/</span>
			<span>Election Data &amp; Methodology</span>
		</nav>

		<header class="rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
			<p class="text-xs font-black uppercase tracking-[0.16em] text-[#b60b03]">
				Sources &amp; scope
			</p>
			<h1 class="mt-2 text-3xl font-black text-[#001666]">Election Data &amp; Methodology</h1>
			<p class="mt-4 leading-relaxed text-neutral-700">
				Path to Win combines historical result summaries, official roster and calendar references,
				third-party race ratings, market prices, and interactive scenarios. They are different kinds
				of information. This page explains which is which so a map or percentage is not mistaken for
				a certified result or a forecast produced by this site.
			</p>
		</header>

		<section class="rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
			<h2 class="text-xl font-black text-[#001666]">Certified results and current rosters</h2>
			<p class="mt-3 leading-relaxed text-neutral-700">
				Where a page presents a certified result, it links to the relevant source. The 2028
				presidential map uses the 2024 Electoral College result published by the
				<a
					class="font-semibold text-[#244999] underline"
					href="https://www.archives.gov/electoral-college/2024">National Archives</a
				>
				as its starting scenario. Current officeholder balances are snapshots; the
				<a class="font-semibold text-[#244999] underline" href="/forecasts">Forecasts page</a> identifies
				the roster sources and review dates used for its Senate, House, and governor summaries.
			</p>
			<ul class="mt-3 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-neutral-700">
				<li>
					Senate members and Class II seats:
					<a class="font-semibold text-[#244999] underline" href="https://www.senate.gov/senators/"
						>U.S. Senate roster</a
					>
					and
					<a
						class="font-semibold text-[#244999] underline"
						href="https://www.senate.gov/senators/Class_II.htm">Class II list</a
					>.
				</li>
				<li>
					House membership and vacancies:
					<a
						class="font-semibold text-[#244999] underline"
						href="https://clerk.house.gov/Members/ViewMemberList"
						>Office of the House Clerk member list</a
					>
					and
					<a
						class="font-semibold text-[#244999] underline"
						href="https://clerk.house.gov/Members/ViewVacancies">vacancies</a
					>.
				</li>
				<li>
					Governor roster:
					<a class="font-semibold text-[#244999] underline" href="https://www.nga.org/governors/"
						>National Governors Association</a
					>.
				</li>
			</ul>
			<p class="mt-3 leading-relaxed text-neutral-700">
				The 2026 primary calendar follows the
				<a
					class="font-semibold text-[#244999] underline"
					href="https://www.fvap.gov/uploads/FVAP/VAO/PrimaryElectionsCalendar.pdf"
					>Federal Voting Assistance Program calendar</a
				>, with the Arizona date checked against the
				<a
					class="font-semibold text-[#244999] underline"
					href="https://azsos.gov/elections/election-information/2026-election-info"
					>Arizona Secretary of State</a
				>. Dates and procedures can change; the state election office is the final source for
				current ballot information and certified results.
			</p>
		</section>

		<section class="rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
			<h2 class="text-xl font-black text-[#001666]">Historical governor archive</h2>
			<p class="mt-3 leading-relaxed text-neutral-700">
				The <a class="font-semibold text-[#244999] underline" href="/historical-governor-elections"
					>governor archive</a
				> covers 49 annual cycles from 1976 through 2024. Each year page groups states by the party recorded
				as winning that cycle&rsquo;s governor race and shows the party balance across all 50 governorships
				after the cycle, including states that did not hold an election that year. It does not provide
				candidate vote totals or margins.
			</p>
			<p class="mt-3 leading-relaxed text-neutral-700">
				The bundled annual-party dataset references the corresponding
				<a
					class="font-semibold text-[#244999] underline"
					href="https://en.wikipedia.org/wiki/United_States_gubernatorial_elections"
					>Wikipedia gubernatorial-election summaries</a
				>; each year page links to its year-specific reference. These are secondary references, not
				state-certified canvass records. Use the relevant state election office for an authoritative
				vote total. The current bundled data file was generated {formatDate(
					data.governorDatasetGeneratedAt
				)}; that timestamp is not a claim that every record was independently reverified on that
				date.
			</p>
		</section>

		<section class="rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
			<h2 class="text-xl font-black text-[#001666]">Race ratings, market prices, and maps</h2>
			<ul class="mt-3 flex list-disc flex-col gap-3 pl-5 leading-relaxed text-neutral-700">
				<li>
					The selected 2026 Senate race categories follow
					<a
						class="font-semibold text-[#244999] underline"
						href="https://sabatoscrystalball.substack.com/">Sabato&rsquo;s Crystal Ball</a
					>. They are the source&rsquo;s editorial assessment of seat competitiveness, not
					percentages or forecasts made by Path to Win. The page keeps a site-side snapshot; consult
					the source for its latest ratings.
				</li>
				<li>
					Market prices are retrieved from
					<a class="font-semibold text-[#244999] underline" href="https://polymarket.com/"
						>Polymarket</a
					> and shown with the time they were read. Each contract is priced independently, so related
					prices need not add up to 100%. Prices move and are not certified outcomes.
				</li>
				<li>
					Interactive maps let visitors assign states or districts and see the resulting seat or
					electoral-vote count. Those assignments are scenarios, not official calls. The 2028
					presidential map starts either from the certified 2024 result or from a blank map.
				</li>
			</ul>
		</section>

		<section class="rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
			<h2 class="text-xl font-black text-[#001666]">Corrections and questions</h2>
			<p class="mt-3 leading-relaxed text-neutral-700">
				Source links are provided on the relevant data pages. If you find an error or a broken
				source, please <a class="font-semibold text-[#244999] underline" href="/contact"
					>contact Path to Win</a
				>
				with the page URL and the source that supports the correction.
			</p>
		</section>
	</main>
	<SiteFooter />
</div>
