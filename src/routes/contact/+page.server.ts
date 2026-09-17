import { fail } from '@sveltejs/kit';
import { contactImage } from '$lib/data/home';
import { getPrint, prints } from '$lib/data/prints';
import { image } from '$lib/server/images';
import { mailConfigured, sendEnquiry } from '$lib/server/mail';

export const prerender = false;

const limits = { name: 80, email: 254, subject: 150, message: 5000 };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const load = ({ url }) => {
	const print = getPrint(url.searchParams.get('print') ?? '');
	return {
		image: image(contactImage),
		prints: prints.map(({ slug, title }) => ({ slug, title })),
		selectedPrint: print?.slug ?? '',
		defaultSubject: print ? `Print enquiry: ${print.title}` : ''
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const field = (name: string) => String(form.get(name) ?? '').trim();

		const values = {
			firstName: field('firstName'),
			lastName: field('lastName'),
			email: field('email'),
			subject: field('subject'),
			message: field('message'),
			print: field('print')
		};

		if (field('company')) return { success: true };

		const errors: Partial<Record<keyof typeof values, string>> = {};
		if (!values.firstName) errors.firstName = 'Please enter your first name.';
		else if (values.firstName.length > limits.name) errors.firstName = 'That name is too long.';
		if (values.lastName.length > limits.name) errors.lastName = 'That name is too long.';
		if (!emailPattern.test(values.email) || values.email.length > limits.email)
			errors.email = 'Please enter a valid email address.';
		if (!values.subject) errors.subject = 'Please add a subject.';
		else if (values.subject.length > limits.subject) errors.subject = 'Please shorten the subject.';
		if (!values.message) errors.message = 'Please write a message.';
		else if (values.message.length > limits.message) errors.message = 'Please shorten your message.';

		if (Object.keys(errors).length) return fail(400, { values, errors });

		if (!mailConfigured()) {
			console.error('Contact form: GMAIL_USER, GMAIL_APP_PASSWORD or CONTACT_TO_EMAIL is not set');
			return fail(503, { values, errors, unavailable: true });
		}

		try {
			await sendEnquiry({ ...values, print: getPrint(values.print)?.title });
		} catch (error) {
			console.error('Contact form: failed to send email', error);
			return fail(502, { values, errors, unavailable: true });
		}

		return { success: true };
	}
};
