import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body.want !== 'string' || body.want.trim().length < 8) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Simple sanitization
    const record = {
      name: typeof body.name === 'string' ? body.name.slice(0, 120) : undefined,
      email: typeof body.email === 'string' ? body.email.slice(0, 160) : undefined,
      category: String(body.category || 'Other').slice(0, 60),
      want: String(body.want).slice(0, 3000),
      why: typeof body.why === 'string' ? body.why.slice(0, 3000) : undefined,
      urgency: typeof body.urgency === 'string' ? body.urgency.slice(0, 40) : undefined,
      budget: typeof body.budget === 'string' ? body.budget.slice(0, 20) : undefined,
      tags: Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).slice(0, 40)).slice(0, 20) : undefined,
      consent: Boolean(body.consent),
      submittedAt: new Date().toISOString(),
      userAgent: req.headers.get('user-agent') || undefined,
      referer: req.headers.get('referer') || undefined,
      ip: req.headers.get('x-forwarded-for') || undefined
    };

    // Optional: forward to a webhook if provided
    const webhook = process.env.WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'survey.submission', data: record })
        });
      } catch (err) {
        // Swallow webhook errors to avoid blocking the UX
        console.error('Webhook forwarding failed', err);
      }
    }

    // Log to server logs for quick access in Vercel console
    console.log('Survey submission', record);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}
