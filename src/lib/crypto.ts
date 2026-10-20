import { z } from "zod";

/*
  Market data for the crypto watchlist microapp, from CoinGecko's public API.

  One request covers everything the page needs: the top 250 coins by market
  cap, with prices, changes and a 7-day sparkline each. The visitor's search
  runs over this list in the browser, so typing never costs an API call.

  The response is cached for 5 minutes, shared by every visitor. That keeps us
  under the free plan's monthly limit (10k calls) even with constant traffic.
*/
const MARKETS_URL =
  "https://api.coingecko.com/api/v3/coins/markets" +
  "?vs_currency=usd&order=market_cap_desc&per_page=250&page=1" +
  "&sparkline=true&price_change_percentage=24h,7d";

export const MARKETS_REVALIDATE_SECONDS = 300;

export type Coin = {
  id: string;
  symbol: string;
  name: string;
  rank: number | null;
  price: number;
  change24h: number | null;
  change7d: number | null;
  sparkline: number[];
};

export type Markets = {
  updatedAt: string;
  coins: Coin[];
};

/*
  Only the fields we use are listed, and zod drops the rest — about 1 MB from
  CoinGecko comes out as roughly 140 KB. Most numbers can be null for new or
  thinly traded coins, so they are allowed to be.
*/
const upstreamCoinSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  market_cap_rank: z.number().nullish(),
  current_price: z.number(),
  price_change_percentage_24h_in_currency: z.number().nullish(),
  price_change_percentage_7d_in_currency: z.number().nullish(),
  last_updated: z.string().nullish(),
  sparkline_in_7d: z.object({ price: z.array(z.number()) }).nullish(),
});

function downsample(points: number[], step = 4): number[] {
  return points
    .filter((_, index) => (points.length - 1 - index) % step === 0)
    .map((point) => Number(point.toPrecision(5)));
}

export async function getMarkets(): Promise<Markets> {
  const apiKey = process.env.COINGECKO_API_KEY;

  const response = await fetch(MARKETS_URL, {
    headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
    next: { revalidate: MARKETS_REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`CoinGecko responded with ${response.status}`);
  }

  const body: unknown = await response.json();
  if (!Array.isArray(body)) {
    throw new Error("CoinGecko returned something other than a list");
  }

  const coins = body.flatMap((item) => {
    const parsed = upstreamCoinSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });

  if (coins.length === 0) {
    throw new Error("CoinGecko returned no usable coins");
  }

  const updatedAt = coins
    .map((coin) => coin.last_updated)
    .filter((value) => value != null)
    .reduce((newest, value) => (value > newest ? value : newest), "");

  return {
    updatedAt: updatedAt || new Date().toISOString(),
    coins: coins.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      rank: coin.market_cap_rank ?? null,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h_in_currency ?? null,
      change7d: coin.price_change_percentage_7d_in_currency ?? null,
      sparkline: downsample(coin.sparkline_in_7d?.price ?? []),
    })),
  };
}
