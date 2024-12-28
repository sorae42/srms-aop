import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { ClassService } from '$lib/services/class.service';

export const load: PageServerLoad = async ({ depends, locals: { supabase, getSession } }) => {
	const session = await getSession();
	depends('class:reload');

	if (!session) {
		throw redirect(303, '/');
	}

	let classService = new ClassService(supabase);
	let data = await classService.getClassList();

	return { session, ...data };
};

export const actions = {
	upsert: async ({ locals: { supabase }, request }) => {
		let classService = new ClassService(supabase);
		let { error } = await classService.updateClass(request);

		if (error) {
			return fail(400, { error: true });
		}
	},

	delete: async ({ locals: { supabase }, request }) => {
		let classService = new ClassService(supabase);
		let { error } = await classService.deleteClass(request);
		if (error) {
			return fail(400, { error: true });
		}
	}
} satisfies Actions;
