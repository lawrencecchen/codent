<script lang="ts">
	import { setContext } from 'svelte';
	import { key } from './key';
	import type { Placement } from './placement';
	import { clickoutside } from '$lib/utlis/clickoutside';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let parentNode: HTMLDivElement;

	export let placement: Placement = 'bottom-center';

	setContext(key, {
		getPlacement: () => placement,
		getParentNode: () => parentNode
	});

	let className = '';

	export { className as class };
</script>

<div
	bind:this={parentNode}
	class={className}
	use:clickoutside
	on:clickoutside={() => dispatch('close')}
>
	<slot />
</div>
