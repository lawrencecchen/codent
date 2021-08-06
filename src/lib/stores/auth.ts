import { supabase } from '$lib/supabase';
import type { AuthSession, AuthUser } from '@supabase/supabase-js';
import type { Readable } from 'svelte/store';
import { derived, readable } from 'svelte/store';

export const auth = readable<AuthSession>(null, (set) => {
	const session = supabase.auth.session();

	if (session) {
		set(session);
	}

	const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
		set(session);
	});

	return () => {
		authListener.unsubscribe();
	};
});

export const user = derived<Readable<AuthSession>, AuthUser>(auth, ($auth) => $auth?.user);
