import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "../../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeScript } from "@/components/theme-script";
import { getDictionary, getLocale } from "@/lib/dictionaries";
import { locales } from "@/lib/locales";
import { siteName } from "@/lib/site";

/*
  next/font downloads these at build time and serves them from our own domain,
  so there is no request to Google at runtime and no layout shift.
*/
const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-newsreader",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

/*
  Listing the locales here makes Next prerender /en and /ro at build time
  instead of rendering them per request.
*/
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return {
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
    /*
      `template` is applied to whatever title a child page sets, so pages only
      state their own name — "Projects" becomes "Projects — glaurr". `default` covers
      pages that set no title, and follows the same order.
    */
    title: {
      default: `${dict.home.role} — ${siteName}`,
      template: `%s — ${siteName}`,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLocale();
  const dict = await getDictionary();

  return (
    <html lang={lang} className={`${newsreader.variable} ${plexMono.variable}`}>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh flex flex-col">
        <SiteHeader lang={lang} dict={dict} />
        <main className="flex-1">{children}</main>
        <SiteFooter dict={dict.footer} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
