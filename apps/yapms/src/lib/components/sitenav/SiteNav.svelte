<script lang="ts">
	import Login from '$lib/icons/Login.svelte';
	import Swatch from '$lib/icons/Swatch.svelte';
	import ArrowUpTray from '$lib/icons/ArrowUpTray.svelte';
	import MapSearch from '$lib/components/mapsearch/MapSearch.svelte';
	import SocialLinkGrid from '$lib/components/links/SocialLinkGrid.svelte';
	import { ImportModalStore, AuthModalStore, ThemeModalStore } from '$lib/stores/Modals';

	export let searchData: { title: string; route: string }[] = [];

	const navItems = [
		{ label: 'News', href: '/#headlines', items: [] as { label: string; href: string }[] },
		{
			label: 'President',
			items: [
				{ label: '2028 Electoral College Map', href: '/2028-presidential-election-interactive-map' },
				{ label: '2024 Presidential Results', href: '/2024-presidential-election-results' },
				{ label: 'Historical Elections', href: '/historical-presidential-elections' }
			]
		},
		{
			label: 'Senate',
			items: [
				{ label: '2026 Senate Interactive Map', href: '/2026-senate-interactive-map' },
				{ label: '2024 Senate Results', href: '/app/usa/senate/2024310/results' }
			]
		},
		{
			label: 'House',
			items: [
				{ label: '2026 House Interactive Map', href: '/2026-house-interactive-map' },
				{ label: 'State & Provincial Maps', href: '/#state-maps' }
			]
		},
		{
			label: 'Governor',
			items: [{ label: 'Explore Interactive Maps', href: '/#maps' }]
		},
		{
			label: 'States',
			items: [
				{ label: 'State Senate Map', href: '/#state-maps' },
				{ label: 'State House Map', href: '/#state-maps' }
			]
		},
		{
			label: 'More',
			items: [
				{ label: 'Map Library', href: '/#maps' },
				{ label: 'Historical Maps', href: '/#historical' },
				{ label: 'Fantasy Maps', href: '/#fantasy' }
			]
		}
	];

	function openThemeModal() {
		ThemeModalStore.set({ ...$ThemeModalStore, open: true });
	}

	function openImportModal() {
		ImportModalStore.set({ ...$ImportModalStore, open: true });
	}

	function openAuthModal() {
		AuthModalStore.set({ ...$AuthModalStore, open: true });
	}
</script>

<header class="relative z-40 bg-[#001666] text-white shadow-md shrink-0">
	<div class="max-w-6xl mx-auto flex items-center gap-4 px-4 py-2">
		<a href="/" class="flex items-baseline gap-1 shrink-0">
			<span class="text-3xl font-extrabold leading-none tracking-tight">270</span>
			<span class="text-xl font-semibold text-[#9db8e0] leading-none">toWin</span>
		</a>
		<div class="hidden lg:block flex-1 max-w-md">
			<MapSearch data={searchData} />
		</div>
		<div class="ml-auto flex items-center gap-2">
			<span class="hidden md:inline text-xs uppercase tracking-wide text-[#9db8e0]">Follow</span>
			<div class="hidden sm:block"><SocialLinkGrid /></div>
			<button
				class="btn btn-sm btn-circle bg-[#244999] border-none text-white hover:bg-[#2f5bbf]"
				on:click={openImportModal}
				aria-label="Import map"
			>
				<ArrowUpTray class="h-5 m-auto" />
			</button>
			<button
				class="btn btn-sm btn-circle bg-[#244999] border-none text-white hover:bg-[#2f5bbf]"
				on:click={openThemeModal}
				aria-label="Change theme"
			>
				<Swatch class="h-5 m-auto" />
			</button>
			<button
				class="btn btn-sm btn-circle bg-[#244999] border-none text-white hover:bg-[#2f5bbf]"
				on:click={openAuthModal}
				aria-label="Log in"
			>
				<Login class="h-5 m-auto" />
			</button>
		</div>
	</div>

	<!-- Primary navigation menu -->
	<nav class="bg-[#244999] border-t border-[#2f5bbf]">
		<ul class="max-w-6xl mx-auto flex flex-wrap items-stretch text-sm font-semibold">
			{#each navItems as item}
				{#if item.items.length === 0}
					<li>
						<a class="block px-4 py-2.5 hover:bg-[#b60b03] transition-colors" href={item.href}>
							{item.label}
						</a>
					</li>
				{:else}
					<li class="dropdown dropdown-hover">
						<div
							tabindex="0"
							role="button"
							class="px-4 py-2.5 hover:bg-[#b60b03] transition-colors cursor-pointer select-none"
						>
							{item.label}
						</div>
						<ul
							class="dropdown-content menu z-50 bg-white text-neutral-800 rounded-b-md shadow-lg w-64 p-1"
						>
							{#each item.items as sub}
								<li><a href={sub.href} class="rounded hover:bg-[#eef1f5]">{sub.label}</a></li>
							{/each}
						</ul>
					</li>
				{/if}
			{/each}
		</ul>
	</nav>
</header>
