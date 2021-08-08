export function draggable(node: HTMLElement) {
	let x: number;
	let y: number;
	let mousedownX: number;
	let mousedownY: number;

	function mousedown(event: MouseEvent) {
		x = event.clientX;
		y = event.clientY;
		mousedownX = event.clientX;
		mousedownY = event.clientY;

		node.dispatchEvent(
			new CustomEvent('dndstart', {
				detail: { x, y }
			})
		);

		window.addEventListener('mousemove', mousemove);
		window.addEventListener('mouseup', mouseup);
	}

	function mousemove(event: MouseEvent) {
		const dx = event.clientX - x;
		const dy = event.clientY - y;
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(
			new CustomEvent('dndmove', {
				detail: { x, y, dx, dy, mousedownX, mousedownY }
			})
		);
	}

	function mouseup(event: MouseEvent) {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(
			new CustomEvent('dndend', {
				detail: { x, y }
			})
		);

		window.removeEventListener('mousemove', mousemove);
		window.removeEventListener('mouseup', mouseup);
	}

	node.addEventListener('mousedown', mousedown);

	return {
		destroy() {
			node.removeEventListener('mousedown', mousedown);
		}
	};
}
