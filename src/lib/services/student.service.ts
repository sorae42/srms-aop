import { responseTime } from "$lib/advices/perfTracker";
import { SupabaseClient } from "@supabase/supabase-js";

export class StudentService {
    constructor(private supabase: SupabaseClient) {}

    // @ts-ignore
    @responseTime
    async getStudent() {
        const { data: students } = await this.supabase.from('profiles').select().eq('permission', 0);
        return students;
    }

}