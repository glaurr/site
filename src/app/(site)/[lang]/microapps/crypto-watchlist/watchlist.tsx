"use client";

import { useEffect, useState } from "react";

import type { Coin, Markets } from "@/lib/crypto";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";
import { formatChange, formatPrice, formatTime } from "./format";
import { Sparkline } from "./sparkline";

type Labels = Dictionary["microapps"]["apps"]["cryptoWatchlist"];

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; markets: Markets };

const PLACEHOLDER_ROWS = 10;

/*
  Prices are fetched in the browser, not at build time: they go stale in
  minutes, and the coins shown will come from this browser's saved list,
  which the server never sees.
*/
export function Watchlist({ lang, labels }: { lang: Locale; labels: Labels }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchMarkets(controller.signal).then(
      (markets) => setState({ status: "ready", markets }),
      () => {
        if (!controller.signal.aborted) setState({ status: "error" });
      },
    );

    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }

  if (state.status === "error") {
    return (
      <div role="alert" className="mt-12 border-t border-rule pt-6">
        <p className="text-ink-soft">{labels.error}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-4 cursor-pointer font-mono text-sm text-accent underline underline-offset-4"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  const coins = state.status === "ready" ? pick(state.markets) : [];

  return (
    <div className="mt-12">
      <p className="label">
        {state.status === "ready" ? (
          `${labels.asOf} ${formatTime(state.markets.updatedAt, lang)}`
        ) : (
          <span role="status">{labels.loading}</span>
        )}
      </p>

      <table className="mt-4 w-full" aria-busy={state.status === "loading"}>
        <caption className="sr-only">{labels.caption}</caption>
        <thead>
          <tr className="label">
            <th scope="col" className="pb-3 text-left font-normal">
              {labels.columns.coin}
            </th>
            <th scope="col" className="pb-3 pl-4 text-right font-normal">
              {labels.columns.price}
            </th>
            <th scope="col" className="pb-3 pl-4 text-right font-normal">
              {labels.columns.change24h}
            </th>
            <th
              scope="col"
              className="hidden pb-3 pl-6 text-right font-normal sm:table-cell"
            >
              {labels.columns.trend7d}
            </th>
          </tr>
        </thead>

        <tbody>
          {state.status === "loading"
            ? Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
                <PlaceholderRow key={index} />
              ))
            : coins.map((coin) => (
                <tr key={coin.id} className="border-t border-rule">
                  <td className="py-4 pr-4">
                    <span className="block leading-snug">{coin.name}</span>
                    <span className="label">{coin.symbol}</span>
                  </td>
                  <td className="py-4 pl-4 text-right font-mono text-sm tabular-nums">
                    {formatPrice(coin.price, lang)}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 text-right font-mono text-sm tabular-nums">
                    <Change value={coin.change24h} lang={lang} />
                  </td>
                  <td className="hidden py-4 pl-6 sm:table-cell">
                    <div className="flex justify-end">
                      <Sparkline
                        points={coin.sparkline}
                        label={
                          coin.change7d === null
                            ? labels.trendLabel
                            : `${labels.trendLabel}: ${formatChange(coin.change7d, lang)}`
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

async function fetchMarkets(signal: AbortSignal): Promise<Markets> {
  const response = await fetch("/api/crypto/markets", { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function pick(markets: Markets): Coin[] {
  const byId = new Map(markets.coins.map((coin) => [coin.id, coin]));
  return markets.defaultIds.flatMap((id) => byId.get(id) ?? []);
}

function Change({ value, lang }: { value: number | null; lang: Locale }) {
  if (value === null) return <span className="text-ink-soft">—</span>;

  const direction = Math.abs(value) < 0.005 ? 0 : Math.sign(value);
  const tone =
    direction > 0 ? "text-gain" : direction < 0 ? "text-accent" : "text-ink-soft";

  return (
    <span className={tone}>
      {direction !== 0 && (
        <span aria-hidden="true" className="mr-1.5 text-[0.7em]">
          {direction > 0 ? "▲" : "▼"}
        </span>
      )}
      {formatChange(value, lang)}
    </span>
  );
}

function PlaceholderRow() {
  return (
    <tr className="border-t border-rule" aria-hidden="true">
      <td className="py-4 pr-4">
        <span className="block leading-snug">
          <span className="inline-block h-3 w-24 bg-paper-sunk" />
        </span>
        <span className="label">
          <span className="inline-block h-2 w-8 bg-paper-sunk" />
        </span>
      </td>
      <td className="py-4 pl-4 text-right font-mono text-sm">
        <span className="inline-block h-3 w-20 bg-paper-sunk" />
      </td>
      <td className="py-4 pl-4 text-right font-mono text-sm">
        <span className="inline-block h-3 w-14 bg-paper-sunk" />
      </td>
      <td className="hidden py-4 pl-6 sm:table-cell">
        <div className="flex justify-end">
          <span className="inline-block h-7 w-24 bg-paper-sunk" />
        </div>
      </td>
    </tr>
  );
}
