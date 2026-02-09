export const COOKIE_CONSENT_STORAGE_KEY = "cookie-consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "open-cookie-settings";
export const COOKIE_CONSENT_UPDATED_EVENT = "cookie-consent-updated";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseCookieConsent(value: string | null): CookieConsent | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) {
      return null;
    }

    const candidate = parsed as Record<string, unknown>;
    if (
      typeof candidate.analytics !== "boolean" ||
      typeof candidate.marketing !== "boolean"
    ) {
      return null;
    }

    return {
      necessary: true,
      analytics: candidate.analytics,
      marketing: candidate.marketing,
      updatedAt:
        typeof candidate.updatedAt === "string"
          ? candidate.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function getStoredCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
}

export function saveCookieConsent(input: {
  analytics: boolean;
  marketing: boolean;
}): CookieConsent | null {
  if (typeof window === "undefined") {
    return null;
  }

  const payload: CookieConsent = {
    necessary: true,
    analytics: input.analytics,
    marketing: input.marketing,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(COOKIE_CONSENT_UPDATED_EVENT));

  return payload;
}
