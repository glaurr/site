import { getMarkets } from "@/lib/crypto";

/*
  GET /api/crypto/markets — the data behind the crypto watchlist microapp.

  It takes no parameters on purpose: every visitor gets the same list, so one
  cached response serves all of them, and nothing a visitor sends ever reaches
  the request to CoinGecko.
*/
export async function GET() {
  try {
    const markets = await getMarkets();

    return Response.json(markets, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=240",
      },
    });
  } catch (error) {
    console.error("crypto markets:", error);

    return Response.json(
      { error: "Prices could not be loaded." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
