<script lang="ts">
	import { goto } from '$app/navigation';
	import { clickoutside } from '$lib/utlis/clickoutside';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase';
	import { tick } from 'svelte';
	import PopoverWrapper from '$lib/components/Popover/PopoverWrapper.svelte';
	import Popover from '$lib/components/Popover/Popover.svelte';
	import { scale } from 'svelte/transition';

	async function newPage(newPageName) {
		const room_id = `${$page.path}/${newPageName}`;
		const { data, error } = await supabase.from('documents').insert({ room_id }).single();
		if (!data) {
			alert('name already taken');
			return console.log(error);
		}
		await goto(data.room_id);
		// documents = sortDocuments([...documents, data]);
	}

	async function submit() {
		await newPage(newPageName);
		isCreatingNewPage = false;
		newPageName = '';
	}

	let isCreatingNewPage = false;
	let newPageInputEl: HTMLInputElement;
	let newPageName = '';

	async function enableCreateNewPageInput() {
		isCreatingNewPage = true;
		await tick();
		newPageInputEl.focus();
	}

	async function deletePage() {
		const { data, error } = await supabase
			.from('documents')
			.upsert({ room_id: $page.path, is_deleted: true }, { onConflict: 'room_id' });

		if (error) {
			return console.log(error);
		}
		console.log(data);
		showPopover = false;
	}

	let showPopover = false;
	export let document;
</script>

<li>
	<a
		href={document.room_id}
		sveltekit:prefetch
		class="h-7 py-1 pl-3 pr-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center group relative {document.room_id ===
		$page.path
			? 'bg-gray-100 font-semibold text-black'
			: ''}"
	>
		<div class="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap">
			{document.room_id.split('/')[document.room_id.split('/').length - 1]}
		</div>
		<div class="ml-0.5 flex space-x-1">
			<PopoverWrapper on:close={() => (showPopover = false)} placement="right-start">
				<button
					class="p-1 hidden group-hover:block {showPopover
						? 'block'
						: ''} hover:bg-gray-300/50 rounded"
					on:click|preventDefault={() => (showPopover = !showPopover)}
				>
					<div class="sr-only">New subpage</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3 text-gray-700"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
						/>
					</svg>
				</button>
				{#if showPopover}
					<Popover class="w-20">
						<div
							class="bg-white p-2 text-sm border rounded shadow-md origin-left"
							on:click|preventDefault
							transition:scale={{ duration: 75, start: 0.96 }}
						>
							<ul class="space-y-2">
								<li>
									<button on:click={deletePage}>Delete</button>
								</li>
								<li>
									<button>Rename</button>
								</li>
							</ul>
						</div>
					</Popover>
				{/if}
			</PopoverWrapper>
			<button
				class="p-1 hidden group-hover:block hover:bg-gray-300/50 border border-gray-300 rounded"
				on:click|preventDefault={enableCreateNewPageInput}
			>
				<div class="sr-only">New subpage</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-3 w-3 text-gray-700"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</a>
	<ul class="pl-6">
		{#if isCreatingNewPage}
			<li>
				<form on:submit|preventDefault={submit}>
					<input
						use:clickoutside
						on:clickoutside={() => (isCreatingNewPage = false)}
						bind:value={newPageName}
						bind:this={newPageInputEl}
						type="text"
						placeholder="Untitled page"
						class="h-7 py-1 pl-3 w-full text-sm bg-white text-gray-800 border-gray-600 focus:border-gray-400 outline-none focus:ring-transparent placeholder-shown:font-medium"
					/>
				</form>
			</li>
		{/if}
	</ul>
</li>
