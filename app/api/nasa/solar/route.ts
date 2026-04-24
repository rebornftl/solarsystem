import { NextResponse } from "next/server";
import { nasa } from "@/lib/nasaApiClient";
import type { DonkiFlare } from "@/types";

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Math.max(1, Math.min(365, Number(searchParams.get("days")) || 180));

  const data = (await nasa.donkiFlares(days, 3600)) as DonkiFlare[] | null;
  if (!data) {
    return NextResponse.json(
      { error: "DONKI API is unavailable.", flares: [] as DonkiFlare[] },
      { status: 503 },
    );
  }
  return NextResponse.json({ flares: data });
}
