import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Allow the dev server to be opened from other devices on the LAN (e.g. a phone,
  // or Safari hitting the machine's IP). Without this, Next.js 16 dev mode blocks
  // cross-origin `_next` requests, so client JS never hydrates and only the
  // server-rendered HTML shows (blank page). Has no effect on `next start`/production.
  allowedDevOrigins: ['192.168.18.99', '192.168.18.*', '192.168.*.*'],
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
