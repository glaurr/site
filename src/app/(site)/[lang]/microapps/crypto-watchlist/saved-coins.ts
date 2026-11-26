import { useMemo, useSyncExternalStore } from "react";

/*
  The visitor's list, kept in localStorage as an array of CoinGecko ids. No
  entry means they never changed anything and the top 10 is shown; an empty
  array is a list they emptied themselves.

  Read through useSyncExternalStore, so a change made in another tab shows up
  here too. When storage is blocked (some private modes) the list still works
  for the visit, it just is not kept.
*/
const KEY = "microapps.crypto-watchlist.v1";
export const MAX_COINS = 20;

const listeners = new Set<() => void>();
let fallback: string | null = null;

function read(): string | null {
  if (fallback !== null) return fallback;
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function write(value: string | null) {
  try {
    if (value === null) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, value);
    fallback = null;
  } catch {
    fallback = value;
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) listener();
  };

  listeners.add(listener);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function parse(raw: string | null): string[] | null {
  if (raw === null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (Array.isArray(value) && value.every((id) => typeof id === "string")) {
      return [...new Set(value)].slice(0, MAX_COINS);
    }
    return null;
  } catch {
    return null;
  }
}

export function useSavedCoins(): string[] | null {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  return useMemo(() => parse(raw), [raw]);
}

export function saveCoins(ids: string[]) {
  write(JSON.stringify(ids));
}

export function forgetCoins() {
  write(null);
}
