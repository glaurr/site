import Link from "next/link";
import type { Metadata } from "next";

import { getDictionary, getLocale } from "@/lib/dictionaries";
import { microapps } from "@/lib/microapps";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.microapps.title };
}

export default async function MicroappsPage() {
  const lang = await getLocale();
  const dict = await getDictionary();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-display font-normal">{dict.microapps.title}</h1>

      {microapps.length === 0 ? (
        <p className="mt-10 text-ink-soft">{dict.microapps.placeholder}</p>
      ) : (
        <ul className="mt-12">
          {microapps.map((app) => {
            const text = dict.microapps.apps[app.key];

            return (
              <li key={app.slug} className="border-t border-rule">
                <Link
                  href={`/${lang}/microapps/${app.slug}`}
                  className="group block py-8"
                >
                  <h2 className="text-2xl group-hover:text-accent">
                    {text.title}
                  </h2>
                  <p className="mt-2 max-w-[56ch] text-ink-soft">
                    {text.summary}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
