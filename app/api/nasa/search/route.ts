import { NextResponse } from "next/server";
import { nasa } from "@/lib/nasaApiClient";
import type { NasaSearchItem } from "@/types";

export const revalidate = 1800;

interface RawSearch {
  collection?: {
    items?: Array<{
      href: string;
      data?: Array<{
        nasa_id?: string;
        title?: string;
        description?: string;
        date_created?: string;
      }>;
      links?: Array<{ href: string; rel?: string; render?: string }>;
    }>;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    return NextResponse.json({ error: "Missing query parameter `q`." }, { status: 400 });
  }
  if (q.length > 120) {
    return NextResponse.json({ error: "Query is too long." }, { status: 400 });
  }

  const raw = (await nasa.search(q, "image", 1800)) as RawSearch | null;
  if (!raw) {
    return NextResponse.json(
      { error: "NASA Image Library is unavailable.", items: [] as NasaSearchItem[] },
      { status: 503 },
    );
  }

  const items: NasaSearchItem[] = (raw.collection?.items ?? [])
    .slice(0, 18)
    .map((item) => {
      const meta = item.data?.[0] ?? {};
      const thumbnail = item.links?.find((l) => l.rel === "preview")?.href;
      return {
        nasa_id: meta.nasa_id ?? item.href,
        title: meta.title ?? "Untitled",
        description: meta.description,
        thumbnail,
        date_created: meta.date_created,
      };
    })
    .filter((i) => Boolean(i.thumbnail));

  return NextResponse.json({ items });
}
