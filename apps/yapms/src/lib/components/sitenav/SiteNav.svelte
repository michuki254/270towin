<script lang="ts">
	type NavLink = {
		label: string;
		href: string;
		description: string;
		image: string;
	};

	type NavItem = {
		label: string;
		href?: string;
		kicker?: string;
		description?: string;
		image?: string;
		items: NavLink[];
	};

	const navItems = [
		{ label: 'News', href: '/news', items: [] },
		{
			label: 'President',
			href: '/2028-presidential-election',
			kicker: 'Electoral College',
			description: 'Build presidential paths to 270, review certified results, and compare every historical election cycle.',
			image: '/path-to-win-logo.svg',
			items: [
				{
					label: '2028 Electoral College Map',
					href: '/2028-presidential-election-interactive-map',
					description: 'Interactive forecast map with candidate options and a 270 electoral vote path.',
					image: '/favicon.svg'
				},
				{
					label: '2024 Presidential Results',
					href: '/2024-presidential-election-results',
					description: 'Certified state results with electoral vote totals and historical context.',
					image: '/portraits/donald-trump.jpg'
				},
				{
					label: 'Historical Elections',
					href: '/historical-presidential-elections',
					description: 'Explore presidential maps from early elections through the modern era.',
					image: '/portraits/abraham-lincoln.jpg'
				}
			]
		},
		{
			label: 'Senate',
			href: '/2026-senate-election',
			kicker: 'Chamber Control',
			description: 'Track the balance of power across Senate classes, current forecasts, and historical cycles.',
			image: '/party-logos/democrats.png',
			items: [
				{
					label: '2026 Senate Interactive Map',
					href: '/2026-senate-interactive-map',
					description: 'Forecast contested seats, holdovers, and the route to Senate control.',
					image: '/favicon.svg'
				},
				{
					label: '2024 Senate Results',
					href: '/2024-senate-election-results',
					description: 'Final Senate balance after the 2024 election cycle.',
					image: '/party-logos/republicans.png'
				},
				{
					label: 'Historical Senate Elections',
					href: '/historical-senate-elections',
					description: 'Cycle-by-cycle Senate maps and chamber balance summaries.',
					image: '/party-logos/democrats.png'
				}
			]
		},
		{
			label: 'House',
			href: '/2026-house-election',
			kicker: 'District Battles',
			description: 'Use district-level maps and race tables to model the path to a House majority.',
			image: '/party-logos/republicans.png',
			items: [
				{
					label: '2026 House Interactive Map',
					href: '/2026-house-interactive-map',
					description: 'District map, competitive race table, ratings, and control projection.',
					image: '/favicon.svg'
				},
				{
					label: 'Historical House Elections',
					href: '/historical-house-elections',
					description: 'Historical House control summaries and interactive map pages.',
					image: '/party-logos/democrats.png'
				},
				{
					label: 'State & Provincial Maps',
					href: '/#state-maps',
					description: 'Browse state legislative and regional map tools.',
					image: '/path-to-win-logo.svg'
				}
			]
		},
		{
			label: 'Governor',
			href: '/2026-governor-election',
			kicker: 'State Executives',
			description: 'Forecast gubernatorial races with candidate tables, ratings, and future election tabs.',
			image: '/favicon.svg',
			items: [
				{
					label: '2026 Governor Interactive Map',
					href: '/2026-governor-interactive-map',
					description: 'Forecast dashboard for upcoming governor races and ratings.',
					image: '/favicon.svg'
				},
				{
					label: '2024 Governor Results',
					href: '/2024-governor-election-results',
					description: 'Results map and control summary for the 2024 governor cycle.',
					image: '/party-logos/republicans.png'
				},
				{
					label: 'Historical Governor Elections',
					href: '/historical-governor-elections',
					description: 'Governor results by year with state-by-state historical context.',
					image: '/party-logos/democrats.png'
				}
			]
		},
		{
			label: 'States',
			kicker: 'Elected Officials',
			description: 'State-by-state dashboards for federal officials, governors, legislatures, and partisan composition.',
			image: '/favicon.svg',
			items: [
				{
					label: 'Elected Officials Map',
					href: '/elected-officials',
					description: 'Click a 2024 presidential result map to open each state officials dashboard.',
					image: '/favicon.svg'
				},
				{
					label: 'Arkansas Officials',
					href: '/states',
					description: 'Browse all state elected officials dashboards.',
					image: '/favicon.svg'
				},
				{
					label: 'State Voting History',
					href: '/state-voting-history',
					description: 'Recent partisan trends, battleground status, and state voting behavior.',
					image: '/party-logos/republicans.png'
				},
				{
					label: 'State Trifectas',
					href: '/state-trifectas',
					description: 'Governor and legislative chamber control by party.',
					image: '/path-to-win-logo.svg'
				},
				{
					label: 'State Election Results',
					href: '/state-election-results',
					description: 'State result archive links for major offices.',
					image: '/party-logos/democrats.png'
				}
			]
		},
		{
			label: 'More',
			kicker: 'Map Library',
			description: 'Find additional tools, archived maps, and specialty election map experiences.',
			image: '/path-to-win-logo.svg',
			items: [
				{
					label: 'Map Library',
					href: '/maps',
					description: 'All current national, state, and specialty map tools.',
					image: '/favicon.svg'
				},
				{
					label: 'Election Simulator',
					href: '/simulator',
					description: 'Choose a presidential, Senate, House, or governor simulator.',
					image: '/path-to-win-logo.svg'
				},
				{
					label: 'Election Countdown Clock',
					href: '/election-countdown-clock',
					description: 'A branded embeddable countdown clock for election pages and campaign sites.',
					image: '/favicon.svg'
				},
				{
					label: 'Forecasts, Polls & Markets',
					href: '/forecasts',
					description: 'Forecast dashboards with links to polling and prediction-market pages.',
					image: '/party-logos/democrats.png'
				},
				{
					label: 'Election Reference Tools',
					href: '/poll-closing-times',
					description: 'Poll closing times, primary dates, tie scenarios, and electoral vote rules.',
					image: '/party-logos/republicans.png'
				},
				{
					label: 'Fantasy Election Maps',
					href: '/fantasy-election-maps',
					description: 'Alternate geography and custom scenario map tools.',
					image: '/favicon.svg'
				},
				{
					label: 'Site Map',
					href: '/site-map',
					description: 'Browse every major Path to Win page and election data section.',
					image: '/portraits/george-washington.jpg'
				},
				{
					label: 'About Path to Win',
					href: '/about',
					description: 'Learn about the election map, forecast, and historical data platform.',
					image: '/path-to-win-logo.svg'
				}
			]
		}
	] satisfies NavItem[];

	let openMenu: string | undefined = $state(undefined);
	let closeMenuTimeout: ReturnType<typeof setTimeout> | undefined;

	function openMegaMenu(label: string) {
		if (closeMenuTimeout !== undefined) {
			clearTimeout(closeMenuTimeout);
			closeMenuTimeout = undefined;
		}
		openMenu = label;
	}

	function closeMegaMenu() {
		closeMenuTimeout = setTimeout(() => {
			openMenu = undefined;
			closeMenuTimeout = undefined;
		}, 180);
	}

	function toggleMegaMenu(label: string) {
		if (openMenu === label) {
			openMenu = undefined;
			return;
		}
		openMegaMenu(label);
	}
