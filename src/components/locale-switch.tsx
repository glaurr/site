"use client"; 

/* 
  it needs usePathname() — the current URL is only known in the browser during a client navigation; it
  swaps the locale segment so /ro/projects/test stays on /en/projects/test when you switch. 
*/

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/locales";

export function LocaleSwitch({ current }: { current: Locale }) {
  const pathname = usePathname();

  return (
    <span className="label flex items-baseline gap-1.5">
      {locales.map((locale, index) => {
        const rest = pathname.split("/").slice(2).join("/");
        const href = rest ? `/${locale}/${rest}` : `/${locale}`;

        return (
          <span key={locale} className="flex items-baseline gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {locale === current ? (
              <span className="text-ink" aria-current="true">
                {locale}
              </span>
            ) : (
              <Link href={href} className="hover:text-accent">
                {locale}
              </Link>
            )}
          </span>
        );
      })}
    </span>
  );
}
