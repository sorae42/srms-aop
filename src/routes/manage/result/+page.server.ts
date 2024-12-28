import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ScoreService } from '$lib/services/score.service';

export const load: PageServerLoad = async ({ depends, locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/');
	}

	depends('score:reload');

	let scoreService = new ScoreService(supabase);
	let score = await scoreService.getScores();
	let students = await scoreService.getStudents();
	let subject = await scoreService.getSubject();

	return { session, score, students, subject };
};

export const actions = {
	create: async ({ request, locals: { supabase, getSession } }) => {
		let scoreService = new ScoreService(supabase);
		let { score, error } = await scoreService.createScore(request);
		if (error) {
			return fail(400, { score, error: true });
		}

		return score;
	},
	update: async ({ request, locals: { supabase, getSession } }) => {
		let scoreService = new ScoreService(supabase);
		let { score, error } = await scoreService.updateScore(request);

		if (error) {
			return fail(400, { score, error: true });
		}

		return score;
	}
};
