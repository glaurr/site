import type { Dictionary } from "./dictionaries";

/*
  Microapps are code, not content, so they are listed here rather than in the
  database. `slug` is the folder name under app/(site)/[lang]/microapps, and
  `key` points at the app's title and summary in the dictionaries.
*/
type Microapp = {
  slug: string;
  key: keyof Dictionary["microapps"]["apps"];
};

export const microapps: Microapp[] = [
  { slug: "crypto-watchlist", key: "cryptoWatchlist" },
];
