<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button/Button.svelte';
	// import Toaster, { toast } from 'svelte-hot-toast';
	import { toast } from '$lib/components/Toast/toast';
	import Toaster from '$lib/components/Toast/Toaster.svelte';
	import { auth, authLoading } from '$lib/stores/auth';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { email } from './_email.store';

	let inputEl: HTMLInputElement;

	onMount(() => {
		const error = $page.query.get('error');
		if (error) {
			toast.error(error, { duration: 5000 });
		}
		if ($page.query.get('undo')) {
			inputEl.autofocus = true;
		}
	});

	let loading = false;

	$: if (!$authLoading) {
		if ($auth) {
			goto('/dashboard');
		}
	}

	async function signIn() {
		if (!$email) {
			return;
		}

		loading = true;
		const { error } = await supabase.auth.signIn(
			{ email: $email },
			{ redirectTo: `${window.location.origin}/login/confirm` }
		);

		if (error) {
			console.log(error);
			switch ((error as any).status) {
				case 429:
					toast.error(
						'For security purposes, you can only attempt email sign in once every 60 seconds.'
					);
					return;
				default:
					toast.error('Could not sign in. Please try again.');
			}
			loading = false;
			return;
		}

		goto('/login/email');
	}
</script>

<svelte:head>
	<script>
		if (localStorage.getItem('supabase.auth.token')) {
			const url = new URL('/dashboard', window.location.href);
			window.location.replace(url.toString());
		}
	</script>
</svelte:head>

<div class="mt-20 p-5 max-w-lg mx-auto flex flex-col items-center">
	<h1 class="text-4xl font-bold mb-4">Sign in</h1>
	<div class="max-w-xs w-full flex flex-col">
		<form on:submit|preventDefault={signIn}>
			<label for="email" class="block text-sm text-gray-500">Email</label>
			<input
				bind:value={$email}
				bind:this={inputEl}
				type="email"
				name="email"
				id="email"
				autocomplete="email"
				placeholder="jane@eyre.org"
				class="mt-1 focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md transition"
			/>

			<Button class="w-full flex-1 mt-3 sm:text-sm text-sm font-medium" bind:loading type="submit">
				<svg
					slot="leftIcon"
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
				Continue with Email
			</Button>
		</form>
	</div>
</div>

<Toaster />
