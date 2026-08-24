import type { Locale } from "./locales";

/*
  "Mar 2024 — Present". Intl does the month name, so Romanian gets Romanian
  months without a translation table.
*/
export function formatPeriod(
  start: Date,
  end: Date | null,
  lang: Locale,
  presentLabel: string,
): string {
  const format = new Intl.DateTimeFormat(lang === "ro" ? "ro-RO" : "en-GB", {
    month: "short",
    year: "numeric",
  });

  return `${format.format(start)} — ${end ? format.format(end) : presentLabel}`;
}
