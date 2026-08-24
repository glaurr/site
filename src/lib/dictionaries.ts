import { lang } from "next/root-params";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "./locales";

/* The strings are in the json dictionaries and are loaded only if rendered */
export type Dictionary = typeof import("./dictionaries/en.json");

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  ro: () => import("./dictionaries/ro.json").then((m) => m.default),
};

/*
  `lang` comes from next/root-params: because every page sits under
  app/(site)/[lang], any server component can read the current locale without
  it being threaded through props.
*/
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!value || !isLocale(value)) notFound();
  return value;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}
