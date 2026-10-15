"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { locales, type Locale } from "@/lib/locales";
import { prisma } from "@/lib/prisma";
import { aboutSchema } from "@/lib/schemas";
import { siteTextKey, type SiteTextName } from "@/lib/site-content";

export async function saveAbout(values: unknown): Promise<{ error: string }> {
  await requireAdmin();

  const parsed = aboutSchema.safeParse(values);
  if (!parsed.success) return { error: "Some fields are not valid." };

  // form shape -> rows: one per piece per language
  const { bodyEn, bodyRo, descriptionEn, descriptionRo } = parsed.data;
  const texts: [SiteTextName, Locale, string][] = [
    ["about.body", "en", bodyEn],
    ["about.body", "ro", bodyRo],
    ["about.description", "en", descriptionEn],
    ["about.description", "ro", descriptionRo],
  ];

  /*
    One transaction: all four rows are saved or none are, so the page can never
    show new English text next to old Romanian text. upsert, because the rows
    do not exist until the first save.
  */
  await prisma.$transaction(
    texts.map(([name, lang, value]) => {
      const key = siteTextKey(name, lang);
      return prisma.siteContent.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    }),
  );

  /*
    Only the About page changed, so only its HTML is thrown away, in both
    languages. Projects rebuild the whole site; this has no reason to.
  */
  for (const lang of locales) revalidatePath(`/${lang}/about`);

  return { error: "" };
}
