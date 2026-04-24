import { NextResponse } from "next/server";
import { nasa } from "@/lib/nasaApiClient";
import type { EpicImage } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

interface RawEpic {
  identifier: string;
  caption: string;
  image: string;
  date: string; // "2024-05-01 01:29:15"
}

function buildImageUrl(date: string, name: string): string {
  // Date format: "YYYY-MM-DD HH:MM:SS"
  const [ymd] = date.split(" ");
  const [y, m, d] = ymd.split("-");
  return `https://epic.gsfc.nasa.gov/archive/natural/${y}/${m}/${d}/png/${name}.png`;
}

export async function GET() {
  const raw = (await nasa.epicNatural(3600)) as RawEpic[] | null;
  if (!raw || raw.length === 0) {
    return NextResponse.json(
      { error: "EPIC API returned no imagery.", images: [] as EpicImage[] },
      { status: 503 },
    );
  }

  const images: EpicImage[] = raw.slice(0, 8).map((item) => ({
    identifier: item.identifier,
    caption: item.caption,
    image: item.image,
    date: item.date,
    imageUrl: buildImageUrl(item.date, item.image),
  }));

  return NextResponse.json({ images });
}
