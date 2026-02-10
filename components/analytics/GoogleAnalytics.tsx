"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  getStoredCookieConsent,
} from "@/lib/cookie-consent";

type GoogleAnalyticsProps = {
  measurementId: string;
};

const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  const pathname = usePathname();
  const isJadminPage = pathname?.startsWith("/jadmin");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState<boolean | null>(null);

  useEffect(() => {
    if (isJadminPage) {
      return;
    }

    const userAgent = window.navigator.userAgent;
    const isSafari =
      /Safari/i.test(userAgent) &&
      !/Chrome|Chromium|CriOS|FxiOS|Edg|OPR|SamsungBrowser|Android/i.test(
        userAgent,
      );
    setIsSafariBrowser(isSafari);

    const syncConsent = () => {
      const consent = getStoredCookieConsent();
      setIsEnabled(Boolean(consent?.analytics));
    };

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);

    return () =>
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);
  }, [isJadminPage]);

  if (isJadminPage || !isEnabled || isSafariBrowser === null) {
    return null;
  }
  const scriptStrategy = isSafariBrowser ? "lazyOnload" : "afterInteractive";

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy={scriptStrategy}
      />
      <Script id="google-analytics" strategy={scriptStrategy}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
