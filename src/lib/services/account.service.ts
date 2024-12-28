import { responseTime } from '$lib/advices/perfTracker';
import { SupabaseClient } from '@supabase/supabase-js';

export class AccountService {
	constructor(private supabase: SupabaseClient) {}

	// @ts-ignore
	@responseTime
	async getAccount(id: string) {
		const { data: profile } = await this.supabase
			.from('profiles')
			.select(`full_name, date_of_birth, gender, address, phone_number`)
			.eq('id', id)
			.single();
		return profile;
	}

	// @ts-ignore
	@responseTime
	async updateAccount(id: string, request: Request) {
		const formData = await request.formData();
		const fields: string[] = ['full_name', 'date_of_birth', 'gender', 'phone_number'];

		const data: Record<string, string | boolean> = {};

		for (const field of fields) {
			const value = formData.get(field);
			if (value !== null && value !== undefined) {
				data[field] = value as string;
			}
		}

		data.gender = data.gender === 'men';

		const { error } = await this.supabase.from('profiles').upsert({
			id,
			...data,
			updated_at: new Date()
		});

		return { data, error };
	}
}
