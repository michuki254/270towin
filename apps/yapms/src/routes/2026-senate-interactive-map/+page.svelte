<script lang="ts">
	/* The race roster on this page is researched and stays. The numbers around it
	 * were invented and go.
	 *
	 * What was fabricated: a "Prediction Market Forecast" card reading 56.4% GOP,
	 * a "Market Signal" panel of 56.4/40.1/3.5 badged "Live-style model", a
	 * 48/1/51 seat "projection", a "Consensus Forecast" of 52 R - 48 D credited
	 * to no one, and a per-race "Prediction market" percentage for eleven of the
	 * seventeen candidates. Polymarket carries no per-state 2026 Senate markets —
	 * re-checked, and the only state-level Senate market is a Florida nominee
	 * question — so that column had no possible source and is gone. Six rows had
	 * already been left blank for exactly that reason, which is what made the
	 * other eleven obvious.
	 *
	 * Two of the invented figures disagreed with each other: the card said the
	 * Republicans would hold 52 seats while the strip below it said 51.
	 *
	 * The real Senate-control market was already loaded and rendered further down
	 * the same page, so the fake panel sat a few hundred pixels from live prices
	 * that contradicted it.
	 *
	 * Since/Term is replaced by incumbency. It read as service in the seat being
	 * contested but often described something else entirely — Ashley Hinson's
	 * "2021, term 3" is her House service, and four challengers were given a
	 * "since 2027", a year that has not happened. Whether a seat is open is now
	 * derived: if neither candidate in a state holds the seat, it is an open
	 * seat, which is a fact about the data rather than a label to maintain.
	 *
	 * The interactive map now starts with the current party holding each seat
	 * on the 2026 ballot, including Florida and Ohio special elections.
	 */
	import ElectionPageShell from '$lib/components/electionpage/ElectionPageShell.svelte';
	import ChamberOdds from '$lib/components/marketodds/ChamberOdds.svelte';
	import ElectionDataNotes from '$lib/components/electiondata/ElectionDataNotes.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const mapEmbedUrl = '/app/usa/senate/2026/blank?embed=1&current-senate=1';
	const mapFullUrl = '/app/usa/senate/2026/blank?current-senate=1';

	type Party = 'Democratic' | 'Republican' | 'Independent';
	type Rating = 'Safe' | 'Likely' | 'Lean' | 'Tilt' | 'Toss-Up';
	type SenateRace = {
		state: string;
		candidate: string;
		party: Party;
		/** Year they took THIS seat. Absent means they do not hold it. */
		incumbentSince?: number;
		/** Office they currently hold, for candidates who are not the incumbent. */
		currently?: string;
		rating: Rating;
		photo: string;
		initials: string;
	};
	type SenateTrackerRace = {
		state: string;
		abbr: string;
		incumbent: string;
		party: 'Democratic' | 'Republican';
		electionType: 'Regular Class II' | 'Special';
		primaryDate: string;
		runoffDate?: string;
		electionOffice: string;
	};

	const partyStyles: Record<Party, { color: string; bg: string; logo: string }> = {
		Democratic: { color: '#2E5AAC', bg: 'bg-[#eaf0fb]', logo: '/party-logos/democrats.png' },
		Republican: { color: '#D83A45', bg: 'bg-[#fdebed]', logo: '/party-logos/republicans.png' },
		Independent: { color: '#7a6e43', bg: 'bg-[#f3f0e4]', logo: '/party-logos/independents.png' }
	};

	const ratingStyles: Record<Rating, string> = {
		Safe: 'bg-[#e8eef8] text-[#244999] border-[#b6c7e8]',
		Likely: 'bg-[#eef3fb] text-[#2E5AAC] border-[#c9d6ef]',
		Lean: 'bg-[#f6f2e3] text-[#7a6e43] border-[#d9d0ab]',
		Tilt: 'bg-[#fff3d8] text-[#8a6500] border-[#ead394]',
		'Toss-Up': 'bg-[#f0ead8] text-[#655c3f] border-[#C8BE9A]'
	};

	/* 2026 map: 33 regular Class 2 seats plus special elections in Florida
	   (Rubio's seat) and Ohio (Vance's), so 35 in all. Republicans defend 22 of
	   them and the Democrats 13. */
	const SEATS_UP = 35;
	const GOP_DEFENDING = 22;
	const DEM_DEFENDING = 13;

	const races: SenateRace[] = [
		{
			state: 'GA',
			candidate: 'Jon Ossoff',
			party: 'Democratic',
			incumbentSince: 2021,
			// Sabato moved GA to Likely Democratic on 30 Jul 2026.
			rating: 'Likely',
			photo: '/candidate-headshots/senate/jon-ossoff.jpg',
			initials: 'JO'
		},
		{
			state: 'GA',
			candidate: 'Mike Collins',
			party: 'Republican',
			currently: 'U.S. Representative',
			rating: 'Likely',
			photo: '/candidate-headshots/senate/mike-collins.jpg',
			initials: 'MC'
		},
		{
			state: 'ME',
			candidate: 'Susan Collins',
			party: 'Republican',
			incumbentSince: 1997,
			rating: 'Toss-Up',
			photo: '/candidate-headshots/senate/susan-collins.jpg',
			initials: 'SC'
		},
		{
			state: 'NC',
			candidate: 'Roy Cooper',
			party: 'Democratic',
			currently: 'Former governor',
			rating: 'Lean',
			photo: '/candidate-headshots/senate/roy-cooper.jpg',
			initials: 'RC'
		},
		{
			state: 'NC',
			candidate: 'Michael Whatley',
			party: 'Republican',
			currently: 'Former RNC chair',
			rating: 'Lean',
			photo: '/candidate-headshots/senate/michael-whatley.jpg',
			initials: 'MW'
		},
		{
			state: 'IA',
			candidate: 'Ashley Hinson',
			party: 'Republican',
			currently: 'U.S. Representative',
			rating: 'Toss-Up',
			photo: '/candidate-headshots/senate/ashley-hinson.jpg',
			initials: 'AH'
		},
		{
			state: 'IA',
			candidate: 'Josh Turek',
			party: 'Democratic',
			currently: 'State representative',
			rating: 'Toss-Up',
			photo: '/candidate-headshots/senate/josh-turek.jpg',
			initials: 'JT'
		},
		{
			// Democratic nominee from the 4 Aug 2026 primary: El-Sayed beat Haley
			// Stevens. Photo left empty deliberately — the table falls back to
			// party-coloured initials rather than a broken image.
			state: 'MI',
			candidate: 'Abdul El-Sayed',
			party: 'Democratic',
			currently: 'Former Detroit health director',
			rating: 'Toss-Up',
			photo: '',
			initials: 'AE'
		},
		{
			state: 'MI',
			candidate: 'Mike Rogers',
			party: 'Republican',
			currently: 'Former U.S. Representative',
			rating: 'Toss-Up',
			photo: '/candidate-headshots/senate/mike-rogers.jpg',
			initials: 'MR'
		},
		{
			state: 'NH',
			candidate: 'Chris Pappas',
			party: 'Democratic',
			currently: 'U.S. Representative',
			rating: 'Lean',
			photo: '/candidate-headshots/senate/chris-pappas.jpg',
			initials: 'CP'
		},
		{
			state: 'NH',
			candidate: 'John E. Sununu',
			party: 'Republican',
			currently: 'Former U.S. Senator',
			rating: 'Lean',
			photo: '/candidate-headshots/senate/john-sununu.jpg',
			initials: 'JS'
		},
		// Ohio special: Husted was appointed to JD Vance's seat and must stand in
		// 2026 for the remainder of the term through 2028. Sherrod Brown won the
		// Democratic primary. Sabato rates it Toss-up.
		{
			state: 'OH',
			candidate: 'Jon Husted',
			party: 'Republican',
			incumbentSince: 2025,
			rating: 'Toss-Up',
			photo: '',
			initials: 'JH'
		},
		{
			state: 'OH',
			candidate: 'Sherrod Brown',
			party: 'Democratic',
			currently: 'Former U.S. Senator',
			rating: 'Toss-Up',
			photo: '',
			initials: 'SB'
		},
		// Alaska is a Toss-up: Peltola out-raised Sullivan more than three to one
		// in the most recent quarter.
		{
			state: 'AK',
			candidate: 'Dan Sullivan',
			party: 'Republican',
			incumbentSince: 2015,
			rating: 'Toss-Up',
			photo: '',
			initials: 'DS'
		},
		{
			state: 'AK',
			candidate: 'Mary Peltola',
			party: 'Democratic',
			currently: 'Former U.S. Representative',
			rating: 'Toss-Up',
			photo: '',
			initials: 'MP'
		},
		// Kansas: Sabato shifted Safe -> Likely Republican on 5 Aug 2026 after
		// Rev. Adam Hamilton won the Democratic primary, having out-raised
		// Marshall by $3.09m last quarter.
		{
			state: 'KS',
			candidate: 'Roger Marshall',
			party: 'Republican',
			incumbentSince: 2021,
			rating: 'Likely',
			photo: '',
			initials: 'RM'
		},
		{
			state: 'KS',
			candidate: 'Adam Hamilton',
			party: 'Democratic',
			currently: 'Pastor',
			rating: 'Likely',
			photo: '',
			initials: 'AH'
		}
	];

	/* Full 2026 ballot tracker: 33 regular Class II seats plus the Florida and
	   Ohio special elections. Primary dates follow FVAP's 2026 calendar; each
	   row links to the state's election office for official nominee/results updates. */
	const senateTracker: SenateTrackerRace[] = [
		{
			state: 'Alabama',
			abbr: 'AL',
			incumbent: 'Tommy Tuberville',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'May 19, 2026',
			runoffDate: 'June 16, 2026',
			electionOffice: 'https://www.sos.alabama.gov'
		},
		{
			state: 'Alaska',
			abbr: 'AK',
			incumbent: 'Dan Sullivan',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'August 18, 2026',
			electionOffice: 'https://www.elections.alaska.gov'
		},
		{
			state: 'Arkansas',
			abbr: 'AR',
			incumbent: 'Tom Cotton',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'March 3, 2026',
			runoffDate: 'March 31, 2026',
			electionOffice: 'https://www.sos.arkansas.gov'
		},
		{
			state: 'Colorado',
			abbr: 'CO',
			incumbent: 'John Hickenlooper',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'June 30, 2026',
			electionOffice: 'https://www.sos.state.co.us'
		},
		{
			state: 'Delaware',
			abbr: 'DE',
			incumbent: 'Chris Coons',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'September 15, 2026',
			electionOffice: 'https://elections.delaware.gov'
		},
		{
			state: 'Florida',
			abbr: 'FL',
			incumbent: 'Ashley Moody (appointed)',
			party: 'Republican',
			electionType: 'Special',
			primaryDate: 'August 18, 2026',
			electionOffice: 'https://www.dos.myflorida.com'
		},
		{
			state: 'Georgia',
			abbr: 'GA',
			incumbent: 'Jon Ossoff',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'May 19, 2026',
			runoffDate: 'June 16, 2026',
			electionOffice: 'https://sos.ga.gov'
		},
		{
			state: 'Idaho',
			abbr: 'ID',
			incumbent: 'Jim Risch',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'May 19, 2026',
			electionOffice: 'https://voteidaho.gov'
		},
		{
			state: 'Illinois',
			abbr: 'IL',
			incumbent: 'Dick Durbin',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'March 17, 2026',
			electionOffice: 'https://www.elections.il.gov'
		},
		{
			state: 'Iowa',
			abbr: 'IA',
			incumbent: 'Joni Ernst',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'June 2, 2026',
			electionOffice: 'https://sos.iowa.gov'
		},
		{
			state: 'Kansas',
			abbr: 'KS',
			incumbent: 'Roger Marshall',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'August 4, 2026',
			electionOffice: 'https://sos.ks.gov'
		},
		{
			state: 'Kentucky',
			abbr: 'KY',
			incumbent: 'Mitch McConnell',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'May 19, 2026',
			electionOffice: 'https://elect.ky.gov'
		},
		{
			state: 'Louisiana',
			abbr: 'LA',
			incumbent: 'Bill Cassidy',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'May 16, 2026',
			runoffDate: 'June 27, 2026',
			electionOffice: 'https://www.sos.la.gov'
		},
		{
			state: 'Maine',
			abbr: 'ME',
			incumbent: 'Susan Collins',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'June 9, 2026',
			electionOffice: 'https://www.maine.gov'
		},
		{
			state: 'Massachusetts',
			abbr: 'MA',
			incumbent: 'Ed Markey',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'September 1, 2026',
			electionOffice: 'https://www.sec.state.ma.us'
		},
		{
			state: 'Michigan',
			abbr: 'MI',
			incumbent: 'Gary Peters',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'August 4, 2026',
			electionOffice: 'https://www.michigan.gov'
		},
		{
			state: 'Minnesota',
			abbr: 'MN',
			incumbent: 'Tina Smith',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'August 11, 2026',
			electionOffice: 'https://www.sos.state.mn.us'
		},
		{
			state: 'Mississippi',
			abbr: 'MS',
			incumbent: 'Cindy Hyde-Smith',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'March 10, 2026',
			runoffDate: 'April 7, 2026',
			electionOffice: 'https://www.sos.ms.gov'
		},
		{
			state: 'Montana',
			abbr: 'MT',
			incumbent: 'Steve Daines',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'June 2, 2026',
			electionOffice: 'https://sosmt.gov'
		},
		{
			state: 'Nebraska',
			abbr: 'NE',
			incumbent: 'Pete Ricketts',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'May 12, 2026',
			electionOffice: 'https://www.nebraska.gov'
		},
		{
			state: 'New Hampshire',
			abbr: 'NH',
			incumbent: 'Jeanne Shaheen',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'September 8, 2026',
			electionOffice: 'https://www.sos.nh.gov'
		},
		{
			state: 'New Jersey',
			abbr: 'NJ',
			incumbent: 'Cory Booker',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'June 2, 2026',
			electionOffice: 'https://www.nj.gov'
		},
		{
			state: 'New Mexico',
			abbr: 'NM',
			incumbent: 'Ben Ray Luján',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'June 2, 2026',
			electionOffice: 'https://www.sos.nm.gov'
		},
		{
			state: 'North Carolina',
			abbr: 'NC',
			incumbent: 'Thom Tillis',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'March 3, 2026',
			runoffDate: 'May 12, 2026',
			electionOffice: 'https://www.ncsbe.gov'
		},
		{
			state: 'Ohio',
			abbr: 'OH',
			incumbent: 'Jon Husted (appointed)',
			party: 'Republican',
			electionType: 'Special',
			primaryDate: 'May 5, 2026',
			electionOffice: 'https://www.sos.state.oh.us'
		},
		{
			state: 'Oklahoma',
			abbr: 'OK',
			incumbent: 'Alan Armstrong (appointed)',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'June 16, 2026',
			runoffDate: 'August 25, 2026',
			electionOffice: 'https://oklahoma.gov'
		},
		{
			state: 'Oregon',
			abbr: 'OR',
			incumbent: 'Jeff Merkley',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'May 19, 2026',
			electionOffice: 'https://sos.oregon.gov'
		},
		{
			state: 'Rhode Island',
			abbr: 'RI',
			incumbent: 'Jack Reed',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'September 9, 2026',
			electionOffice: 'https://vote.sos.ri.gov'
		},
		{
			state: 'South Carolina',
			abbr: 'SC',
			incumbent: 'Darline Graham',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'June 9, 2026',
			runoffDate: 'June 23, 2026',
			electionOffice: 'https://www.scvotes.org'
		},
		{
			state: 'South Dakota',
			abbr: 'SD',
			incumbent: 'Mike Rounds',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'June 2, 2026',
			electionOffice: 'https://sdsos.gov'
		},
		{
			state: 'Tennessee',
			abbr: 'TN',
			incumbent: 'Bill Hagerty',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'August 6, 2026',
			electionOffice: 'https://sos.tn.gov'
		},
		{
			state: 'Texas',
			abbr: 'TX',
			incumbent: 'John Cornyn',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'March 3, 2026',
			runoffDate: 'May 26, 2026',
			electionOffice: 'https://www.sos.state.tx.us'
		},
		{
			state: 'Virginia',
			abbr: 'VA',
			incumbent: 'Mark Warner',
			party: 'Democratic',
			electionType: 'Regular Class II',
			primaryDate: 'August 4, 2026',
			electionOffice: 'https://www.elections.virginia.gov'
		},
		{
			state: 'West Virginia',
			abbr: 'WV',
			incumbent: 'Shelley Moore Capito',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'May 12, 2026',
			electionOffice: 'https://sos.wv.gov'
		},
		{
			state: 'Wyoming',
			abbr: 'WY',
			incumbent: 'Cynthia Lummis',
			party: 'Republican',
			electionType: 'Regular Class II',
			primaryDate: 'August 18, 2026',
			electionOffice: 'https://sos.wyo.gov'
		}
	];

	const trackerFilters = ['All races', 'Regular Class II', 'Special'] as const;
	let trackerFilter = $state<(typeof trackerFilters)[number]>('All races');
	let trackerSearch = $state('');
	const filteredTracker = $derived(
		senateTracker.filter((seat) => {
			const matchesType = trackerFilter === 'All races' || seat.electionType === trackerFilter;
			const query = trackerSearch.trim().toLowerCase();
			const matchesSearch =
				!query ||
				`${seat.state} ${seat.abbr} ${seat.incumbent} ${seat.party}`.toLowerCase().includes(query);
			return matchesType && matchesSearch;
		})
	);

	/** A seat is open when neither of its candidates currently holds it. */
	const openStates = $derived(
		new Set(
			[...new Set(races.map((r) => r.state))].filter(
				(s) => !races.some((r) => r.state === s && r.incumbentSince !== undefined)
			)
		)
	);

	const ratingFilters = ['All', 'Safe', 'Likely', 'Lean', 'Tilt', 'Toss-Up'] as const;
	let selectedRating = $state<(typeof ratingFilters)[number]>('All');
	const shownRaces = $derived(
		selectedRating === 'All' ? races : races.filter((r) => r.rating === selectedRating)
	);

	const faqs = [
		{
			q: 'How many seats are needed to control the Senate?',
			a: '51 of 100. A 50-50 Senate is controlled by the party of the Vice President, who breaks tied votes.'
		},
		{
			q: 'How many Senate seats are up in 2026?',
			a: `${SEATS_UP}: the ${SEATS_UP - 2} regular Class 2 seats last contested in 2020, plus special elections in Florida and Ohio for the seats Marco Rubio and JD Vance left to join the administration. Republicans are defending ${GOP_DEFENDING} of the ${SEATS_UP} and the Democrats ${DEM_DEFENDING}, which is why the Republicans have more ways to lose ground than to gain it.`
		},
		{
			q: 'Where can I find official nominee lists for 2026 Senate races?',
			a: `The tracker below lists all ${senateTracker.length} seats, current officeholders, primary dates and official state election offices. Follow each state link for certified nominees, results and candidate changes.`
		},
		{
			q: 'What do the ratings mean, and who makes them?',
			a: 'They describe how safe a seat looks, from Safe through Likely, Lean and Tilt to Toss-Up, and they follow Sabato’s Crystal Ball rather than being produced here. They are a judgement about a race, not a probability, which is why no percentage is attached to them.'
		},
		{
			q: 'Why is there no market percentage for each race?',
			a: 'Because none exists to quote. Polymarket runs a market on which party controls the Senate, shown above, but no markets on the individual 2026 Senate races. Rather than fill the gap with a number of our own, the page leaves it out.'
		},
		{
			q: 'Can I build my own Senate map?',
			a: 'Yes. Open the full interactive map, assign each seat, and use the Share button for a link or embed code.'
		}
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};
</script>

