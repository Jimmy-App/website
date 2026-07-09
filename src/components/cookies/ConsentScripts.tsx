'use client'

import Script from 'next/script'
import type { StoredConsent } from '@/lib/cookieConsent'

/**
 * Loads category-gated third-party trackers ONLY after matching consent.
 * IDs come from env (add when ready) — until then nothing loads, but the
 * plumbing is in place: set NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_META_PIXEL_ID and
 * the scripts activate the moment the visitor consents.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export function ConsentScripts({ consent }: { consent: StoredConsent | null }) {
  const analytics = !!consent?.analytics
  const marketing = !!consent?.marketing

  return (
    <>
      {GA_ID && analytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {PIXEL_ID && marketing && (
        // Marketing pixel is the least time-critical — defer to browser idle so
        // it never competes with content for the initial load.
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  )
}
