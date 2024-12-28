import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

var avg = 0, amount = 0;

export const handle: Handle = async ({ event, resolve }) => {
	console.log(`${event.request.method}: ${event.url.pathname}`);
    console.log(`Request time: ${new Date().toLocaleString()}\n`);

	let start = performance.now();
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});

	let end = performance.now();
	let diff = end - start;
	console.log(`\nResponse status: ${response.status} (took ${diff}ms)\n`);
	console.log("-----------------------------------------------------------")
	
	return response;
};
