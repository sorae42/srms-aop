import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SubjectService } from '$lib/services/subject.service';

export const load: PageServerLoad = async ({ depends, locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/');
	}

	depends('subject:reload');

	let subjectService = new SubjectService(supabase);
	let subject = await subjectService.getSubjects();

	return { session, subject };
};

export const actions = {
	create: async ({ request, locals: { supabase, getSession } }) => {
		let subjectService = new SubjectService(supabase);
		let { subject, error } = await subjectService.createSubject(request);

		if (error) {
			return fail(400, { subject, error: true });
		}
		
		return subject;
	},
	update: async ({ request, locals: { supabase, getSession } }) => {
		let subjectService = new SubjectService(supabase);
		let { subject, error } = await subjectService.updateSubject(request);

		if (error) {
			return fail(400, { subject, error: true });
		}

		return subject;
	}
};
