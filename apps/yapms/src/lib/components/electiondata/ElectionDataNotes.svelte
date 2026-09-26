<script lang="ts">
	type ElectionKind = 'senate' | 'house' | 'governor';
	export let kind: ElectionKind;

	const sourceNotes = {
		senate: {
			method:
				'The map is a scenario builder, not a forecast. It covers 33 regular Class II Senate seats and the Florida and Ohio special elections. The race table is a selected group of contests; ratings are Sabato’s Crystal Ball assessments, not probabilities. Polymarket prices Senate control, but does not offer a market for each state race.',
			sources: [
				{ label: 'Current senators, parties, and classes — U.S. Senate', href: 'https://www.senate.gov/senators/' },
				{ label: 'Class II senators — U.S. Senate', href: 'https://www.senate.gov/senators/Class_II.htm' },
				{ label: 'Senators up for election in 2026 — U.S. Senate Daily Press', href: 'https://www.dailypress.senate.gov/on-the-floor/senate-facts/' },
				{ label: '2026 primary and general election calendar — Federal Voting Assistance Program', href: 'https://www.fvap.gov/uploads/FVAP/VAO/PrimaryElectionsCalendar.pdf' },
				{ label: 'Official state election offices — USAGov', href: 'https://www.usa.gov/state-election-office' },
				{ label: 'Senate candidates and filings — Federal Election Commission', href: 'https://www.fec.gov/data/candidates/senate/' },
				{ label: 'Race ratings — Sabato’s Crystal Ball', href: 'https://centerforpolitics.org/crystalball/' },
				{ label: 'Senate-control market — Polymarket', href: 'https://polymarket.com/event/which-party-will-win-the-senate-in-2026' }
			]
		},
		house: {
			method:
				'The map is a scenario builder, not a forecast. The table shows 12 selected districts and the people currently holding those seats; it is not a complete list of 2026 nominees or an official ratings table. House-control odds come from Polymarket. Current membership and vacancies are checked against the House Clerk.',
			sources: [
				{ label: 'Current member list — Office of the House Clerk', href: 'https://clerk.house.gov/Members/ViewMemberList' },
				{ label: 'Current vacancies and special elections — Office of the House Clerk', href: 'https://clerk.house.gov/Members/ViewVacancies' },
				{ label: 'Official state election offices — USAGov', href: 'https://www.usa.gov/state-election-office' },
				{ label: '2026 primary and general election calendar — Federal Voting Assistance Program', href: 'https://www.fvap.gov/uploads/FVAP/VAO/PrimaryElectionsCalendar.pdf' },
				{ label: 'House candidates and filings — Federal Election Commission', href: 'https://www.fec.gov/data/candidates/house/' },
				{ label: 'House-control market — Polymarket', href: 'https://polymarket.com/event/which-party-will-win-the-house-in-2026' },
				{ label: 'House outlook — Sabato’s Crystal Ball', href: 'https://centerforpolitics.org/crystalball/the-house-democrats-favored-on-what-starts-as-a-small-battlefield/' }
			]
		},
		governor: {
			method:
				'The map covers 36 state gubernatorial elections; it excludes territorial contests. The market board includes only races where the Democratic and Republican contracts can be identified. “Competitive” means those prices are within 20 percentage points. Prices are separate contracts, not a forecast produced by this site.',
			sources: [
				{ label: 'Current governors and party affiliations — National Governors Association', href: 'https://www.nga.org/governors/' },
				{ label: 'Official state election offices — USAGov', href: 'https://www.usa.gov/state-election-office' },
				{ label: '2026 primary and general election calendar — Federal Voting Assistance Program', href: 'https://www.fvap.gov/uploads/FVAP/VAO/PrimaryElectionsCalendar.pdf' },
				{ label: 'Governor elections — National Governors Association', href: 'https://www.nga.org/governors/elections/' },
				{ label: 'Live market source — Polymarket', href: 'https://polymarket.com' }
			]
		}
	} satisfies Record<ElectionKind, { method: string; sources: { label: string; href: string }[] }>;

	$: notes = sourceNotes[kind];
</script>

<section class="mt-8 rounded-md border border-neutral-200 bg-white p-4 shadow-sm" aria-labelledby="source-method-title">
	<h2 id="source-method-title" class="text-sm font-black uppercase tracking-wide text-[#061a55]">
		Sources and methodology
	</h2>
	<p class="mt-3 text-sm leading-relaxed text-neutral-700">{notes.method}</p>
	<p class="mt-2 text-xs leading-relaxed text-neutral-500">
		Source references reviewed
		<time datetime="2026-09-26">September 26, 2026</time>. Live market panels show their own read time;
		check state election offices for certified candidate lists and results.
	</p>
	<ul class="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
		{#each notes.sources as source}
			<li>
				<a class="font-semibold text-[#244999] underline hover:text-[#001666]" href={source.href} target="_blank" rel="noreferrer">
					{source.label}
				</a>
			</li>
		{/each}
	</ul>
</section>
