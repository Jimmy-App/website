import { type NextRequest, NextResponse } from 'next/server'

/**
 * Waitlist capture → Loops.
 *
 * Everyone who lands here is a `subscriber`: no Jimmy account, arrived through
 * a form on the marketing site. That is the one audience whose marketing
 * consent is unambiguous — they typed their address into a box asking for
 * exactly this — which is why they go straight onto a mailing list, unlike
 * coaches, who were imported.
 *
 * Shared by every form on the site; `source` is what tells them apart
 * (coach-brain-waitlist, white-glove, …).
 */

const LOOPS_ENDPOINT = 'https://app.loops.so/api/v1/contacts/update'

/** Only sources we actually ship. An open field would let anyone write junk. */
const ALLOWED_SOURCES = new Set(['coach-brain-waitlist', 'white-glove'])

// Deliberately loose: the real check is Loops accepting it, and a regex that
// rejects a valid address is worse than one that lets a typo through.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Body = {
  email?: unknown
  source?: unknown
  /** Honeypot. Real people never see this field, so anything in it is a bot. */
  company?: unknown
}

export async function POST(request: NextRequest) {
  let body: Body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  // Bots fill every input they find. Answer 200 so they cannot tell the
  // honeypot apart from a success and start probing for the real shape.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  const source = typeof body.source === 'string' ? body.source : ''
  if (!ALLOWED_SOURCES.has(source)) {
    return NextResponse.json({ error: 'invalid_source' }, { status: 400 })
  }

  const apiKey = process.env.LOOPS_API_KEY
  const listId = process.env.LOOPS_LIST_PRODUCT_UPDATES
  if (!apiKey) {
    console.error('[waitlist] LOOPS_API_KEY is not set')
    return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  }

  try {
    // PUT /contacts/update upserts, so a second submission is a no-op rather
    // than a 409 — people do resubmit forms.
    const res = await fetch(LOOPS_ENDPOINT, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        source,
        userGroup: 'subscriber',
        subscribed: true,
        ...(listId ? { mailingLists: { [listId]: true } } : {}),
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[waitlist] Loops rejected:', res.status, detail.slice(0, 200))
      return NextResponse.json({ error: 'upstream' }, { status: 502 })
    }
  } catch (err) {
    console.error('[waitlist] Loops unreachable:', (err as Error).message)
    return NextResponse.json({ error: 'upstream' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
