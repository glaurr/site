/*
  Plain constants, no server-only imports — this module is safe to import from
  client components (the locale switcher needs it). Anything that touches
  request state lives in dictionaries.ts instead
*/
export const locales = ["en", "ro"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
