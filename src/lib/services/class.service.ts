import { responseTime } from '$lib/advices/perfTracker';
import { SupabaseClient } from '@supabase/supabase-js';

export class ClassService {
	constructor(private supabase: SupabaseClient) {}

	//@ts-ignore
	@responseTime
	async getClassList() {
		const { data: classes } = await this.supabase
			.from('class')
			.select('id, subject_id, ...subject_id(name), teacher_id, ...teacher_id(full_name)');

		const { data: subjects } = await this.supabase.from('subject').select('id, name');

		const { data: teachers } = await this.supabase
			.from('profiles')
			.select('id, full_name')
			.eq('permission', 1);

		return { classes, subjects, teachers };
	}

	//@ts-ignore
	@responseTime
	async updateClass(request: Request) {
		const formData = await request.formData();

		let classInput = {
			id: formData.get('id'),
			subject_id: formData.get('subject_id'),
			teacher_id: formData.get('teacher_id')
		};

		let { error } = await this.supabase.from('class').upsert(classInput);

		return { error };
	}

	//@ts-ignore
	@responseTime
	async deleteClass(request: Request) {
		const formData = await request.formData();

		let { error } = await this.supabase.from('class').delete().eq('id', formData.get('id'));

		return { error };
	}
}
