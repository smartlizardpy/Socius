import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';

export const prerender = false;

// Kept in sync with the <select> in CloseCta.astro. Anything else is stored as null
// rather than rejected — a wrong neighbourhood should never cost us the address.
const SEMTLER = new Set(['kadikoy', 'moda', 'caddebostan', 'diger']);

// Deliberately loose. The only thing worth rejecting here is something that cannot be
// an address at all; anything stricter starts throwing away real people's real emails.
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;

const reply = (status: number, body: Record<string, unknown>) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});

// The enhanced form asks for JSON explicitly. A plain browser form post (JS off or still
// loading) does not, and must not be shown a page of raw JSON — send it to a real page.
const wantsJson = (request: Request) =>
	(request.headers.get('accept') ?? '').includes('application/json');

const seeOther = (location: string) => new Response(null, { status: 303, headers: { location } });

export const POST: APIRoute = async ({ request }) => {
	const url = import.meta.env.DATABASE_URL;
	if (!url) {
		console.error('[beta] DATABASE_URL is not set');
		return wantsJson(request)
			? reply(500, { ok: false, error: 'yapilandirma' })
			: seeOther('/tesekkurler?durum=hata');
	}

	let email = '';
	let semt: string | null = null;
	let trap = '';

	const type = request.headers.get('content-type') ?? '';
	if (type.includes('application/json')) {
		const body = await request.json().catch(() => ({}));
		email = String(body.email ?? '');
		semt = body.semt ? String(body.semt) : null;
		trap = String(body.website ?? '');
	} else {
		const form = await request.formData();
		email = String(form.get('email') ?? '');
		semt = form.get('semt') ? String(form.get('semt')) : null;
		trap = String(form.get('website') ?? '');
	}

	// Honeypot: a real person never fills a field they cannot see. Answer 200 so a bot
	// gets no signal that it was caught.
	if (trap.trim() !== '') {
		return wantsJson(request) ? reply(200, { ok: true }) : seeOther('/tesekkurler');
	}

	email = email.trim().toLowerCase();
	if (!looksLikeEmail(email)) {
		return wantsJson(request)
			? reply(400, { ok: false, error: 'gecersiz-eposta' })
			: seeOther('/tesekkurler?durum=gecersiz');
	}

	semt = semt && SEMTLER.has(semt) ? semt : null;

	try {
		const sql = neon(url);
		// A second signup from the same address is a success, not an error — the person
		// asking twice wants in, and telling them "already on the list" leaks the list.
		await sql`
			insert into beta_signups (email, semt, source)
			values (${email}, ${semt}, 'landing')
			on conflict (email) do update
				set semt = coalesce(excluded.semt, beta_signups.semt)
		`;
		return wantsJson(request) ? reply(200, { ok: true }) : seeOther('/tesekkurler');
	} catch (err) {
		console.error('[beta] insert failed', err);
		return wantsJson(request)
			? reply(500, { ok: false, error: 'kayit-basarisiz' })
			: seeOther('/tesekkurler?durum=hata');
	}
};

// A GET here is almost always someone poking at the URL; say so rather than 404.
export const GET: APIRoute = () => reply(405, { ok: false, error: 'sadece-post' });
