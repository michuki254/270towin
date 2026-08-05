<script lang="ts">
	const {
		count,
		percentage,
		color,
		transitions = true
	}: {
		count: number;
		percentage: number;
		color: string;
		transitions?: boolean;
	} = $props();
</script>

<div
	aria-label={`${count}`}
	class="flex flex-col flex-grow overflow-hidden"
	class:transition-all={transitions}
	class:ease-linear={transitions}
	class:duration-200={transitions}
	style="flex-basis: {percentage * 100}%; background-color: {color}"
></div>
