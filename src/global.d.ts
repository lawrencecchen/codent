/// <reference types="@sveltejs/kit" />

declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		ondndmove?: (event: CustomEvent<{ x; y; dx; dy }> & { target: EventTarget & T }) => any;
		ondndstart?: (event: CustomEvent<{ x; y }> & { target: EventTarget & T }) => any;
		ondndend?: (event: CustomEvent<{ x; y }> & { target: EventTarget & T }) => any;
		onclickoutside?: (event: CustomEvent<MouseEvent> & { target: EventTarget & T }) => any;
	}
}
