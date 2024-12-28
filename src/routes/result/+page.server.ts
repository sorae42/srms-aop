// @ts-nocheck - Using undocumented TS method from Supabase
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ScoreService } from '$lib/services/score.service';

const rating = ["F", "D", "C", "B", "A"];

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/');
	}

	let scoreService = new ScoreService(supabase);
	let score = await scoreService.getScoreById(session.user.id);
	
	score?.forEach((e) => {
		let total = e.total;
		e.total_four = (total / 10) * 4;
		e.total_rating = rating[Math.trunc(e.total_four)];
	})

	return { session, score };
};