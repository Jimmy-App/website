import type { SupportedLocale } from "@/lib/i18n";

export const PRICING_CURRENCIES = ["usd", "eur", "gbp"] as const;
export type PricingCurrency = (typeof PRICING_CURRENCIES)[number];
export type PricingPlanPrices = Partial<Record<PricingCurrency, number | string>>;

const DEFAULT_CURRENCY_BY_LOCALE: Record<SupportedLocale, PricingCurrency> = {
  en: "usd",
  fr: "eur",
  es: "eur",
  ua: "eur",
};

const CURRENCY_SYMBOLS: Record<PricingCurrency, string> = {
  usd: "$",
  eur: "€",
  gbp: "£",
};

export function resolvePricingCurrency(
  currency: string | null | undefined,
  locale?: SupportedLocale,
): PricingCurrency {
  const normalized = (currency || "").toLowerCase() as PricingCurrency;
  if (PRICING_CURRENCIES.includes(normalized)) {
    return normalized;
  }

  if (locale) {
    return DEFAULT_CURRENCY_BY_LOCALE[locale] || "usd";
  }

  return "usd";
}

export function parseNumericPrice(value: string | undefined | null): number | null {
  if (!value) return null;

  const match = value.match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return null;

  const amount = Number.parseFloat(match[0].replace(",", "."));
  if (Number.isNaN(amount)) return null;

  return amount;
}

export function parseNumericAmount(value: number | string | undefined | null): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    return parseNumericPrice(value);
  }

  return null;
}

export function resolvePlanAmount({
  prices,
  currency,
  fallbackPrice,
}: {
  prices?: PricingPlanPrices | null;
  currency: PricingCurrency;
  fallbackPrice?: string | null;
}): number | null {
  const fromCurrency = parseNumericAmount(prices?.[currency]);
  if (fromCurrency !== null) {
    return fromCurrency;
  }

  return parseNumericPrice(fallbackPrice);
}

export function formatPriceValue(amount: number, currency: PricingCurrency) {
  const symbol = CURRENCY_SYMBOLS[currency];
  const normalized = Number.isInteger(amount) ? `${amount}` : amount.toFixed(2);
  return `${symbol}${normalized}`;
}
