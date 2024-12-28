import { responseTime } from "$lib/advices/perfTracker";
import { SupabaseClient } from "@supabase/supabase-js";

export class SubjectService {
	constructor(private supabase: SupabaseClient) {}

    //@ts-ignore
    @responseTime
	async getSubjects() {
		const { data: subject } = await this.supabase
			.from('subject')
			.select(`id, name, credits`)
			.order('id', { ascending: true });

		return subject;
	}

    //@ts-ignore
    @responseTime
    async createSubject(request: Request) {
        const data = await request.formData();
		const name = data.get('subject');
		const credits = data.get('credits');

		let subject = {
			name,
			credits
		};

		const { error } = await this.supabase.from('subject').insert({
			...subject,
			updated_at: new Date()
		});

        return { subject, error };
    }

    //@ts-ignore
    @responseTime
    async updateSubject(request: Request) {
        const data = await request.formData();
		const id = await data.get('id');
		const name = await data.get('subject');
		const credits = await data.get('credits');

		const subject = {
			id,
			name,
			credits
		};

		const { error } = await this.supabase.from('subject').upsert({
			...subject,
			updated_at: new Date()
		});

        return { subject, error };
    }
}
