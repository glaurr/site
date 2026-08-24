import Link from "next/link";

import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";
import { siteName } from "@/lib/site";
import { LocaleSwitch } from "./locale-switch";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-3xl flex-wrap items-baseline justify-between gap-x-6 gap-y-3 px-6 py-5">
        <Link href={`/${lang}`} className="font-mono text-sm hover:text-accent">
          {siteName}
        </Link>

        <nav className="flex items-baseline gap-6">
          <Link href={`/${lang}/projects`} className="label hover:text-accent">
            {dict.nav.projects}
          </Link>
          <Link href={`/${lang}/about`} className="label hover:text-accent">
            {dict.nav.about}
          </Link>
          <Link href={`/${lang}/microapps`} className="label hover:text-accent">
            {dict.nav.microapps}
          </Link>
          <LocaleSwitch current={lang} />
          <ThemeToggle labels={dict.theme} />
        </nav>
      </div>
    </header>
  );
}
