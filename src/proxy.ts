import { NextResponse, type NextRequest } from "next/server";

/*
  only handles locale routing:
  /projects becomes /en/projects — so that every page can live under app/[lang] and always know its locale.
*/
const locales = ["en", "ro"] as const;
const defaultLocale = "en";

function preferredLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  // "ro-RO,ro;q=0.9,en;q=0.8" -> ["ro-ro", "ro", "en"], best first.
  const accepted = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.slice(2)) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of accepted) {
    const base = tag.split("-")[0];
    const match = locales.find((locale) => locale === base);
    if (match) return match;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /*
    Skip Next internals, the admin panel (single-language) and anything with a
    file extension (favicon.ico, robots.txt, sitemap.xml, uploads).
  */
  matcher: ["/((?!_next|admin|api|.*\\.[\\w]+$).*)"],
};
