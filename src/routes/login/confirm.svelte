<script lang="ts">
	import { goto } from '$app/navigation';

	import { auth, authLoading } from '$lib/stores/auth';

	$: if (!$authLoading) {
		if ($auth) {
			goto(`/dashboard`, { replaceState: true });
		} else {
			goto(`/login?error=Failed to sign in. Please try agin.`, { replaceState: true });
		}
	}
</script>

<div class="p-5 space-y-4 mx-auto text-center">
	<h1 class="text-5xl font-bold pb-10">Email Address Confirmed</h1>

	<p class="text-gray-600">You've been authenticated. Now redirecting to the dashboard...</p>

	<p class="text-gray-600">
		Not there yet? Click <a href="/dashboard" class="text-blue-600 hover:underline"> here. </a>
	</p>
</div>
