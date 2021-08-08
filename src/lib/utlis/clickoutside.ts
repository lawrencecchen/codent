export function clickoutside(
	node: HTMLElement
): {
	destroy(): void;
} {
	function handleClick(e) {
		if (node && !node.contains(e.target) && !e.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('clickoutside', e));
		}
	}
	document.addEventListener('click', handleClick);

	return {
		destroy() {
			document.removeEventListener('click', handleClick);
		}
	};
}
