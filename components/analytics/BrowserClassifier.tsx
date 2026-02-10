"use client";

import { useEffect } from "react";

const BrowserClassifier = () => {
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isSafari =
      /Safari/i.test(ua) &&
      !/Chrome|Chromium|CriOS|FxiOS|Edg|OPR|SamsungBrowser|Android/i.test(ua);

    if (isSafari) {
      document.documentElement.classList.add("browser-safari");
    }

    return () => {
      if (isSafari) {
        document.documentElement.classList.remove("browser-safari");
      }
    };
  }, []);

  return null;
};

export default BrowserClassifier;
