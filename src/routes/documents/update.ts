// HOST=localhost PORT=1234 CALLBACK_URL=http://localhost:3000/documents/update YPERSISTENCE=./dbDir node ./node_modules/y-websocket/bin/server.js
// HOST=localhost PORT=1234 CALLBACK_URL=http://localhost:3000/documents/update CALLBACK_OBJECTS='{"annotations":"Map"}' YPERSISTENCE=./dbDir node ./node_modules/y-websocket/bin/server.js
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ body }) => {
	console.log(body);
	return {
		status: 200
	};
};
