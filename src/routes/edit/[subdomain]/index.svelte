<script context="module" lang="ts">
	export const ssr = false;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import Editor from '$lib/Tiptap/Editor.svelte';
</script>

<svelte:head>
	<title>Codent</title>
</svelte:head>

<!-- <Monaco /> -->

<Editor documentId={$page.path} class="min-h-screen" />
