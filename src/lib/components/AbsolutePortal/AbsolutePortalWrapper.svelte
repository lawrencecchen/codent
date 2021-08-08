<script lang="ts">
	import { setContext } from 'svelte';
	import { key } from './key';
	import type { Placement } from './placement';

	let parentNode: HTMLDivElement;

	export let placement: Placement = 'bottom-center';

	setContext(key, {
		getPlacement: () => placement,
		getParentNode: () => parentNode
	});

	let className = '';

	export { className as class };
</script>

<div bind:this={parentNode} class={className}>
	<slot />
</div>