<svelte:head>
	<title>2026 Senate Elections | All 35 Races, Map &amp; Ratings</title>
	<meta
		name="description"
		content="Explore all 35 Senate seats on the 2026 ballot, including incumbents, primary dates, official state election links, selected race ratings, and control odds."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2026 Senate Elections | All 35 Races and Map" />
	<meta
		property="og:description"
		content="Review all 35 2026 Senate contests, current incumbents, primary dates, official state election links, and control odds."
	/>
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
</svelte:head>

<ElectionPageShell
	active="Senate"
	eyebrow="2026 Midterms · U.S. Senate"
	title="2026 Senate Elections"
	tagline="35 seats. A narrow road to 51."
	intro="Thirty-five seats are on the ballot, including two special elections. Republicans defend 22; use the map to explore how each contest could shape control of the Senate."
	baseline="Current party holding each contested seat, including Florida and Ohio; independents are grouped with the Democratic caucus in the total."
>
	<section class="mt-5">
		<div class="mb-3">
			<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
				Build a Senate scenario
			</h2>
			<p class="text-xs text-neutral-500">
				Starts with the current party holding each seat on the 2026 ballot, including the Florida
				and Ohio special elections. The map groups the two independents with the Democratic caucus
				in its total. Change any seat to explore a scenario; this is an incumbent baseline, not a
				forecast.
			</p>
		</div>
		<div class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
			<iframe
				src={mapEmbedUrl}
				title="2026 U.S. Senate Interactive Election Map"
				class="block w-full"
				style="height: 610px; border: 0;"
			></iframe>
		</div>
		<div class="mt-3 flex flex-wrap gap-2 text-sm">
			<a
				href={mapFullUrl}
				class="rounded bg-[#D83A45] px-4 py-2 font-bold text-white hover:bg-[#b92f39]"
			>
				Open Full Interactive Map
			</a>
		</div>
	</section>

	<section class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="Key numbers">
		<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
			<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#D83A45"></div>
			<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">Senate now</div>
			<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">
				53 R &middot; 45 D &middot; 2 I
			</div>
			<div class="mt-1 text-xs leading-relaxed text-neutral-500">
				Both independents caucus with the Democrats
			</div>
		</div>
		<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
			<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#061a55"></div>
			<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">For control</div>
			<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">51</div>
			<div class="mt-1 text-xs leading-relaxed text-neutral-500">
				At 50-50 the Vice President breaks ties
			</div>
		</div>
		<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
			<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#7a6e43"></div>
			<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">Seats up</div>
			<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">{SEATS_UP}</div>
			<div class="mt-1 text-xs leading-relaxed text-neutral-500">
				{SEATS_UP - 2} Class 2 seats, plus Florida and Ohio specials
			</div>
		</div>
		<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
			<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#D83A45"></div>
			<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
				Republicans defending
			</div>
			<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">
				{GOP_DEFENDING} of {SEATS_UP}
			</div>
			<div class="mt-1 text-xs leading-relaxed text-neutral-500">
				The Democrats defend the other {DEM_DEFENDING}
			</div>
		</div>
	</section>

	<div class="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
		<section class="rounded-md border border-neutral-200 bg-white shadow-sm">
			<div
				class="flex flex-col gap-3 border-b border-neutral-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
			>
				<div>
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
						Selected competitive 2026 races
					</h2>
					<p class="text-xs text-neutral-500">
						A selected set of contests; ratings follow Sabato&rsquo;s Crystal Ball. Safe seats are
						left out.
					</p>
				</div>
				<div class="flex flex-wrap gap-2">
					{#each ratingFilters as r}
						<button
							type="button"
							onclick={() => (selectedRating = r)}
							class={`rounded border px-3 py-1.5 text-xs font-black ${
								selectedRating === r
									? 'border-[#061a55] bg-[#061a55] text-white'
									: 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
							}`}
						>
							{r}
						</button>
					{/each}
				</div>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full min-w-[720px] border-collapse text-sm">
					<thead
						class="bg-[#f7f8fb] text-left text-[11px] uppercase tracking-wide text-neutral-500"
					>
						<tr class="border-b border-neutral-200">
							<th class="px-4 py-3" scope="col">Seat</th>
							<th class="px-4 py-3" scope="col">Candidate</th>
							<th class="px-4 py-3" scope="col">Party</th>
							<th class="px-4 py-3" scope="col">Standing</th>
							<th class="px-4 py-3" scope="col">Rating</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-100">
						{#each shownRaces as race (race.state + race.candidate)}
							<tr class="hover:bg-[#f9fafc]">
								<td class="px-4 py-3">
									<span
										class="inline-flex h-8 w-10 items-center justify-center rounded bg-[#eef1f5] font-black text-[#061a55]"
									>
										{race.state}
									</span>
									{#if openStates.has(race.state)}
										<span class="mt-1 block text-[10px] font-bold uppercase text-neutral-400">
											Open
										</span>
									{/if}
								</td>
								<td class="px-4 py-3">
									<div class="flex items-center gap-3">
										{#if race.photo}
											<img
												src={race.photo}
												alt=""
												class="h-10 w-10 shrink-0 rounded-full border border-neutral-200 object-cover object-top"
												loading="lazy"
											/>
										{:else}
											<div
												class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-xs font-black text-white"
												style={`background:${partyStyles[race.party].color}`}
												aria-hidden="true"
											>
												{race.initials}
											</div>
										{/if}
										<span class="font-bold text-neutral-900">{race.candidate}</span>
									</div>
								</td>
								<td class="px-4 py-3">
									<span
										class={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-black ${partyStyles[race.party].bg}`}
										style={`color:${partyStyles[race.party].color}`}
									>
										<img
											src={partyStyles[race.party].logo}
											alt=""
											class="h-5 w-5 rounded-full object-contain"
											loading="lazy"
										/>
										{race.party}
									</span>
								</td>
								<td class="px-4 py-3 text-xs text-neutral-600">
									{#if race.incumbentSince}
										<span class="font-bold text-neutral-800">Incumbent</span>
										<span class="block text-neutral-500"
											>holds the seat since {race.incumbentSince}</span
										>
									{:else}
										<span class="font-bold text-neutral-800">Challenger</span>
										{#if race.currently}
											<span class="block text-neutral-500">{race.currently}</span>
										{/if}
									{/if}
								</td>
								<td class="px-4 py-3">
									<span
										class={`inline-flex rounded border px-2.5 py-1 text-xs font-black ${ratingStyles[race.rating]}`}
									>
										{race.rating}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div
				class="grid grid-cols-5 gap-px border-t border-neutral-200 bg-neutral-200 text-center text-[11px] font-bold uppercase"
			>
				<div class="bg-[#e8eef8] px-2 py-2 text-[#244999]">Safe</div>
				<div class="bg-[#eef3fb] px-2 py-2 text-[#2E5AAC]">Likely</div>
				<div class="bg-[#f6f2e3] px-2 py-2 text-[#7a6e43]">Lean</div>
				<div class="bg-[#fff3d8] px-2 py-2 text-[#8a6500]">Tilt</div>
				<div class="bg-[#f0ead8] px-2 py-2 text-[#655c3f]">Toss-Up</div>
			</div>
			<p class="px-4 py-3 text-xs leading-relaxed text-neutral-500">
				A seat marked <strong>Open</strong> is one where neither candidate currently holds it. Ratings
				are a judgement about how safe a seat looks, not a probability, so no percentage is attached to
				them.
			</p>
		</section>

		<div class="flex flex-col gap-5">
			<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
					Why the map is lopsided
				</h2>
				<p class="mt-3 text-sm leading-relaxed text-neutral-600">
					The Republicans hold {GOP_DEFENDING} of the {SEATS_UP} seats being contested against the Democrats&rsquo;
					{DEM_DEFENDING}, so almost every competitive race is one they are defending rather than
					attacking. Holding all {GOP_DEFENDING} keeps the Senate at 53&ndash;47; losing three of them
					takes it to 50&ndash;50, where the Vice President still decides.
				</p>
			</section>
		</div>
	</div>

	<section
		class="mt-8 rounded-md border border-neutral-200 bg-white shadow-sm"
		aria-labelledby="senate-race-tracker-title"
	>
		<div
			class="flex flex-col gap-4 border-b border-neutral-200 px-4 py-4 lg:flex-row lg:items-end lg:justify-between"
		>
			<div>
				<h2 id="senate-race-tracker-title" class="text-lg font-black text-[#061a55]">
					All {senateTracker.length} Senate seats on the 2026 ballot
				</h2>
				<p class="mt-2 max-w-4xl text-sm leading-relaxed text-neutral-600">
					The tracker covers 33 regular Class II seats and special elections in Florida and Ohio.
					Primary dates follow the Federal Voting Assistance Program&rsquo;s 2026 calendar; all
					listed primaries and runoffs have passed as of September 26, 2026. The general election is
					November 3, 2026. The state links are the official source for certified nominees,
					candidate withdrawals and results.
				</p>
				<p class="mt-2 text-xs text-neutral-500">
					The seat list follows the U.S. Senate&rsquo;s 2026 election roster and Class II list.
					Primary dates can change; confirm current ballot information with the state election
					office.
				</p>
				<div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
					<a
						href="https://www.dailypress.senate.gov/on-the-floor/senate-facts/"
						target="_blank"
						rel="noreferrer"
						class="font-semibold text-[#244999] underline hover:text-[#001666]"
					>
						Senators up for election in 2026 — U.S. Senate Daily Press
					</a>
					<a
						href="https://www.senate.gov/senators/Class_II.htm"
						target="_blank"
						rel="noreferrer"
						class="font-semibold text-[#244999] underline hover:text-[#001666]"
					>
						Regular Class II seats — U.S. Senate
					</a>
				</div>
			</div>
			<div class="flex flex-col gap-2 sm:flex-row">
				<label class="sr-only" for="senate-tracker-search">Search Senate races</label>
				<input
					id="senate-tracker-search"
					type="search"
					bind:value={trackerSearch}
					placeholder="Search state or senator"
					class="rounded border border-neutral-300 px-3 py-2 text-sm"
				/>
				<label class="sr-only" for="senate-tracker-type">Filter Senate races by type</label>
				<select
					id="senate-tracker-type"
					bind:value={trackerFilter}
					class="rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
				>
					{#each trackerFilters as filter}
						<option value={filter}>{filter}</option>
					{/each}
				</select>
			</div>
		</div>

		<div
			class="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-neutral-500"
		>
			<span>Showing {filteredTracker.length} of {senateTracker.length} contests</span>
			<a
				href="https://www.fvap.gov/uploads/FVAP/VAO/PrimaryElectionsCalendar.pdf"
				target="_blank"
				rel="noreferrer"
				class="font-semibold text-[#244999] underline hover:text-[#001666]"
			>
				FVAP 2026 primary calendar
			</a>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full min-w-[1000px] border-collapse text-sm">
				<thead class="bg-[#f7f8fb] text-left text-[11px] uppercase tracking-wide text-neutral-500">
					<tr class="border-y border-neutral-200">
						<th class="px-4 py-3" scope="col">State</th>
						<th class="px-4 py-3" scope="col">Current incumbent</th>
						<th class="px-4 py-3" scope="col">Party</th>
						<th class="px-4 py-3" scope="col">Seat type</th>
						<th class="px-4 py-3" scope="col">Primary / runoff date</th>
						<th class="px-4 py-3" scope="col">Primary status</th>
						<th class="px-4 py-3" scope="col">Official state source</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-neutral-100">
					{#each filteredTracker as seat (seat.abbr)}
						<tr class="hover:bg-[#f9fafc]">
							<th class="px-4 py-3 text-left" scope="row">
								<span class="font-black text-[#061a55]">{seat.state}</span>
								<span class="ml-1 text-xs text-neutral-500">({seat.abbr})</span>
							</th>
							<td class="px-4 py-3 font-semibold text-neutral-800">{seat.incumbent}</td>
							<td class="px-4 py-3">
								<span
									class={`rounded-full px-2.5 py-1 text-xs font-black ${partyStyles[seat.party].bg}`}
									style={`color:${partyStyles[seat.party].color}`}
								>
									{seat.party}
								</span>
							</td>
							<td class="px-4 py-3 text-xs text-neutral-700">{seat.electionType}</td>
							<td class="px-4 py-3 text-xs text-neutral-700">
								{seat.primaryDate}
								{#if seat.runoffDate}
									<span class="block text-neutral-500">Runoff: {seat.runoffDate}</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								<span
									class="rounded-full bg-[#eaf0fb] px-2.5 py-1 text-xs font-bold text-[#244999]"
								>
									Held
								</span>
							</td>
							<td class="px-4 py-3">
								<a
									href={seat.electionOffice}
									target="_blank"
									rel="noreferrer"
									aria-label={`Official ${seat.state} election information`}
									class="text-xs font-semibold text-[#244999] underline hover:text-[#001666]"
								>
									State election office
								</a>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7" class="px-4 py-8 text-center text-sm text-neutral-500">
								No races match this search.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
		<section class="lg:col-span-2">
			<h2 class="mb-3 text-sm font-black uppercase tracking-wide text-[#061a55]">
				Frequently Asked Questions
			</h2>
			<div class="grid gap-2">
				{#each faqs as f}
					<details class="rounded-md border border-neutral-200 bg-white p-3 shadow-sm">
						<summary class="cursor-pointer font-bold text-[#2E5AAC]">{f.q}</summary>
						<p class="mt-2 text-sm leading-relaxed text-neutral-700">{f.a}</p>
					</details>
				{/each}
			</div>
		</section>

		<aside class="flex flex-col gap-4">
			<div
				class="rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-700 shadow-sm"
			>
				<h2 class="mb-1 text-base font-black text-[#061a55]">Key Facts</h2>
				<ul class="flex list-inside list-disc flex-col gap-1">
					<li><strong>100</strong> seats, <strong>51</strong> for control</li>
					<li><strong>{SEATS_UP}</strong> on the ballot in 2026</li>
					<li><strong>50-50</strong> broken by the Vice President</li>
					<li>Election Day: <strong>November 3, 2026</strong></li>
				</ul>
				<div class="mt-3 flex flex-col gap-1">
					<a class="text-sm font-semibold text-[#2E5AAC]" href="/2024-senate-election-results">
						2024 Senate results →
					</a>
					<a class="text-sm font-semibold text-[#2E5AAC]" href="/historical-senate-elections">
						Historical Senate elections →
					</a>
				</div>
			</div>
		</aside>
	</div>

	<ElectionDataNotes kind="senate" />
	<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500">
		Race ratings follow Sabato&rsquo;s Crystal Ball and are editorial judgements, not probabilities.
		The control percentages are live Polymarket prices carrying the time they were read. Neither is
		a forecast produced by this site.
	</footer>
	{#snippet sidebar()}
		<ChamberOdds
			panel={data.senate}
			title="Senate control market"
			question="Which party will win the Senate in 2026?"
		/>
		<section class="border-t-[3px] border-[#294f83] pt-4">
			<p class="text-[10px] font-bold uppercase tracking-[1px] text-[#a72932]">
				The Senate at a glance
			</p>
			<h2 class="text-2xl font-bold text-[#262626]">51 seats to control</h2>
			<p class="mt-2 text-sm leading-relaxed text-neutral-600">
				Republicans defend {GOP_DEFENDING} of the {SEATS_UP} seats on the ballot. At 50–50, the Vice President
				breaks ties.
			</p>
		</section>
	{/snippet}
</ElectionPageShell>
