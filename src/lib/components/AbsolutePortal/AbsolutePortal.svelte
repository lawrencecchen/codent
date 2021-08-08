<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import { key } from './key';
	import type { Placement } from './placement';

	export let targetElement: HTMLElement | string = null;
	let slotNode: HTMLDivElement;
	let portalNode: HTMLDivElement;
	let wrapperNode: HTMLDivElement;
	const { getPlacement, getParentNode } = getContext(key);

	const placement = getPlacement();
	const parentNode = getParentNode();

	function getTarget(targetElement?: HTMLElement | string): HTMLElement {
		if (!targetElement) {
			return document.body;
		} else if (typeof targetElement === 'string') {
			return document.getElementById(targetElement);
		}

		return targetElement;
	}

	function getStyle(placement: Placement, parentNode: HTMLDivElement, slotNode: HTMLDivElement) {
		const [position1, position2] = placement.split('-');
		const slotRect = slotNode.getBoundingClientRect();
		const parentRect = parentNode.getBoundingClientRect();
		let top = 0;
		let left = 0;
		let width = slotRect.width;
		let height = slotRect.height;
		let translateX = '0px';
		let translateY = '0px';

		if (position1 === 'bottom') {
			top = parentRect.y + parentRect.height;
		}

		if (position2 === 'center') {
			left = parentRect.x + parentRect.width / 2;
			translateX = '-100%';
		} else if (position2 === 'end') {
			left = parentRect.x + parentRect.width;
			translateX = '-100%';
		}

		return { top, left, width, height, translateX, translateY };
	}

	onMount(() => {
		portalNode = document.createElement('div');
		const { top, left, width, height, translateX, translateY } = getStyle(
			placement,
			parentNode,
			slotNode
		);
		portalNode.setAttribute(
			'style',
			`position: absolute; z-index: 9001; top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px;`
		);
		portalNode.className = 'portal';
		slotNode.setAttribute('style', `transform: translate(${translateX}, ${translateY})`);
		const target = getTarget(targetElement);
		target.appendChild(portalNode);
		portalNode.appendChild(slotNode);
	});

	// Update coordinates if they change from props.
	// $: if (portalNode) {
	// 	const { top, left, width, height } = getPosition(placement, parentNode, slotNode);

	// 	portalNode.setAttribute(
	// 		'style',
	// 		`position: absolute; z-index: 9001; top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px`
	// 	);
	// }

	onDestroy(() => {
		const target = getTarget(targetElement);
		target.removeChild(portalNode);
	});

	let className = '';

	export { className as class };
</script>

<div class="portal-clone" bind:this={wrapperNode}>
	<div bind:this={slotNode} class={className}>
		<slot />
	</div>
</div>

<style>
	.portal-clone {
		display: none;
	}
</style>
