import type { Metadata } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  // Load the variable font WITH the optical-size axis (opsz 12..96) so large
  // display headings get the condensed display cut (font-optical-sizing: auto).
  // Pinning discrete `weight`s would drop the opsz axis and widen headlines.
  axes: ['opsz'],
  variable: '--font-bricolage',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Jimmy',
    default: 'Jimmy — The Skool of Fitness',
  },
  description:
    'Jimmy is the retention platform for modern fitness coaches — structured workouts, community, payments, and a white-label app for your members.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${bricolage.variable} ${inter.variable}`}
    >
      <body>
        {children}
        {/* Vercel first-party, cookieless metrics — load after hydration,
            non-blocking, no consent needed (no personal data / cookies). */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
