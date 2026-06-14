import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const body = await request.json() as { _type?: string; language?: string }
  const { _type, language } = body

  if (!_type) {
    return NextResponse.json({ message: 'Missing _type' }, { status: 400 })
  }

  if (language) {
    revalidateTag(`${_type}-${language}`, 'hours')
  } else {
    revalidateTag(_type, 'hours')
  }

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
