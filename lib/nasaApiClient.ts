import { safeFetch } from "./safeFetch";

const BASE_URL = process.env.NASA_API_BASE_URL ?? "https://api.nasa.gov";

export function getNasaApiKey(): string {
  return process.env.NASA_API_KEY || "DEMO_KEY";
}

function withKey(url: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}api_key=${getNasaApiKey()}`;
}

export const nasa = {
  apod(revalidate: number | false = 3600) {
    return safeFetch(withKey(`${BASE_URL}/planetary/apod`), { revalidate });
  },

  /** EPIC natural color metadata; individual image URLs are built in the route handler. */
  epicNatural(revalidate: number | false = 3600) {
    return safeFetch<unknown[]>(withKey(`${BASE_URL}/EPIC/api/natural`), { revalidate });
  },

  marsRoverPhotos(
    rover: "curiosity" | "perseverance" | "opportunity" | "spirit" = "curiosity",
    sol = 1000,
    revalidate: number | false = 3600,
  ) {
    return safeFetch(
      withKey(`${BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}`),
      { revalidate },
    );
  },

  /** NASA Image and Video Library — this endpoint does NOT require an API key. */
  search(query: string, mediaType: "image" | "video" = "image", revalidate: number | false = 1800) {
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(
      query,
    )}&media_type=${mediaType}`;
    return safeFetch(url, { revalidate });
  },

  /** DONKI solar flares for the last `days` days. */
  donkiFlares(days = 180, revalidate: number | false = 3600) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return safeFetch(
      withKey(`${BASE_URL}/DONKI/FLR?startDate=${fmt(start)}&endDate=${fmt(end)}`),
      { revalidate },
    );
  },
};
