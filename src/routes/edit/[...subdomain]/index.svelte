<script context="module" lang="ts">
	export const ssr = false;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import TiptapEditor from '$lib/components/Tiptap/TiptapEditor.svelte';
</script>

<svelte:head>
	<title>Codent</title>
</svelte:head>

<!-- <Monaco /> -->

<div class=" w-full h-full">
	{#key $page.path}
		<TiptapEditor documentId={$page.path} />
	{/key}
</div>
