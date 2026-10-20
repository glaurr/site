import type { Metadata } from "next";

import { getDictionary, getLocale } from "@/lib/dictionaries";
import { Watchlist } from "./watchlist";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  const app = dict.microapps.apps.cryptoWatchlist;

  return { title: app.title, description: app.summary };
}

export default async function CryptoWatchlistPage() {
  const lang = await getLocale();
  const dict = await getDictionary();
  const labels = dict.microapps.apps.cryptoWatchlist;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-display font-normal">{labels.title}</h1>
      <p className="mt-6 max-w-[52ch] text-lg text-ink-soft">
        {labels.summary}
      </p>

      <Watchlist lang={lang} labels={labels} />

      <p className="mt-10 border-t border-rule pt-6 text-sm text-ink-soft">
        {labels.note} {labels.source}{" "}
        <a
          href="https://www.coingecko.com"
          className="underline underline-offset-4 hover:text-accent"
        >
          CoinGecko
        </a>
        .
      </p>
    </div>
  );
}
