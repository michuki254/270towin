<script lang="ts">
	import ElectionPageShell from '$lib/components/electionpage/ElectionPageShell.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	/* The certified 2024 result — the real starting point, and what the map
	   loads in "2024 Result" mode. */
	const TRUMP_2024 = 312;
	const HARRIS_2024 = 226;
	const TO_WIN = 270;
	/** What the losing side has to flip. 270 - 226 = 44. */
	const FLIP_NEEDED = TO_WIN - HARRIS_2024;

	const resultBlocks = [
		{ label: 'Trump (R)', value: TRUMP_2024, color: '#b60b03' },
		{ label: 'Harris (D)', value: HARRIS_2024, color: '#244999' }
	];

	/* All seven battlegrounds, with percentages from the certified 2024 returns.
	   Trump carried every one of them, Nevada for the first time since 2004. */
	const battlegrounds = [
		{
			state: 'Pennsylvania',
			ev: 19,
			margin: 1.71,
			note: 'The biggest prize of the seven, and the one the blue-wall route to 270 cannot do without.'
		},
		{
			state: 'Michigan',
			ev: 15,
			margin: 1.42,
			note: 'Second-narrowest state in the country in 2024.'
		},
		{
			state: 'Wisconsin',
			ev: 10,
			margin: 0.86,
			note: 'The closest state anywhere in 2024 — under a single point.'
		},
		{
			state: 'Georgia',
			ev: 16,
			margin: 2.19,
			note: 'Flipped back to the Republicans after going Democratic in 2020.'
		},
		{
			state: 'Arizona',
			ev: 11,
			margin: 5.53,
			note: 'The largest Republican margin among these seven states in 2024.'
		},
		{
			state: 'Nevada',
			ev: 6,
			margin: 3.1,
			note: 'Republican for the first time since 2004.'
		},
		{
			state: 'North Carolina',
			ev: 16,
			margin: 3.21,
			note: 'The only one of the seven no Democrat has carried since 2008.'
		}
	];

	const blueWall = ['Pennsylvania', 'Michigan', 'Wisconsin'];
	const blueWallEV = battlegrounds
		.filter((b) => blueWall.includes(b.state))
		.reduce((n, b) => n + b.ev, 0);

	const tools = [
		{ label: 'Full field & market odds', href: '/2028-presidential-election-interactive-map' },
		{ label: 'Forecasts', href: '/forecasts' },
		{ label: 'Polls', href: '/polls' },
		{ label: 'Prediction Markets', href: '/prediction-markets' },
		{ label: 'Tie Scenarios', href: '/electoral-college-tie' },
		{ label: 'Split Electoral Votes', href: '/maine-nebraska-split-electoral-votes' }
	];

	const partyColor = (party: 'Democratic' | 'Republican' | null) =>
		party === 'Democratic' ? '#244999' : party === 'Republican' ? '#b60b03' : '#655c3f';

	function readAt(iso: string): string {
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return 'unknown';
		const month = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		][d.getUTCMonth()];
		const hh = String(d.getUTCHours()).padStart(2, '0');
		const mm = String(d.getUTCMinutes()).padStart(2, '0');
		return `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}, ${hh}:${mm} UTC`;
	}
</script>

<svelte:head>
	<title>2028 Presidential Election | Battlegrounds &amp; Interactive Map | Path to Win</title>
	<meta
		name="description"
		content="The 2028 presidential race from the 2024 result: an interactive electoral college map, all seven battleground states with their certified 2024 margins, and live market odds on the field."
	/>
</svelte:head>

<ElectionPageShell
	active="President"
	eyebrow="The road to the White House"
	title="2028 Presidential Election"
	tagline="Explore the states. Compare the field. Build your path to 270."
	intro="Start from the certified 2024 result—312 Republican and 226 Democratic electoral votes—and explore a path to 270 by changing states."
	baseline="2024 certified result: 312 R–226 D."
	baselineHref="/2024-presidential-election-results"
	baselineLinkText="certified 2024 results"
