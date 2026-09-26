<script lang="ts">
	type CandidateOption = {
		name: string;
		image?: string;
	};

	let {
		options,
		value = $bindable(),
		color,
		ariaLabel,
		align = 'left'
	}: {
		options: CandidateOption[];
		value: string;
		color: string;
		ariaLabel: string;
		align?: 'left' | 'right';
	} = $props();

	let details: HTMLDetailsElement | undefined;
	const selected = $derived(options.find((option) => option.name === value) ?? options[0]);
	const initials = $derived(
		selected.name
			.split(' ')
			.map((part) => part.at(0))
			.join('')
			.slice(0, 2)
			.toUpperCase()
	);

	function selectCandidate(name: string) {
		value = name;
		if (details !== undefined) {
			details.open = false;
		}
	}
</script>

<details class="relative min-w-0" bind:this={details}>
	<summary
		class="flex cursor-pointer list-none items-center gap-1.5 outline-none marker:hidden"
		aria-label={ariaLabel}
	>
		<span class="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-base-200 text-[9px] font-bold">
			{#if selected.image !== undefined}
				<img class="h-full w-full object-cover" src={selected.image} alt="" loading="lazy" />
			{:else}
				<span>{initials}</span>
			{/if}
		</span>
		<span class="max-w-40 truncate">{selected.name}</span>
		<span
			class="shrink-0"
			style="width: 0; height: 0; border-left: 0.3rem solid transparent; border-right: 0.3rem solid transparent; border-top: 0.4rem solid currentColor;"
		></span>
	</summary>
	<div
		class="absolute bottom-full z-50 mb-1 max-h-52 w-64 overflow-y-auto rounded-md border border-base-300 bg-base-100 p-1 text-sm shadow-lg"
		class:left-0={align === 'left'}
		class:right-0={align === 'right'}
		style:color
	>
		{#each options as option}
			<button
				type="button"
				class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-base-200"
				class:bg-base-200={option.name === value}
				onclick={() => selectCandidate(option.name)}
			>
				<span class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-base-300 text-[10px] font-bold">
					{#if option.image !== undefined}
						<img class="h-full w-full object-cover" src={option.image} alt="" loading="lazy" />
					{:else}
						<span>
							{option.name
								.split(' ')
								.map((part) => part.at(0))
								.join('')
								.slice(0, 2)
								.toUpperCase()}
						</span>
					{/if}
				</span>
				<span class="truncate">{option.name}</span>
			</button>
		{/each}
	</div>
</details>
