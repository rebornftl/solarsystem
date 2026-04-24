import { NextResponse } from "next/server";
import { nasa } from "@/lib/nasaApiClient";
import type { MarsRoverPhoto } from "@/types";

export const revalidate = 3600;

const ALLOWED = new Set(["curiosity", "perseverance", "opportunity", "spirit"] as const);
type Rover = "curiosity" | "perseverance" | "opportunity" | "spirit";

interface RawSearch {
  collection?: {
    items?: Array<{
      href: string;
      data?: Array<{ nasa_id?: string; title?: string; date_created?: string }>;
      links?: Array<{ href: string; rel?: string }>;
    }>;
  };
}

/**
 * Returns real Mars photos for a rover.
 *
 * NASA's Mars Rover Photos API (api.nasa.gov/mars-photos) has been broken for
 * long periods in 2024–2025 (Heroku "No such app" pages). We try it first for
 * authenticity, then fall back to the NASA Image & Video Library — which is
 * also real NASA imagery of the rover but reliably hosted.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roverParam = (searchParams.get("rover") ?? "curiosity").toLowerCase();
  const solParam = searchParams.get("sol");
  const sol = solParam ? Math.max(0, Math.min(5000, Number(solParam) || 1000)) : 1000;

  if (!ALLOWED.has(roverParam as never)) {
    return NextResponse.json(
      { error: "Unknown rover. Allowed: curiosity, perseverance, opportunity, spirit." },
      { status: 400 },
    );
  }
  const rover = roverParam as Rover;

  // 1) Try the Mars Rover Photos API.
  const live = (await nasa.marsRoverPhotos(rover, sol, 3600)) as
    | { photos: MarsRoverPhoto[] }
    | null;
  if (live && Array.isArray(live.photos) && live.photos.length > 0) {
    return NextResponse.json({
      photos: live.photos.slice(0, 24),
      source: "mars-photos",
    });
  }

  // 2) Fallback: query the NASA Image & Video Library.
  const query = `${rover} rover mars`;
  const raw = (await nasa.search(query, "image", 3600)) as RawSearch | null;
  const items = raw?.collection?.items ?? [];
  const photos: MarsRoverPhoto[] = [];
  for (let idx = 0; idx < items.length && photos.length < 18; idx += 1) {
    const item = items[idx];
    const meta = item.data?.[0] ?? {};
    const thumb = item.links?.find((l) => l.rel === "preview")?.href;
    if (!thumb) continue;
    photos.push({
      id: idx,
      img_src: thumb,
      earth_date: (meta.date_created ?? "").slice(0, 10),
      rover: { name: rover },
      camera: { full_name: meta.title ?? "NASA Image Library", name: "IVL" },
    });
  }

  if (photos.length === 0) {
    return NextResponse.json(
      { error: "Mars photos are unavailable right now.", photos: [] as MarsRoverPhoto[] },
      { status: 503 },
    );
  }

  return NextResponse.json({ photos, source: "image-library" });
}
