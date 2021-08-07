// HOST=localhost PORT=1234 CALLBACK_URL=http://localhost:3000/documents/update CALLBACK_OBJECTS='{"content":"XmlFragment"}' YPERSISTENCE=./dbDir node ./node_modules/y-websocket/bin/server.js
import { supabase } from '$lib/supabase';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ body }) => {
	const room_id = body['room'];
	const content = body['data']['content']['content'];

	const { data, error } = await supabase
		.from('documents')
		.upsert({ room_id, content }, { onConflict: 'room_id' });
	if (error) {
		console.log(error);
		return {
			status: 500
		};
	}

	return {
		status: 200,
		body: data
	};
};
