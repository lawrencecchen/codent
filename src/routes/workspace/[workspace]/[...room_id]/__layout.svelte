<script lang="ts" context="module">
	export const ssr = false;
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page, fetch, session, context }) => {
		const ilike = `%/workspace/${page.params.workspace}%`;

		const { data: documents, error } = await supabase
			.from('documents')
			.select('*')
			.like('room_id', ilike)
			.order('room_id');
		// .match({ room_id: page.path });

		if (documents) {
			return {
				props: {
					documents
				}
			};
		}
		console.log(error);
	};
</script>

<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { supabase } from '$lib/supabase';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { clickoutside } from '$lib/utlis/clickoutside';
	import { draggable } from '$lib/utlis/draggable';
	import { onMount, tick } from 'svelte';
	export let documents;

	let originalSidebarWidth = 240;
	let sidebarWidth = originalSidebarWidth;
	let minimumSidebarWidth = 190;
	let maximumSidebarWidth = 400;

	function dndmove(e) {
		let dx = e.detail.x - e.detail.mousedownX;
		if (dx > 0) {
			sidebarWidth = Math.min(240 + dx, maximumSidebarWidth);
		} else {
			sidebarWidth = Math.max(240 + dx, minimumSidebarWidth);
		}
	}

	function dndend() {
		isResizingSidebar = false;
		window.localStorage.setItem('sidebarWidth', String(sidebarWidth));
	}
	let isResizingSidebar = false;

	function sortDocuments(documents) {
		return documents.sort((a, b) => (a.room_id > b.room_id ? 1 : -1));
	}

	// onMount(() => {
	// 	supabase
	// 		.from('documents')
	// 		.on('INSERT', (payload) => {
	// 			console.log(payload);
	// 			documents = sortDocuments([...documents, payload.new]);
	// 		})
	// 		.subscribe();
	// });

	async function newPage(parentRoomId, newPageName) {
		// const newPageName = prompt('New page name: ');
		const room_id = `${parentRoomId}/${newPageName}`;
		const { data, error } = await supabase.from('documents').insert({ room_id }).single();
		if (!data) {
			alert('name already taken');
			return console.log(error);
		}
		await goto(data.room_id);
		documents = sortDocuments([...documents, data]);
	}

	async function submit() {
		await newPage($page.path.split('/').slice(0, 3).join('/'), newPageName);
		isCreatingNewPage = false;
		newPageName = '';
	}

	let isCreatingNewPage = false;
	let newPageInputEl: HTMLInputElement;
	let newPageName = '';
</script>

<div class="flex h-screen">
	<div class="relative flex flex-col py-3 border-r bg-gray-50/30" style="width: {sidebarWidth}px;">
		<div class="flex items-baseline px-3">
			<div
				class="mr-2 bg-indigo-600 rounded-md w-5 h-5 flex-shrink-0 grid place-items-center text-white text-xs font-medium uppercase"
			>
				{$auth?.user?.email?.[0]}
			</div>
			<div class="text-xs font-medium text-gray-700 overflow-hidden overflow-ellipsis">
				{$auth?.user?.email}
			</div>
		</div>

		<div class="mt-4 mb-1">
			<div class="font-bold text-gray-500/80 pl-3 pr-2 text-xs flex items-center">
				Pages
				<button
					class="mr-0 ml-auto p-1 hover:bg-gray-300/50 border border-gray-300 rounded"
					on:click|stopPropagation={async () => {
						isCreatingNewPage = true;
						await tick();
						newPageInputEl.focus();
					}}
				>
					<div class="sr-only">New page</div>
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
					<div class="sr-only">New page</div>
				</button>
			</div>
			<!-- <button class="flex w-full items-center text-sm text-gray-700">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 mr-1"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
						clip-rule="evenodd"
					/>
				</svg>
				New folder
			</button> -->
		</div>

		<ul class="max-h-full overflow-auto">
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
			{#each documents as { room_id }}
				<li>
					<a
						href={room_id}
						sveltekit:prefetch
						class="h-7 py-1 pl-3 pr-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center group relative {room_id ===
						$page.path
							? 'bg-gray-100 font-semibold text-black'
							: ''}"
					>
						<div class="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap">
							{room_id.split('/')[room_id.split('/').length - 1]}
						</div>
						<div class="ml-0.5 flex space-x-1">
							<button
								class="p-1 hidden group-hover:block hover:bg-gray-300/50 rounded"
								on:click|preventDefault={() => console.log('lol')}
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
							<button
								class="p-1 hidden group-hover:block hover:bg-gray-300/50 border border-gray-300 rounded"
								on:click|preventDefault={() => newPage(room_id, 'test')}
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
				</li>
			{/each}
		</ul>

		<div
			use:draggable
			on:dndmove={dndmove}
			on:dndstart={() => (isResizingSidebar = true)}
			on:dndend={dndend}
			class="absolute select-none w-[10px] h-full top-0 right-[-5px] cursor-[col-resize]"
		/>
	</div>

	<div class="h-full flex flex-col flex-grow">
		<slot />
	</div>
</div>
