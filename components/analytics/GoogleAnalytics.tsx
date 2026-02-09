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

  useEffect(() => {
    if (isJadminPage) {
      return;
    }

    const syncConsent = () => {
      const consent = getStoredCookieConsent();
      setIsEnabled(Boolean(consent?.analytics));
    };

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);

    return () =>
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);
  }, [isJadminPage]);

  if (isJadminPage || !isEnabled) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
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
