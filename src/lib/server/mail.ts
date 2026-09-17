import { env } from '$env/dynamic/private';
import nodemailer from 'nodemailer';

export interface Enquiry {
	firstName: string;
	lastName: string;
	email: string;
	subject: string;
	message: string;
	print?: string;
}

export const mailConfigured = () => Boolean(env.GMAIL_USER && env.GMAIL_APP_PASSWORD && env.CONTACT_TO_EMAIL);

const escapeHtml = (value: string) =>
	value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

export async function sendEnquiry(enquiry: Enquiry) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD }
	});

	const name = [enquiry.firstName, enquiry.lastName].filter(Boolean).join(' ');
	const lines = [
		['Name', name],
		['Email', enquiry.email],
		['Print', enquiry.print],
		['Subject', enquiry.subject]
	].filter(([, value]) => value) as [string, string][];

	await transporter.sendMail({
		from: { name: `JSaltyLens website`, address: env.GMAIL_USER! },
		to: env.CONTACT_TO_EMAIL,
		replyTo: { name, address: enquiry.email },
		subject: `[JSaltyLens] ${enquiry.subject}`,
		text: `${lines.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${enquiry.message}`,
		html: `<table>${lines
			.map(([label, value]) => `<tr><td><strong>${label}</strong></td><td>${escapeHtml(value)}</td></tr>`)
			.join('')}</table><p style="white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>`
	});
}
