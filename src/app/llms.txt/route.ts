import { SITE_URL, DEFAULT_LOCALE } from '@/lib/seo'

// AI-crawler guide (llms.txt convention). Served at /llms.txt.
export function GET() {
  const u = (p = '') => `${SITE_URL}/${DEFAULT_LOCALE}${p}`
  const body = `# Jimmy

> The Skool of Fitness — the all-in-one coaching software for fitness coaches. Build workout programs, run a Skool-style community, message clients and get paid, all in one white-label iOS/Android app. Start free with up to 3 clients.

## Product
- [Home](${u()}): What Jimmy is, who it's for, and how it helps modern fitness coaches retain clients.
- [Pricing](${u('/pricing')}): Free for up to 3 clients (no card); Club plans from €29/mo that scale with client count.
- [Affiliate Program](${u('/affiliate')}): Earn 30% recurring commission for every fitness coach you refer.

## Resources
- [Blog](${u('/blog')}): Client retention, programming and business-growth playbooks for online coaches.
- [Changelog](${u('/changelog')}): Product updates, shipped continuously.
- [Roadmap](${u('/roadmap')}): What we're building next, shaped by the coaches who use Jimmy.

## Legal
- [Privacy Policy](${u('/privacy')})
- [Terms of Service](${u('/terms')})
- [Cookie Policy](${u('/cookie-policy')})
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
