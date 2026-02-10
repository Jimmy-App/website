"use client";

import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";

const SpeedInsightsClient = () => {
  const pathname = usePathname();
  const isJadminPage = pathname?.startsWith("/jadmin");
  const [isReadyToLoad, setIsReadyToLoad] = useState(false);
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

    if (!isSafari) {
      setIsReadyToLoad(true);
      return;
    }

    let timeoutId: number | undefined;
    const deferUntilLoaded = () => {
      timeoutId = window.setTimeout(() => {
        setIsReadyToLoad(true);
      }, 1200);
    };

    if (document.readyState === "complete") {
      deferUntilLoaded();
    } else {
      window.addEventListener("load", deferUntilLoaded, { once: true });
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener("load", deferUntilLoaded);
    };
  }, [isJadminPage]);

  if (isJadminPage || isSafariBrowser === null || !isReadyToLoad) {
    return null;
  }

  return <SpeedInsights />;
};

export default SpeedInsightsClient;
