<script context="module" lang="ts">
	export const ssr = false;
</script>

<script lang="ts">
	import { auth } from '$lib/stores/auth';

	import TiptapEditor from '$lib/components/Tiptap/TiptapEditor.svelte';
</script>

<svelte:head>
	<title>Codent</title>
</svelte:head>

{#if $auth}
	Hi, {$auth.user.email}
{:else}
	<a href="/login">Sign in</a>
{/if}
<!-- <Monaco /> -->
<TiptapEditor documentId="example-document" />
