<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page, fetch, session, context }) => {
		const { data: documents, error } = await supabase.from('documents').select('*');

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
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';

	export let documents;

	let title = '';
	async function submit() {
		const { data, error } = await supabase.from('documents').insert({ title }).single();
		if (error) {
			return console.log(error);
		}
		console.log(data);
		goto(`/documents/${data.id}`);
	}
</script>

<h1>Create a document</h1>

<form on:submit|preventDefault={submit}>
	<label for="title_field" />
	<input type="text" id="title_field" bind:value={title} />
	<button type="submit">Create document</button>
</form>

<h2>Existing documents:</h2>

<ul class="list-disc list-inside">
	{#each documents as { id, title }}
		<li><a href="/documents/{id}">{title}</a></li>
	{/each}
</ul>
