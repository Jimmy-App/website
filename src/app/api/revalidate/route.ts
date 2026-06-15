import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

/**
 * Sanity → Next revalidation webhook.
 * Cache tags follow `{_type}-{locale}` (see sanity/getHomePage.ts).
 * Configure the webhook to POST `{ "_type": _type, "language": language }`.
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (!process.env.SANITY_WEBHOOK_SECRET || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const body = (await request.json()) as { _type?: string; language?: string }
  const { _type, language } = body

  if (!_type) {
    return NextResponse.json({ message: 'Missing _type' }, { status: 400 })
  }

  const tags = language
    ? [`${_type}-${language}`]
    : routing.locales.map((locale) => `${_type}-${locale}`)

  // Second arg is the cacheLife profile — matches cacheLife('hours') in sanity/getHomePage.ts
  for (const tag of tags) revalidateTag(tag, 'hours')

  return NextResponse.json({ revalidated: true, tags, now: Date.now() })
}
