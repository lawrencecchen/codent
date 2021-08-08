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

<div class="p-3 text-sm text-gray-600 xl:fixed xl:bg-transparent w-full">
	{$page.path.replace('/workspace/', '')}
</div>

<div class="max-h-full overflow-auto flex-grow">
	{#key $page.path}
		<TiptapEditor documentId={$page.path} />
	{/key}
</div>
