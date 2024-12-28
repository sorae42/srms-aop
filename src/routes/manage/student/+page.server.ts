import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';

import { PUBLIC_SECRET_ROLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { StudentService } from '$lib/services/student.service';

export const load: PageServerLoad = async ({ depends, locals: { supabase, getSession } }) => {
	const session = await getSession();

	depends('student:reload');

	if (!session) {
		throw redirect(303, '/');
	}

	let studentService = new StudentService(supabase);
	let students = await studentService.getStudent();

	return { session, students };
};

export const actions = {
	update: async ({ locals: { supabase }, request }) => {
		const formData = await request.formData();

		let ID: any;
		const isInserting: boolean = formData.get('id') === 'undefined';

		if (isInserting) {
			// Yes, I did it. God dammit.
			// I don't want to put this in +layout, as this is not what we want to do
			const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SECRET_ROLE_KEY);

			const userEmail = formData.get('email')?.toString();
			const userPassword = formData.get('password')?.toString();

			await supabaseAdmin.auth.admin.createUser({
				email: userEmail,
				password: userPassword,
				email_confirm: true
			});

			let list = (await supabaseAdmin.auth.admin.listUsers()).data.users;
			let userID;
			for (let row of list) {
				if (row.email == userEmail) {
					userID = row.id;
					break;
				}
			}

			ID = userID;
		} else {
			ID = formData.get('id');
		}

		let profile = {
			id: ID,
			student_id: formData.get('student_id'),
			full_name: formData.get('full_name'),
			date_of_birth: formData.get('date_of_birth'),
			gender: formData.get('gender'),
			address: formData.get('address'),
			phone_number: formData.get('phone_number'),
			class_name: formData.get('class_name'),
			school_year: formData.get('school_year'),
			permission: 0
		};

		let { error } = await supabase.from('profiles').upsert(profile);

		if (error) {
			return fail(400, { error: true });
		}
	},

	delete: async ({ locals: { supabase }, request }) => {
		const formData = await request.formData();
		const ID: any = formData.get('id');

		const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SECRET_ROLE_KEY);

		let { error } = await supabaseAdmin.auth.admin.deleteUser(ID);

		if (error) {
			return fail(400, { error: true });
		}
	}
} satisfies Actions;
