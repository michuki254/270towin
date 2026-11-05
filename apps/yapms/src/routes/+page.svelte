<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';
	import senateResults from '$lib/data/senate2026Results.json';
	const resultsChecked =
		new Date(senateResults.checkedAt).toLocaleString('en-US', {
			timeZone: 'UTC',
			dateStyle: 'medium',
			timeStyle: 'short'
		}) + ' UTC';
	const uncalledStates = senateResults.races
		.filter((race) => race.party === null)
		.map((race) => race.state)
		.join(' and ');

	let { data }: { data: PageData } = $props();
	const resultsUrl = 'https://www.270towin.com/2026-election-results-live/';
	const resultLinks = [
		{
			label: 'U.S. Senate',
			detail: 'Senate control and race results',
			href: 'https://www.270towin.com/content/2026-senate-election-live-results/'
		},
		{
			label: 'U.S. House',
			detail: 'House control and district results',
			href: 'https://www.270towin.com/content/2026-house-election-live-results/'
		},
		{
			label: 'Governors',
			detail: 'Results from the states',
			href: 'https://www.270towin.com/content/2026-governor-election-live-results/'
		}
	];
	const predictionMarkets = $derived(data?.presidential?.odds ?? []);
	const marketsAsOf = $derived(
		data?.presidential?.ok
			? new Date(data.presidential.fetchedAt).toLocaleString('en-US', {
					dateStyle: 'medium',
					timeStyle: 'short',
					timeZone: 'UTC'
				}) + ' UTC'
			: null
	);
	const coverage = [
		{
			tag: '2026 MIDTERM RESULTS',
			title: 'Follow the results of the November 3 election',
			description:
				'Visit 270toWin for reported winners, outstanding races, and results by state for the Senate, House, and governors.',
			href: resultsUrl,
			image: '',
			external: true
		},
		{
			tag: 'THE NEXT PRESIDENTIAL ELECTION',
			title: 'Look ahead to the road to 270 in 2028',
			description:
				'Start with the certified 2024 Electoral College map, change state ratings, and explore your own path to the White House.',
			href: '/2028-presidential-election-interactive-map',
			image: '/path-to-win-logo.svg',
			external: false
		},
		{
			tag: 'RESULTS & HISTORY',
			title: 'Every election has a different path to victory',
			description:
				'Explore historical presidential results and compare how the Electoral College map has changed across election cycles.',
			href: '/historical-presidential-elections',
			image: '',
			external: false
		}
	];
</script>

<svelte:head>
	<title>2026 Senate Election Results &amp; Interactive Map | Path to Win</title>
	<meta
		name="description"
		content="View reported 2026 Senate election results by state, called winners, uncalled races, and the balance of the next Senate. Customize a separate map scenario."
	/>
	<meta
		property="og:title"
		content="2026 Senate Election Results & Interactive Map | Path to Win"
	/>
	<meta
		property="og:description"
		content="2026 midterm election results, an interactive Senate map, and a look ahead to the 2028 presidential election."
	/>
</svelte:head>

