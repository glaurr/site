import type { Metadata } from "next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getDictionary, getLocale } from "@/lib/dictionaries";
import { getSiteText } from "@/lib/site-content";
import { siteName } from "@/lib/site";

/*
  Written from /admin/about. Like the project pages, this is rendered to HTML
  at build time, once per locale, and rebuilt only when the admin saves it.
*/
export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  const description = await getSiteText(
    "about.description",
    await getLocale(),
  );

  // before the first save there is no description: none beats a placeholder
  if (!description) return { title: dict.about.title };

  return {
    title: dict.about.title,
    description,
    openGraph: {
      title: `${dict.about.title} — ${siteName}`,
      description,
      type: "profile",
    },
  };
}

export default async function AboutPage() {
  const lang = await getLocale();
  const dict = await getDictionary();
  const body = await getSiteText("about.body", lang);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-display font-normal">{dict.about.title}</h1>

      {/* same Markdown rendering as the project pages: no raw HTML, no JS shipped */}
      {body ? (
        <div className="prose mt-10">
          <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
        </div>
      ) : (
        <p className="mt-8 text-ink-soft">{dict.about.placeholder}</p>
      )}
    </div>
  );
}
