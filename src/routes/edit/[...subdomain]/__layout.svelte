<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page, fetch, session, context }) => {
		const ilike = `%${page.path.split('/').slice(0, 3).join('/')}%`;

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
	import { onMount } from 'svelte';
	export let documents;

	onMount(() => {
		supabase
			.from('documents')
			.on('INSERT', (payload) => {
				console.log(payload);
				documents = [...documents, payload.new];
			})
			.subscribe();
	});

	async function newPage(parentRoomId) {
		const newPageName = prompt('New page name: ');
		const room_id = `${parentRoomId}/${newPageName}`;
		const { data, error } = await supabase.from('documents').insert({ room_id }).single();
		if (!data) {
			alert('name already taken');
			return console.log(error);
		}
		goto(data.room_id);
	}
</script>

<div class="flex h-screen">
	<div class="flex flex-col py-2 border-r w-[240px]">
		<div class="flex items-baseline px-2">
			<div
				class="mr-2 bg-indigo-600 rounded-md w-5 h-5 grid place-items-center text-white text-xs font-medium uppercase"
			>
				{$auth?.user?.email?.[0]}
			</div>
			<div class="text-xs font-medium text-gray-700 overflow-hidden overflow-ellipsis">
				{$auth?.user?.email}
			</div>
		</div>

		<div class="mt-4">
			<button
				class="py-1 px-2 flex w-full items-center text-sm text-gray-600 hover:bg-gray-200 transition duration-75"
				on:click={() => newPage($page.path.split('/').slice(0, 3).join('/'))}
			>
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
				New page
			</button>
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

		<ul class="">
			{#each documents as { content, room_id }}
				<li>
					<a
						href={room_id}
						sveltekit:prefetch
						class="h-7 py-1 pl-8 text-sm text-gray-600 hover:bg-gray-200/80 transition duration-75 flex items-center group relative {room_id ===
						$page.path
							? 'bg-gray-200/80 font-semibold'
							: ''}"
					>
						<div class="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap">
							{room_id.split('/')[room_id.split('/').length - 1]}
						</div>
						<div class="mr-2 mx-0.5 flex space-x-1">
							<button
								class="p-1 hidden group-hover:block hover:bg-gray-300/50 transition duration-75 rounded"
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
								class="p-1 hidden group-hover:block hover:bg-gray-300/50 transition duration-75 border border-gray-300 rounded"
								on:click={() => newPage(room_id)}
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
	</div>

	<slot />
</div>
