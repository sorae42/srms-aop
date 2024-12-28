import { AccountService } from '$lib/services/account.service';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/');
	}

	let accountService = new AccountService(supabase);
	let profile = await accountService.getAccount(session.user.id);

	return { session, profile };
};

export const actions = {
	update: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			throw redirect(303, '/');
		}

		let accountService = new AccountService(supabase);
		let { data, error } = await accountService.updateAccount(session.user.id, request);

		if (error) {
			return fail(500, data);
		}

		return data;
	}
};