</script>

<header class="relative z-40 bg-[#001666] text-white shadow-md shrink-0">
	<div class="mx-auto flex max-w-6xl items-center gap-8 px-4 py-2">
		<a href="/" class="flex shrink-0 items-center gap-2" aria-label="Path to Win home">
			<img
				src="/favicon.svg"
				alt=""
				class="h-9 w-9 rounded-md bg-white object-contain"
				aria-hidden="true"
			/>
			<span class="flex flex-col leading-none">
				<span class="text-xl font-extrabold tracking-tight text-white">Path</span>
				<span class="text-base font-bold text-[#9db8e0]">to Win</span>
			</span>
		</a>
		<nav class="min-w-0 flex-1" aria-label="Primary navigation">
			<ul class="flex flex-wrap items-stretch text-sm font-semibold">
			{#each navItems as item}
				{#if item.items.length === 0}
					<li>
						<a class="block rounded px-4 py-2.5 transition-colors hover:bg-[#b60b03]" href={item.href}>
							{item.label}
						</a>
					</li>
				{:else}
					<li
						class="relative"
						onmouseenter={() => openMegaMenu(item.label)}
						onmouseleave={closeMegaMenu}
					>
						<button
							type="button"
							aria-haspopup="true"
							aria-expanded={openMenu === item.label}
							class="cursor-pointer select-none rounded px-4 py-2.5 transition-colors hover:bg-[#b60b03]"
							onclick={() => toggleMegaMenu(item.label)}
							onfocus={() => openMegaMenu(item.label)}
						>
							{item.label}
						</button>
						{#if openMenu === item.label}
						<div
							class={`absolute top-full z-50 pt-2 ${item.label === 'More' ? 'right-0' : 'left-0'}`}
						>
							<div
								class="w-[min(92vw,760px)] rounded-md border border-neutral-200 bg-white p-3 text-neutral-900 shadow-2xl"
							>
							<div class="grid gap-3 md:grid-cols-[230px_1fr]">
								<a
									href={item.href ?? item.items[0]?.href}
									class="overflow-hidden rounded-md border border-neutral-200 bg-[#f5f7fb] hover:border-[#2e5aac]"
									onclick={() => (openMenu = undefined)}
								>
									<div class="flex h-28 items-center justify-center bg-[#eef1f7] p-4">
										<img
											src={item.image}
											alt=""
											class="max-h-24 max-w-full object-contain"
											loading="lazy"
											aria-hidden="true"
										/>
									</div>
									<div class="p-3">
										<div class="text-[11px] font-black uppercase tracking-wide text-[#d83a45]">
											{item.kicker}
										</div>
										<div class="mt-1 text-base font-black text-[#061a55]">{item.label}</div>
										<p class="mt-1 text-xs leading-relaxed text-neutral-600">{item.description}</p>
									</div>
								</a>

								<div class="grid gap-2">
									{#each item.items as sub}
										<a
											href={sub.href}
											class="grid grid-cols-[54px_1fr] gap-3 rounded-md border border-transparent p-2 transition hover:border-neutral-200 hover:bg-[#f7f8fb]"
											onclick={() => (openMenu = undefined)}
										>
											<div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-[#eef1f7]">
												<img
													src={sub.image}
													alt=""
													class="h-full w-full object-cover"
													loading="lazy"
													aria-hidden="true"
												/>
											</div>
											<div>
												<div class="text-sm font-black text-[#061a55]">{sub.label}</div>
												<p class="mt-0.5 text-xs leading-snug text-neutral-600">
													{sub.description}
												</p>
											</div>
										</a>
									{/each}
								</div>
							</div>
							</div>
						</div>
						{/if}
					</li>
				{/if}
			{/each}
			</ul>
		</nav>
	</div>
</header>
