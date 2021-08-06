<script lang="ts" context="module">
	export const ssr = false;

	import type { Load } from '@sveltejs/kit';
	import { supabase } from '$lib/supabase';
	import Editor from '$lib/Tiptap/Editor.svelte';

	export const load: Load = async ({ page, fetch, session, context }) => {
		const { data: document, error } = await supabase
			.from('documents')
			.select('*')
			.match({ id: page.params.documentId })
			.single();

		if (document) {
			return {
				props: {
					document
				}
			};
		}

		console.log(error);
	};
</script>

<script lang="ts">
	export let document;
</script>

<Editor documentId={document.id} />
