<script context="module" lang="ts">
	export const ssr = false;
</script>

<script lang="ts">
	import { auth } from '$lib/stores/auth';
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

{#if $auth}
	Hi, {$auth.user.email}
{:else}
	<a href="/login">Sign in</a>
{/if}
