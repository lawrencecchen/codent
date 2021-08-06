<!-- <script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit"

  export const load: Load = async ({ page, fetch, session, context }) => {
    return {
      props: {

      }
    }
  }
</script> -->
<script lang="ts">
	import { auth } from '$lib/stores/auth';
</script>

<div class="flex h-screen">
	<div class="flex flex-col p-2 border-r">
		<div class="flex items-baseline">
			<div
				class="mr-2 bg-indigo-600 rounded-md w-5 h-5 grid place-items-center text-white text-xs font-medium uppercase"
			>
				{$auth?.user?.email?.[0]}
			</div>
			<div class="text-xs font-medium text-gray-700 overflow-hidden overflow-ellipsis">
				{$auth?.user?.email}
			</div>
		</div>

		<div class="space-y-2 mt-4">
			<button class="flex items-center text-sm text-gray-700">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 mr-1"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
						clip-rule="evenodd"
					/>
				</svg>
				New page</button
			>
			<button class="flex items-center text-sm text-gray-700">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 mr-1"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
						clip-rule="evenodd"
					/>
				</svg>
				New folder
			</button>
		</div>
	</div>

	<slot />
</div>
