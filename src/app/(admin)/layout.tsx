import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";

import "../globals.css";
import { ThemeScript } from "@/components/theme-script";

/*
  The admin panel has its own root layout because it sits outside app/(site),
  where every route is prefixed with a locale. Admin is single-language and has
  no reason to carry /en or /ro in its URLs - i can use en only
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

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s — Admin",
  },
  // keep the panel out of search results even if a URL leaks
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} ${plexMono.variable}`}>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