>
	<section id="electoral-map" aria-labelledby="map-heading">
		<h2 id="map-heading" class="map-heading">Build your 2028 Electoral College map</h2>
		<p class="map-caption">
			Your map is a scenario. The starting colors show <a href="/2024-presidential-election-results"
				>2024 results</a
			>, not 2028 race ratings.
		</p>
		<iframe
			src="/app/usa/presidential/2028/2024map?embed=home"
			title="2028 Electoral College map with live vote totals and color palette"
		></iframe>
		<div class="map-footnote">
			<span>Use “Start blank” for an empty map, or “Reset to 2024” to restore the result.</span><a
				href="/app/usa/presidential/2028/2024map">Open full map editor ↗</a
			>
		</div>
	</section>

	<section id="battlegrounds" class="battleground-section" aria-labelledby="battleground-title">
		<div class="section-heading">
			<h2 id="battleground-title">The seven battlegrounds</h2>
			<span>2024 RESULTS</span>
		</div>
		<p class="section-intro">
			Trump carried all seven in 2024. These past margins provide a starting point for comparing
			scenarios; they do not predict the next election.
		</p>
		<div class="state-list">
			<div class="state-table-head" aria-hidden="true">
				<span>State</span><span>Electoral votes</span><span>2024 margin</span>
			</div>
			{#each battlegrounds as state}
				<article class="state-row">
					<div>
						<h3>{state.state}</h3>
						<p>{state.note}</p>
					</div>
					<span class="ev"><strong>{state.ev}</strong><span>electoral votes</span></span><span
						class="margin">Trump +{state.margin.toFixed(2)}<small>percentage points</small></span
					>
				</article>
			{/each}
		</div>
		<p class="source-note">
			Margins are the difference in vote share in the certified 2024 returns, compiled in <a
				href="https://en.wikipedia.org/wiki/2024_United_States_presidential_election#Results_by_state"
				target="_blank"
				rel="noopener">Wikipedia’s results-by-state table</a
			>, with references to state election authorities.
			<a href="/election-data-methodology">About our data and sources</a>.
		</p>
	</section>
	{#snippet sidebar()}
		<section id="candidate-markets" class="markets" aria-labelledby="market-heading">
			<h2 id="market-heading">Candidate Markets</h2>
			<p class="market-question">
				Who will win the<br /><strong>2028 presidential election?</strong>
			</p>
			{#if data.board.ok && data.board.candidates.length}
				<ol class="candidate-list">
					{#each data.board.candidates as candidate (candidate.name)}
						<li>
							{#if candidate.photo}<img
									src={candidate.photo}
									alt=""
									width="42"
									height="42"
									loading="lazy"
								/>{:else}<span class="initials" aria-hidden="true">{candidate.initials}</span>{/if}
							<div class="candidate-info">
								<h3>{candidate.name}</h3>
								<span style:color={partyColor(candidate.party)}
									>{candidate.party ?? 'Party not listed'}</span
								>
							</div>
							<strong class="candidate-price" style:color={partyColor(candidate.party)}
								>{candidate.pct}<small>%</small></strong
							>
						</li>
					{/each}
				</ol>
				<p class="market-source">Market prices from <strong>Polymarket</strong></p>
				<p class="market-caption">
					Read {readAt(data.board.fetchedAt)}. Market prices reflect trading activity, not polling
					or an official forecast.
				</p>
			{:else}<p class="unavailable">
					Candidate market prices are temporarily unavailable. You can still build your election
					map.
				</p>{/if}
			<a class="all-markets" href="/2028-presidential-election-interactive-map"
				>Explore the full field &amp; odds →</a
			>
		</section>

		<section class="path-math" aria-labelledby="path-heading">
			<span class="eyebrow">ONE POSSIBLE SCENARIO</span>
			<h2 id="path-heading">A path to <strong>{TO_WIN}</strong></h2>
			<p>
				From the 2024 result, Democrats need a net gain of <strong
					>{FLIP_NEEDED} electoral votes</strong
				> to reach a majority.
			</p>
			<dl>
				<div>
					<dt>2024 Democratic total</dt>
					<dd>{HARRIS_2024}</dd>
				</div>
				{#each battlegrounds.filter((state) => blueWall.includes(state.state)) as state}<div>
						<dt>{state.state}</dt>
						<dd>+{state.ev}</dd>
					</div>{/each}
				<div class="path-total">
					<dt>Scenario total</dt>
					<dd>{HARRIS_2024 + blueWallEV}</dd>
				</div>
			</dl>
			<p class="path-note">
				Flipping these three states while every other result stays the same produces a {TO_WIN}–{TRUMP_2024 -
					FLIP_NEEDED} map. Other combinations are possible.
			</p>
			<a href="#electoral-map">Build your own scenario ↑</a>
		</section>

		<section class="tool-links" aria-labelledby="tools-heading">
			<h2 id="tools-heading">Election tools</h2>
			{#each tools as tool}<a href={tool.href}>{tool.label}<span aria-hidden="true">→</span></a
				>{/each}
		</section>
		<section class="result-panel">
			<h2>2024 starting point</h2>
			{#each resultBlocks as result}<div>
					<span>{result.label}</span><strong style:color={result.color}>{result.value}</strong>
				</div>{/each}<a href="/2024-presidential-election-results">View certified results →</a>
		</section>
	{/snippet}
</ElectionPageShell>

<style>
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
	.eyebrow {
		color: #ae2834;
		font-size: 10px;
		letter-spacing: 1px;
		font-weight: 700;
	}
	.map-heading {
		font-size: 21px;
		font-weight: 700;
		margin-bottom: 10px;
	}
	.map-caption {
		color: #757575;
		font-size: 12px;
		line-height: 1.5;
		margin: 10px 0 25px;
	}
	.map-caption a {
		text-decoration: underline;
	}
	iframe {
		display: block;
		width: 100%;
		height: 570px;
		background: white;
		border: 0;
	}
	.map-footnote {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px 14px;
		font-size: 11px;
		color: #777;
		margin-top: 15px;
		line-height: 1.6;
	}
	section[id] {
		scroll-margin-top: 24px;
	}
	.markets > h2,
	.market-question,
	.market-source,
	.market-caption,
	.all-markets {
		text-align: center;
	}
	.markets > h2 {
		font-size: 21px;
		font-weight: 700;
	}
	.market-question {
		font-size: 14px;
		line-height: 1.6;
		margin: 15px 0;
	}
	.market-question strong {
		font-weight: 400;
	}
	.candidate-list {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid #ddd;
	}
	.candidate-list li {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 13px 0;
		border-bottom: 1px solid #e5e5e5;
	}
	.candidate-list img,
	.initials {
		flex-shrink: 0;
		width: 42px;
		height: 42px;
		border-radius: 50%;
		object-fit: cover;
		object-position: top;
		border: 1px solid #ddd;
	}
	.initials {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f0f2f6;
		color: #37557d;
		font-size: 12px;
	}
	.candidate-info {
		min-width: 0;
		flex: 1;
	}
	.candidate-info h3 {
		font-size: 13px;
		line-height: 1.3;
		font-weight: 700;
	}
	.candidate-info > span {
		font-size: 10px;
		display: block;
		margin-top: 4px;
	}
	.candidate-price {
		font-size: 23px;
		font-weight: 700;
		white-space: nowrap;
	}
	.candidate-price small {
		font-size: 13px;
	}
	.market-source {
		font-size: 10px;
		color: #777;
		margin: 16px 0 10px;
	}
	.market-source strong {
		display: block;
		color: #2154ba;
		font-size: 20px;
		letter-spacing: -0.6px;
		margin-top: 2px;
	}
	.market-caption {
		font-size: 10px;
		line-height: 1.6;
		color: #858585;
	}
	.all-markets {
		display: block;
		font-size: 12px;
		margin-top: 14px;
	}
	.unavailable {
		padding: 20px;
		background: #f4f5f7;
		color: #666;
		font-size: 13px;
		line-height: 1.6;
	}
	.path-math {
		padding: 20px;
		background: #f5f6f8;
		border: 1px solid #e1e4e8;
		margin-top: 32px;
	}
	.path-math h2 {
		font-size: 24px;
		margin: 8px 0 12px;
		font-weight: 400;
	}
	.path-math h2 strong {
		color: #264c83;
	}
	.path-math p {
		font-size: 13px;
		color: #62666c;
		line-height: 1.6;
	}
	.path-math dl {
		margin: 16px 0;
	}
	.path-math dl div {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 8px 0;
		font-size: 12px;
		border-bottom: 1px solid #ddd;
	}
	.path-math dd {
		font-weight: 700;
	}
	.path-math dl .path-total {
		font-size: 16px;
		color: #245493;
		font-weight: 700;
		padding-top: 12px;
		border: 0;
	}
	.path-math .path-note {
		font-size: 11px;
	}
	.path-math > a {
		display: inline-block;
		margin-top: 13px;
		font-size: 12px;
	}
	.tool-links {
		margin-top: 32px;
		border-top: 3px solid #294f83;
	}
	.tool-links h2 {
		font-size: 18px;
		padding: 15px 0 5px;
	}
	.tool-links a {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #e5e5e5;
		padding: 12px 0;
		font-size: 13px;
	}
	.result-panel {
		margin-top: 28px;
		padding-top: 20px;
		border-top: 1px solid #ddd;
	}
	.result-panel h2 {
		font-size: 17px;
		margin-bottom: 10px;
	}
	.result-panel > div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		font-size: 13px;
	}
	.result-panel strong {
		font-size: 23px;
	}
	.result-panel a {
		display: block;
		margin-top: 12px;
		font-size: 12px;
	}
	.battleground-section {
		margin-top: 42px;
	}
	.section-heading {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: baseline;
		gap: 10px;
		border-bottom: 2px solid #34547e;
		padding-bottom: 12px;
	}
	.section-heading h2 {
		font-size: 25px;
		font-weight: 700;
	}
	.section-heading > span {
		font-size: 10px;
		color: #777;
		letter-spacing: 0.7px;
	}
	.section-intro {
		font-size: 14px;
		line-height: 1.6;
		color: #666;
		margin: 18px 0;
	}
	.state-table-head,
	.state-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 100px 140px;
		gap: 24px;
		align-items: center;
	}
	.state-table-head {
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		color: #777;
		padding: 10px 0;
		border-bottom: 1px solid #ddd;
	}
	.state-table-head span:nth-child(n + 2) {
		text-align: right;
	}
	.state-row {
		padding: 18px 0;
		border-bottom: 1px solid #e5e5e5;
	}
	.state-row h3 {
		font-size: 17px;
		font-weight: 700;
		color: #264c83;
	}
	.state-row p {
		font-size: 12px;
		color: #777;
		line-height: 1.6;
		margin-top: 5px;
	}
	.ev {
		text-align: right;
	}
	.ev strong {
		font-size: 23px;
		font-weight: 700;
	}
	.ev > span {
		display: none;
	}
	.margin {
		text-align: right;
		font-size: 14px;
		color: #ad2933;
		font-weight: 700;
	}
	.margin small {
		display: block;
		font-size: 10px;
		color: #888;
		font-weight: 400;
		margin-top: 4px;
	}
	.source-note {
		font-size: 11px;
		line-height: 1.7;
		color: #888;
		margin-top: 18px;
	}
	.source-note a {
		text-decoration: underline;
	}
	@media (max-width: 1100px) {
		.state-table-head,
		.state-row {
			gap: 14px;
			grid-template-columns: minmax(0, 1fr) 70px 120px;
		}
	}
	@media (max-width: 900px) {
		iframe {
			height: 580px;
		}
	}
	@media (max-width: 600px) {
		.map-heading {
			font-size: 20px;
		}
		iframe {
			height: 650px;
		}
		.markets {
			max-width: 380px;
			width: 100%;
			margin: auto;
		}
		.section-heading h2 {
			font-size: 23px;
		}
		.state-table-head {
			display: none;
		}
		.state-row {
			grid-template-columns: 1fr auto;
			gap: 12px;
		}
		.state-row > div {
			grid-column: 1 / -1;
		}
		.ev {
			text-align: left;
			display: flex;
			align-items: baseline;
			gap: 6px;
		}
		.ev strong {
			font-size: 19px;
		}
		.ev > span {
			display: inline;
			font-size: 11px;
			color: #777;
		}
		.margin small {
			display: inline;
			margin-left: 4px;
			font-size: 9px;
		}
		.margin {
			font-size: 12px;
		}
	}
</style>
