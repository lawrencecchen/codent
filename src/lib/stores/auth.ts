import { browser } from '$app/env';
import { supabase } from '$lib/supabase';
import type { AuthSession } from '@supabase/supabase-js';
import { readable, writable } from 'svelte/store';

export const authLoading = writable(true);

export const auth = readable<AuthSession>(null, (set) => {
	if (!browser) {
		return null;
	}
	const authSession = supabase.auth.session();

	if (authSession) {
		set(authSession);
		authLoading.set(false);
	}

	const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, authSession) => {
		set(authSession);
		authLoading.set(false);
	});

	return () => {
		authListener.unsubscribe();
	};
});
