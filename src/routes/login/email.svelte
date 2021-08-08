<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';

	import { onMount } from 'svelte';

	import { email } from './_email.store';

	onMount(() => {
		if ($auth) {
			goto('/dashboard');
		}
		if (!$email) {
			goto('/login');
		}
	});
</script>

<div class="mt-20 p-5 space-y-4 mx-auto text-center">
	<h1 class="text-5xl font-bold pb-4">Awaiting Confirmation</h1>

	<p class="font-bold py-4">Do not close this window until you open the email link.</p>

	<p>
		You should receive an email at <strong class="font-bold">{$email}</strong> (<a
			class="text-blue-600 hover:underline"
			href="/login?undo=true"
		>
			undo</a
		>).
	</p>
</div>
