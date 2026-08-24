import Link from "next/link";
import type { Metadata } from "next";

import { getDictionary, getLocale } from "@/lib/dictionaries";
import { siteName } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  // no `title` here: the layout's default already reads "Developer — glaurr".
  return {
    description: dict.home.intro,
    openGraph: {
      title: `${dict.home.role} — ${siteName}`,
      description: dict.home.intro,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const lang = await getLocale();
  const dict = await getDictionary();

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="border-b border-rule py-20">
        <h1 className="max-w-[20ch] text-display font-normal">{siteName}</h1>
        <p className="mt-6 max-w-[52ch] text-lg text-ink-soft">
          {dict.home.intro}
        </p>
      </section>

      <section className="py-14">
        <h2 className="label">{dict.home.selectedProjects}</h2>
        <p className="mt-6 text-ink-soft">{dict.home.empty}</p>
        <p className="mt-8">
          <Link
            href={`/${lang}/projects`}
            className="font-mono text-sm text-accent underline underline-offset-4"
          >
            {dict.home.viewAll}
          </Link>
        </p>
      </section>
    </div>
  );
}
