import type { Locale } from "@/lib/locales";

const intlLocale: Record<Locale, string> = { en: "en-GB", ro: "ro-RO" };

export function formatPrice(value: number, lang: Locale): string {
  return new Intl.NumberFormat(intlLocale[lang], {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    ...(value >= 1
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : { maximumSignificantDigits: 4 }),
  }).format(value);
}

export function formatChange(percent: number, lang: Locale): string {
  return new Intl.NumberFormat(intlLocale[lang], {
    style: "percent",
    signDisplay: "exceptZero",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent / 100);
}

export function formatTime(iso: string, lang: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[lang], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
