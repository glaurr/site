"use client";

import { useEffect, useRef, useState } from "react";

import type { Coin, Markets } from "@/lib/crypto";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";
import { CoinSearch } from "./coin-search";
import { formatChange, formatPrice, formatTime } from "./format";
import { MAX_COINS, forgetCoins, saveCoins, useSavedCoins } from "./saved-coins";
import { Sparkline } from "./sparkline";

type Labels = Dictionary["microapps"]["apps"]["cryptoWatchlist"];

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; markets: Markets; refreshFailed: boolean };

type Row = { id: string; coin: Coin | undefined };

const PLACEHOLDER_ROWS = 10;
const REFRESH_MS = 5 * 60 * 1000;
const CHECK_MS = 60 * 1000;

/*
  Prices are fetched in the browser, not at build time: they go stale in
  minutes, and the coins shown come from this browser's saved list, which
  the server never sees.

  They refresh every 5 minutes, the same as the server's cache, and only
  while the tab is visible; coming back to the tab catches up at once. A
  failed refresh keeps the rows on screen and waits the full 5 minutes
  before trying again, so an outage is not met with a burst of retries.
*/
export function Watchlist({ lang, labels }: { lang: Locale; labels: Labels }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const savedIds = useSavedCoins();

  useEffect(() => {
    let controller = new AbortController();
    let lastAttempt = 0;

    function load() {
      controller.abort();
      controller = new AbortController();
      const { signal } = controller;
      lastAttempt = Date.now();

      fetchMarkets(signal).then(
        (markets) => setState({ status: "ready", markets, refreshFailed: false }),
        () => {
          if (signal.aborted) return;
          setState((current) =>
            current.status === "ready"
              ? { ...current, refreshFailed: true }
              : { status: "error" },
          );
        },
      );
    }

    function refreshIfDue() {
      const visible = document.visibilityState === "visible";
      if (visible && Date.now() - lastAttempt >= REFRESH_MS) load();
    }

    load();
    const timer = setInterval(refreshIfDue, CHECK_MS);
    document.addEventListener("visibilitychange", refreshIfDue);

    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshIfDue);
    };
  }, [attempt]);

  function retry() {
    if (state.status === "error") setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }

  if (state.status === "error") {
    return (
      <div role="alert" className="mt-12 border-t border-rule pt-6">
        <p className="text-ink-soft">{labels.error}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-3 cursor-pointer py-1 font-mono text-sm text-accent underline underline-offset-4"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  const ready = state.status === "ready";
  const ids = savedIds ?? (ready ? state.markets.defaultIds : []);
  const rows = ready ? pick(state.markets, ids) : [];

  function add(coin: Coin) {
    if (ids.includes(coin.id) || ids.length >= MAX_COINS) return;
    saveCoins([...ids, coin.id]);
    setAnnouncement(labels.added.replace("{name}", coin.name));
  }

  function remove(id: string, name: string) {
    saveCoins(ids.filter((other) => other !== id));
    setAnnouncement(labels.removed.replace("{name}", name));
    searchRef.current?.focus();
  }

  function reset() {
    forgetCoins();
    setAnnouncement(labels.resetDone);
    searchRef.current?.focus();
  }

  return (
    <div className="mt-12">
      <CoinSearch
        coins={ready ? state.markets.coins : []}
        exclude={ids}
        full={ids.length >= MAX_COINS}
        onSelect={add}
        inputRef={searchRef}
        labels={{
          ...labels.search,
          full: labels.search.full.replace("{max}", String(MAX_COINS)),
        }}
      />

      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="label">
          {ready ? (
            `${labels.asOf} ${formatTime(state.markets.updatedAt, lang)}`
          ) : (
            <span role="status">{labels.loading}</span>
          )}
        </p>
        {ready && savedIds !== null && (
          <button
            type="button"
            onClick={reset}
            className="label -my-1 cursor-pointer py-1 hover:text-accent"
          >
            {labels.reset}
          </button>
        )}
      </div>

      {ready && state.refreshFailed && (
        <p role="status" className="label mt-2 text-accent">
          {labels.stale}{" "}
          <button
            type="button"
            onClick={retry}
            className="-my-1 cursor-pointer py-1 uppercase underline underline-offset-4"
          >
            {labels.retry}
          </button>
        </p>
      )}

      {ready && rows.length === 0 ? (
        <p className="mt-4 border-t border-rule pt-6 text-ink-soft">
          {labels.empty}
        </p>
      ) : (
        <table className="mt-4 w-full" aria-busy={!ready}>
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
            {ready
              ? rows.map(({ id, coin }) => (
                  <tr key={id} className="group border-t border-rule">
                    <th scope="row" className="py-4 pr-4 text-left font-normal">
                      <span
                        className={`block leading-snug ${coin ? "" : "text-ink-soft"}`}
                      >
                        {coin ? coin.name : id}
                      </span>
                      <span className="flex flex-wrap items-baseline gap-x-3">
                        <span className="label">
                          {coin ? coin.symbol : labels.unavailable}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(id, coin ? coin.name : id)}
                          aria-label={labels.removeLabel.replace(
                            "{name}",
                            coin ? coin.name : id,
                          )}
                          className="label -my-1.5 cursor-pointer py-1.5 hover:text-accent pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:focus-visible:opacity-100"
                        >
                          {labels.remove}
                        </button>
                      </span>
                    </th>
                    <td className="py-4 pl-4 text-right font-mono text-sm tabular-nums">
                      {coin ? formatPrice(coin.price, lang) : "—"}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 text-right font-mono text-sm tabular-nums">
                      <Change value={coin?.change24h ?? null} lang={lang} />
                    </td>
                    <td className="hidden py-4 pl-6 sm:table-cell">
                      {coin && (
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
                      )}
                    </td>
                  </tr>
                ))
              : Array.from(
                  { length: savedIds ? savedIds.length : PLACEHOLDER_ROWS },
                  (_, index) => <PlaceholderRow key={index} />,
                )}
          </tbody>
        </table>
      )}

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}

async function fetchMarkets(signal: AbortSignal): Promise<Markets> {
  const response = await fetch("/api/crypto/markets", { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function pick(markets: Markets, ids: string[]): Row[] {
  const byId = new Map(markets.coins.map((coin) => [coin.id, coin]));
  return ids.map((id) => ({ id, coin: byId.get(id) }));
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