<div class="home-page">
	<main class="page-grid">
		<div class="main-column">
			<nav class="results-banner" aria-label="2026 election results">
				<strong>2026 ELECTION RESULTS</strong>
				<a href="#senate-map">Results map <span aria-hidden="true">↓</span></a>
				<a href="#senate-races">Results by race <span aria-hidden="true">↓</span></a>
			</nav>
			<section aria-labelledby="home-title">
				<nav class="election-tabs" aria-label="Election maps">
					<strong>2026 Midterm Maps:</strong>
					<a class="active" href="#senate-map" aria-current="page">Senate</a>
					<a href="/2026-house-interactive-map">House</a>
					<a href="/2026-governor-interactive-map">Governor</a>
					<a href="#senate-races">Election Results</a>
					<a href="/2028-presidential-election-interactive-map">2028 Presidential Map</a>
				</nav>
				<h1 id="home-title">2026 Senate Election Results Map</h1>
				<p class="tagline">35 U.S. Senate seats contested in the 2026 midterms</p>
				<p class="archive-notice">
					<span>REPORTED RESULTS</span>
					{35 - senateResults.won.uncalled} of 35 races called. Snapshot checked {resultsChecked}.
				</p>
				<p class="intro">
					Reported calls put the next Senate at <strong
						>{senateResults.totals.D} Democratic-caucus seats</strong
					>
					and
					<strong>{senateResults.totals.R} Republican seats</strong>{#if senateResults.totals.I},
						plus <strong>{senateResults.totals.I} independent / other seats</strong>{/if}.
					{#if senateResults.won.uncalled}<strong>{uncalledStates}</strong> remain uncalled.{:else}All
						35 races have been called.{/if}
					The totals include the 65 seats not on the 2026 ballot.
				</p>
				<p class="baseline">
					Select a state to see its reported winner. Blue and red show called races; tan means
					uncalled, and gray means no election. Choose “Customize scenario” to make your own
					changes, or “Reset to results” to return to this snapshot.
				</p>
				<div id="senate-map" class="map-wrap">
					<div class="map-heading">
						<strong>2026 reported results</strong><span
							>2026 contested seats · 100-seat chamber</span
						>
					</div>
					<iframe
						src="/app/usa/senate/2026/results?embed=home"
						title="2026 Senate election results map with reported winners and uncalled races"
					></iframe>
				</div>
				<p class="map-note">
					Source: <a href={senateResults.referenceUrl} target="_blank" rel="noopener noreferrer"
						>Decision Desk HQ, as used by 270toWin</a
					>. This is a dated snapshot of reported calls, not certified final results. Democratic
					totals include two independent senators who caucus with the Democrats.
					<a href="/election-data-methodology">About our data</a>
				</p>
			</section>

			<section class="senate-balance" aria-labelledby="balance-title">
				<div class="section-heading">
					<h2 id="balance-title">The next Senate</h2>
					<a href="#senate-races">View all 35 races →</a>
				</div>
				<table>
					<thead
						><tr
							><th scope="col">Seat breakdown</th><th scope="col" class="democratic"
								>Democratic caucus</th
							><th scope="col" class="republican">Republicans</th><th scope="col">Uncalled</th><th
								scope="col">Total</th
							></tr
						></thead
					>
					<tbody>
						<tr
							><th scope="row">Reported composition</th><td class="democratic"
								>{senateResults.totals.D}</td
							><td class="republican">{senateResults.totals.R}</td><td
								>{senateResults.won.uncalled}</td
							><td>100</td></tr
						>
						<tr
							><th scope="row">2026 races</th><td class="democratic">{senateResults.won.D}</td><td
								class="republican">{senateResults.won.R}</td
							><td>{senateResults.won.uncalled}</td><td>35</td></tr
						>
						<tr
							><th scope="row">Not on the 2026 ballot</th><td class="democratic">34</td><td
								class="republican">31</td
							><td>0</td><td>65</td></tr
						>
					</tbody>
				</table>
			</section>

			<section id="senate-races" class="senate-balance" aria-labelledby="race-results-title">
				<div class="section-heading">
					<h2 id="race-results-title">2026 Senate results by state</h2>
				</div>
				<p class="map-note">
					Called winners and uncalled races as of {resultsChecked}. Florida and Ohio held special
					elections.
				</p>
				<table class="race-results">
					<thead
						><tr
							><th scope="col">State</th><th scope="col">Reported winner</th><th scope="col"
								>Status</th
							></tr
						></thead
					>
					<tbody
						>{#each senateResults.races as race}<tr>
								<th scope="row"
									><a href={race.url} target="_blank" rel="noopener noreferrer"
										>{race.state}{race.region.endsWith('-S') ? ' (special)' : ''} ↗</a
									></th
								>
								<td>{race.winner ?? '—'}</td>
								<td class:democratic={race.party === 'D'} class:republican={race.party === 'R'}
									>{race.party === 'D'
										? 'Democratic win'
										: race.party === 'R'
											? 'Republican win'
											: race.party === 'I'
												? 'Independent / other win'
												: 'Uncalled'}</td
								>
							</tr>{/each}</tbody
					>
				</table>
			</section>

			<section class="coverage" aria-labelledby="coverage-title">
				<div class="section-heading">
					<h2 id="coverage-title">Election coverage &amp; resources</h2>
					<a href="/news">Market updates →</a>
				</div>
				{#each coverage as story}
					<article class="story">
						<div>
							<span class="eyebrow">{story.tag}</span>
							<h3>
								<a
									href={story.href}
									target={story.external ? '_blank' : undefined}
									rel={story.external ? 'noopener noreferrer' : undefined}>{story.title}</a
								>
							</h3>
							<p>{story.description}</p>
							<a
								class="read-more"
								href={story.href}
								target={story.external ? '_blank' : undefined}
								rel={story.external ? 'noopener noreferrer' : undefined}
								>{story.external ? 'View on 270toWin' : 'Explore'}
								<span aria-hidden="true">{story.external ? '↗' : '→'}</span></a
							>
						</div>
						{#if story.image}<a
								href={story.href}
								class="story-image"
								tabindex="-1"
								aria-hidden="true"><img src={story.image} alt="" loading="lazy" /></a
							>{/if}
					</article>
				{/each}
			</section>
		</div>

		<aside class="sidebar" aria-label="Election markets and resources">
			<section class="results-panel" id="election-results" aria-labelledby="results-title">
				<span class="eyebrow">NOVEMBER 3, 2026</span>
				<h2 id="results-title">Midterm Election Results</h2>
				<p>Follow reported results and race calls on 270toWin.</p>
				{#each resultLinks as result}
					<a href={result.href} target="_blank" rel="noopener noreferrer"
						><span>{result.label}<small>{result.detail}</small></span><span aria-hidden="true"
							>↗</span
						></a
					>
				{/each}
				<a class="all-results" href={resultsUrl} target="_blank" rel="noopener noreferrer"
					>All results &amp; state map <span aria-hidden="true">↗</span></a
				>
				<p class="results-source">Results links open 270toWin in a new tab.</p>
			</section>
			<section class="market-panel">
				<h2>Prediction Markets</h2>
				<p class="market-question">
					Which party will win the<br /><strong>2028 Presidential Election?</strong>
				</p>
				{#if predictionMarkets.length}
					<div class="market-tiles">
						{#each predictionMarkets as market}
							<div class="market-tile" style:--party-color={market.color}>
								<span>{market.party}</span><strong>{market.pct}<small>%</small></strong>
							</div>
						{/each}
					</div>
				{:else}<p class="unavailable">Market prices are temporarily unavailable.</p>{/if}
				<div class="market-source">Market prices from <strong>Polymarket</strong></div>
				{#if marketsAsOf}<p class="market-caption">
						Read {marketsAsOf}. Latest “yes” trades from separate party markets; percentages may not
						total 100%.
					</p>{/if}
				<a class="sidebar-link" href="/2028-presidential-election">View election overview →</a>
			</section>

			<section class="side-section" id="state-maps">
				<h2>2026 Election Maps</h2>
				<a href="/2026-senate-interactive-map"
					><span>U.S. Senate<small>Reported results and map scenarios</small></span><span
						aria-hidden="true">→</span
					></a
				>
				<a href="/2026-house-interactive-map"
					><span>U.S. House<small>Explore congressional districts</small></span><span
						aria-hidden="true">→</span
					></a
				>
				<a href="/2026-governor-interactive-map"
					><span>Governors<small>Explore the 2026 governor contests</small></span><span
						aria-hidden="true">→</span
					></a
				>
			</section>

			<section class="road-panel">
				<span class="eyebrow">THE ELECTORAL COLLEGE</span>
				<h2>The road to <strong>270</strong></h2>
				<p>
					A majority of the 538 electoral votes decides the presidency. Use the map to see how
					individual states change the outcome.
				</p>
				<dl>
					<div>
						<dt>Electoral votes</dt>
						<dd>538</dd>
					</div>
					<div>
						<dt>Needed to win</dt>
						<dd>270</dd>
					</div>
					<div>
						<dt>An even split</dt>
						<dd>269–269</dd>
					</div>
				</dl>
				<a href="/2028-presidential-election">Explore the 2028 election →</a>
			</section>

			<section class="side-section archive">
				<h2>Past Election Results</h2>
				<a href="/2024-presidential-election-results"
					>2024 Presidential Results <span aria-hidden="true">→</span></a
				><a href="/historical-presidential-elections"
					>Presidential Election Archive <span aria-hidden="true">→</span></a
				><a href="/historical-governor-elections"
					>Governor Election Archive <span aria-hidden="true">→</span></a
				>
			</section>
		</aside>
	</main>
	<SiteFooter />
</div>

<style>
	:global(html:has(.home-page)),
	:global(body:has(.home-page)) {
		touch-action: pan-y;
	}
	.home-page {
		height: 100%;
		overflow-y: auto;
		background: white;
		color: #262626;
		font-family: Arial, Helvetica, sans-serif;
		scroll-behavior: smooth;
	}
	.page-grid {
		max-width: 1352px;
		margin: auto;
		padding: 38px 16px 68px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 288px;
		gap: 44px;
	}
	.main-column {
		min-width: 0;
	}
	a {
		color: #245493;
	}
	a:hover {
		text-decoration: underline;
	}
	a:focus-visible {
		outline: 3px solid #245493;
		outline-offset: 4px;
	}
	.results-banner {
		display: flex;
		min-height: 42px;
		background: #f0f1f3;
		border: 1px solid #e0e1e4;
		align-items: center;
		margin-bottom: 24px;
		font-size: 13px;
	}
	.results-banner > strong {
		align-self: stretch;
		display: flex;
		align-items: center;
		padding: 8px 20px 8px 12px;
		color: white;
		background: #b82732;
		clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.5px;
		white-space: nowrap;
	}
	.results-banner a {
		flex: 1;
		padding: 10px 12px;
		text-align: center;
		border-left: 1px solid #e0e1e4;
		font-weight: 700;
		color: #353535;
	}
	h1 {
		font-size: 32px;
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.7px;
		margin: 0;
	}
	.tagline {
		font-size: 18px;
		font-style: italic;
		color: #737373;
		margin: 8px 0 17px;
	}
	.election-tabs {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 5px;
		margin-bottom: 18px;
	}
	.election-tabs > strong {
		font-size: 13px;
		margin-right: 7px;
	}
	.election-tabs a {
		font-size: 12px;
		padding: 5px 12px;
		background: white;
		border: 1px solid #c6ced8;
		border-radius: 2px;
		font-weight: 700;
	}
	.election-tabs .active {
		background: #285b97;
		border-color: #285b97;
		color: white;
	}
	.archive-notice {
		font-size: 13px;
		line-height: 1.7;
		color: #646b74;
		margin: 0 0 20px;
	}
	.archive-notice > span {
		display: inline-block;
		padding: 3px 7px;
		margin-right: 7px;
		background: #f0f2f5;
		color: #5b6470;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.5px;
	}
	.intro {
		font-size: 16px;
		line-height: 1.6;
		margin: 0;
	}
	.baseline {
		margin: 10px 0 25px;
		font-size: 14px;
		color: #62666c;
		line-height: 1.5;
	}
	.map-note a {
		text-decoration: underline;
	}
	.map-wrap {
		scroll-margin-top: 16px;
	}
	.map-heading {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 6px 16px;
		padding: 12px 14px;
		margin-bottom: 18px;
		background: #f5f6f8;
		border-top: 2px solid #294f83;
		font-size: 13px;
	}
	.map-heading span {
		color: #676f79;
		font-size: 12px;
	}
	iframe {
		display: block;
		width: 100%;
		height: 650px;
		border: 0;
		background: white;
	}
	.map-note {
		font-size: 11px;
		color: #777;
		margin: 14px 0 0;
		line-height: 1.6;
	}
	.sidebar h2 {
		font-size: 21px;
		font-weight: 700;
		line-height: 1.3;
	}
	.market-panel {
		text-align: center;
		margin-top: 32px;
	}
	.results-panel {
		border-top: 3px solid #b82732;
		background: #f6f7f9;
		padding: 20px;
		scroll-margin-top: 20px;
	}
	.results-panel h2 {
		margin-top: 8px;
		font-size: 22px;
	}
	.results-panel > p {
		margin: 12px 0;
		font-size: 13px;
		line-height: 1.6;
		color: #62666c;
	}
	.results-panel > a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 14px 0;
		border-top: 1px solid #dde1e7;
		font-size: 15px;
		font-weight: 700;
	}
	.results-panel small {
		display: block;
		margin-top: 5px;
		font-size: 11px;
		font-weight: 400;
		color: #62666c;
		line-height: 1.5;
	}
	.results-panel > .all-results {
		font-size: 12px;
		padding-bottom: 0;
	}
	.results-panel > .results-source {
		font-size: 10px;
		margin-bottom: 0;
	}
	.senate-balance {
		margin-top: 34px;
		scroll-margin-top: 20px;
	}
	.race-results td {
		font-size: 13px;
		font-weight: 400;
		text-align: left;
	}
	.race-results th {
		text-align: left;
	}
	.senate-balance h2 {
		font-size: 21px;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}
	th,
	td {
		padding: 13px 10px;
		text-align: center;
		border-bottom: 1px solid #e3e5e8;
	}
	th:first-child {
		text-align: left;
		padding-left: 0;
	}
	thead {
		font-size: 11px;
	}
	tbody th {
		font-weight: 400;
	}
	td {
		font-weight: 700;
		font-size: 16px;
	}
	.democratic {
		color: #245493;
	}
	.republican {
		color: #b82732;
	}
	.market-question {
		font-size: 14px;
		line-height: 1.5;
		margin: 20px 0 18px;
	}
	.market-question strong {
		font-weight: 400;
	}
	.market-tiles {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	.market-tile {
		display: flex;
		flex-direction: column;
		border: 6px solid #ededed;
		padding: 10px 3px 13px;
		background: var(--party-color);
		color: white;
	}
	.market-tile > span {
		font-size: 13px;
	}
	.market-tile > strong {
		font-size: 42px;
		line-height: 1.25;
		font-weight: 700;
	}
	.market-tile small {
		font-size: 24px;
	}
	.market-source {
		font-size: 11px;
		margin-top: 13px;
		color: #777;
	}
	.market-source strong {
		display: block;
		font-size: 21px;
		letter-spacing: -0.7px;
		color: #2154ba;
		margin-top: 3px;
	}
	.market-caption {
		font-size: 10px;
		line-height: 1.5;
		color: #888;
		margin: 12px 3px;
	}
	.sidebar-link {
		display: inline-block;
		font-size: 12px;
		margin-top: 7px;
	}
	.unavailable {
		background: #f3f4f5;
		padding: 20px;
		font-size: 13px;
		color: #666;
	}
	.side-section {
		border-top: 3px solid #294f83;
		margin-top: 36px;
	}
	.side-section h2 {
		font-size: 18px;
		padding: 15px 0 5px;
	}
	.side-section > a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		padding: 13px 0;
		border-bottom: 1px solid #e5e5e5;
		font-size: 14px;
		font-weight: 700;
	}
	.side-section small {
		display: block;
		color: #777;
		font-size: 11px;
		font-weight: 400;
		margin-top: 4px;
	}
	.road-panel {
		margin-top: 32px;
		padding: 20px;
		background: #f5f6f8;
		border: 1px solid #e1e4e8;
	}
	.eyebrow {
		font-size: 10px;
		letter-spacing: 1px;
		font-weight: 700;
		color: #a72932;
	}
	.road-panel h2 {
		margin: 8px 0 12px;
		font-weight: 400;
		font-size: 23px;
	}
	.road-panel h2 strong {
		color: #264c83;
	}
	.road-panel p {
		font-size: 13px;
		color: #62666c;
		line-height: 1.6;
	}
	.road-panel dl {
		margin: 14px 0;
		font-size: 13px;
	}
	.road-panel dl div {
		display: flex;
		justify-content: space-between;
		padding: 9px 0;
		border-bottom: 1px solid #ddd;
	}
	.road-panel dd {
		font-weight: 700;
	}
	.road-panel > a {
		font-size: 12px;
	}
	.archive > a {
		font-size: 12px;
	}
	.coverage {
		margin-top: 38px;
	}
	.section-heading {
		border-bottom: 2px solid #34547e;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding-bottom: 12px;
	}
	.section-heading h2 {
		font-size: 23px;
		font-weight: 700;
	}
	.section-heading > a {
		font-size: 12px;
		white-space: nowrap;
	}
	.story {
		display: flex;
		gap: 24px;
		justify-content: space-between;
		border-bottom: 1px solid #ddd;
		padding: 25px 0;
	}
	.story h3 {
		font-size: 22px;
		line-height: 1.3;
		font-weight: 700;
		margin: 8px 0;
	}
	.story p {
		font-size: 14px;
		color: #626262;
		line-height: 1.65;
		max-width: 680px;
	}
	.read-more {
		display: inline-block;
		margin-top: 12px;
		font-size: 12px;
		font-weight: 700;
	}
	.story-image {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 170px;
		flex-shrink: 0;
		padding: 14px;
		background: #f5f6f8;
	}
	.story-image img {
		width: 100%;
	}
	@media (max-width: 1100px) {
		.page-grid {
			gap: 28px;
			grid-template-columns: minmax(0, 1fr) 250px;
			padding-top: 42px;
		}
		h1 {
			font-size: 29px;
		}
	}
	@media (max-width: 900px) {
		.page-grid {
			grid-template-columns: 1fr;
			padding-top: 28px;
		}
		.sidebar {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 28px;
			align-items: start;
		}
		.side-section,
		.road-panel {
			margin-top: 0;
		}
		iframe {
			height: 700px;
		}
	}
	@media (max-width: 600px) {
		.page-grid {
			padding: 20px 16px 40px;
			gap: 36px;
		}
		h1 {
			font-size: 27px;
			letter-spacing: -0.5px;
		}
		.tagline {
			font-size: 16px;
		}
		.results-banner {
			font-size: 11px;
			margin-bottom: 22px;
			flex-wrap: wrap;
		}
		.results-banner > strong {
			font-size: 12px;
			width: 100%;
			clip-path: none;
			justify-content: center;
		}
		.election-tabs > strong {
			width: 100%;
			margin-bottom: 4px;
		}
		.election-tabs a {
			padding: 7px 9px;
		}
		.senate-balance .section-heading {
			flex-wrap: wrap;
		}
		th,
		td {
			padding: 12px 5px;
		}
		table {
			font-size: 12px;
		}
		.intro {
			font-size: 14px;
		}
		.baseline {
			font-size: 13px;
			margin-bottom: 20px;
		}
		iframe {
			height: 900px;
		}
		.sidebar {
			grid-template-columns: 1fr;
		}
		.market-panel {
			max-width: 340px;
			width: 100%;
			margin: auto;
		}
		.section-heading {
			flex-wrap: wrap;
		}
		.section-heading h2 {
			font-size: 21px;
		}
		.story h3 {
			font-size: 20px;
		}
		.story-image {
			display: none;
		}
		.coverage {
			margin-top: 30px;
		}
	}
</style>
