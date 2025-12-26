import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, supportedLocales } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;
const LOCALE_ALIASES: Record<string, string> = {
  uk: "ua",
  ru: "ua",
};

function getPreferredLocale(acceptLanguage: string | null) {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const preferences = acceptLanguage
    .split(",")
    .map((entry) => {
      const [tag, qValue] = entry.trim().split(";q=");
      const q = qValue ? Number.parseFloat(qValue) : 1;
      return { tag: tag.toLowerCase(), q };
    })
    .filter(({ tag }) => tag && tag !== "*")
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferences) {
    const base = tag.split("-")[0];
    const mapped = LOCALE_ALIASES[base] || base;
    if (supportedLocales.includes(mapped as (typeof supportedLocales)[number])) {
      return mapped;
    }
  }

  return defaultLocale;
}

function hasLocalePrefix(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return false;
  }
  return supportedLocales.includes(segments[0] as (typeof supportedLocales)[number]);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/jadmin") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (hasLocalePrefix(pathname)) {
    return NextResponse.next();
  }

  const preferredLocale = getPreferredLocale(
    request.headers.get("accept-language"),
  );
  const redirectUrl = request.nextUrl.clone();
  const suffix = pathname === "/" ? "" : pathname;
  redirectUrl.pathname = `/${preferredLocale}${suffix}`;
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!_next|api|jadmin|.*\\..*).*)"],
};
