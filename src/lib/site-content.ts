import { prisma } from "./prisma";
import type { Locale } from "./locales";

/*
  SiteContent holds the bits of the site that are text rather than records.
  One row per piece per language, and the key is the piece's name plus the
  locale: "about.body.en", "about.body.ro".

  Like projects.ts, the public reads run at build time, not per visit, and
  admin writes revalidate the pages afterwards.
*/

// every piece the site knows about. A key not built from this list is a typo.
export const siteTextNames = ["about.body", "about.description"] as const;

export type SiteTextName = (typeof siteTextNames)[number];

// the only place a key is put together, for reads here and writes in actions
export function siteTextKey(name: SiteTextName, lang: Locale) {
  return `${name}.${lang}`;
}

// public site: one piece in one language, null when it has not been written yet
export async function getSiteText(
  name: SiteTextName,
  lang: Locale,
): Promise<string | null> {
  const row = await prisma.siteContent.findUnique({
    where: { key: siteTextKey(name, lang) },
    select: { value: true },
  });

  return row?.value ?? null;
}

// admin form: both languages in one query, "" for anything not written yet
export async function getSiteTextForAdmin(name: SiteTextName) {
  const rows = await prisma.siteContent.findMany({
    where: { key: { in: [siteTextKey(name, "en"), siteTextKey(name, "ro")] } },
    select: { key: true, value: true },
  });

  const byKey = new Map(rows.map((row) => [row.key, row.value]));
  const value = (lang: Locale) => byKey.get(siteTextKey(name, lang)) ?? "";

  return { en: value("en"), ro: value("ro") };
}
