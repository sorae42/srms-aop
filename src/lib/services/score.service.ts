import { responseTime } from '$lib/advices/perfTracker';
import { SupabaseClient } from '@supabase/supabase-js';

export class ScoreService {
	constructor(private supabase: SupabaseClient) {}

	//@ts-ignore
	@responseTime
	async getScores() {
		const { data: score } = await this.supabase
			.from('score')
			.select(
				'id, student_id, ...student_id(student_id, full_name), subject_id, ...subject_id(name), progress, mid_term, last_term, total'
			)
			.order('id', { ascending: true });

		return score;
	}

	//@ts-ignore
	@responseTime
	async getScoreById(id: string) {
		const { data: score } = await this.supabase
			.from('score')
			.select(`id, ...subject_id(name, credits), progress, mid_term, last_term, total`)
			.eq('student_id', id);

		return score;
	}

	//@ts-ignore
	@responseTime
	async getStudents() {
		const { data: students } = await this.supabase
			.from('profiles')
			.select('id, full_name, student_id')
			.eq('permission', 0);

		return students;
	}

	//@ts-ignore
	@responseTime
	async getSubject() {
		const { data: subject } = await this.supabase.from('subject').select('id, name ');

		return subject;
	}

	//@ts-ignore
	@responseTime
	async createScore(request: Request) {
		const data = await request.formData();
		const student_id = await data.get('student_id');
		const subject_id = await data.get('subject_id');
		const progress = await data.get('progress');
		const mid_term = await data.get('mid_term');
		const last_term = await data.get('last_term');
		const total = await data.get('total');

		let score = {
			student_id,
			subject_id,
			progress,
			mid_term,
			last_term,
			total
		};

		const { error } = await this.supabase.from('score').insert({
			...score,
			updated_at: new Date()
		});

		return { score, error };
	}

	//@ts-ignore
	@responseTime
	async updateScore(request: Request) {
		const data = await request.formData();
		const id = await data.get('score_id');
		const subject_id = await data.get('subject_id');
		const progress = await data.get('progress');
		const mid_term = await data.get('mid_term');
		const last_term = await data.get('last_term');
		const total = await data.get('total');
		const score = {
			id,
			subject_id,
			progress,
			mid_term,
			last_term,
			total
		};

		const { error } = await this.supabase
			.from('score')
			.update({
				...score,
				updated_at: new Date()
			})
			.eq('id', id);

		return { score, error };
	}
}
