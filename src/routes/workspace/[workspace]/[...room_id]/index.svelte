<script context="module" lang="ts">
	export const ssr = false;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import TiptapEditor from '$lib/components/Tiptap/TiptapEditor.svelte';
	import { users } from '$lib/components/Tiptap/users.store';
</script>

<svelte:head>
	<title>Codent</title>
</svelte:head>

<!-- <Monaco /> -->

<div class="p-3 text-sm text-gray-600 max-w-full xl:bg-transparent w-full flex justify-between">
	<div>
		{$page.path.replace('/workspace/', '')}
	</div>

	<ul class="flex space-x-1">
		{#each $users as user}
			<li
				class="rounded-md w-5 h-5 flex-shrink-0 grid place-items-center text-white text-xs font-medium uppercase"
				style="background-color: {user.color}"
				title={user.name}
			>
				{user.name[0]}
			</li>
		{/each}
	</ul>
</div>

<div class="max-h-full overflow-auto flex-grow">
	{#key $page.path}
		<TiptapEditor documentId={$page.path} />
	{/key}
</div>
