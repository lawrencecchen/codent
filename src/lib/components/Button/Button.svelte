<script lang="ts">
	import Spinner from '$lib/components/Spinner/Spinner.svelte';
	let className = '';
	export let disabled = false;
	export let loading = false;
	export let type: 'button' | 'submit' = 'button';
	export let variant: 'primary' | 'secondary' = 'primary';

	const variants = {
		primary:
			'bg-black text-gray-50 border-black hover:bg-white hover:text-black active:border-black active:text-black',
		secondary:
			'bg-white text-gray-500 border-gray-300 hover:border-black hover:text-gray-800 active:border-black active:text-black'
	};
	const loaderVariants = {
		primary: 'text-white group-hover:text-black',
		secondary: 'group-hover'
	};

	export { className as class };
</script>

<button
	class="shadow-sm relative grid grid-cols-6 p-2 group rounded border whitespace-nowrap overflow-hidden overflow-ellipsis transition motion-reduce:transition-none focus:outline-none active:bg-gray-200 {className}
    {disabled || loading ? 'opacity-70 pointer-events-none' : ''} {variants[variant]}"
	disabled={disabled || loading}
	on:click
	{type}
>
	<div class="h-full grid place-items-center col-span-1">
		{#if loading}
			<Spinner slot="leftIcon" class="h-5 w-5 mr-2 {loaderVariants[variant]}" />
		{:else if $$slots.leftIcon}
			<slot name="leftIcon" />
		{/if}
	</div>
	<div class="col-start-2 col-span-4 whitespace-nowrap">
		<slot />
	</div>
</button>

<style>
	button:focus-visible {
		@apply ring-2;
		@apply ring-offset-2;
		@apply ring-black;
		outline: none;
		background-color: white;
		color: black;
		border: 1px solid black;
	}
</style>
