import { redirect } from "@sveltejs/kit";
import { AccountService } from "$lib/services/account.service.js";

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/');
	}

	let accountService = new AccountService(supabase);
	let profile = await accountService.getAccount(session.user.id);

	return { session, profile };
};