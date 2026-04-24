import { NextResponse } from "next/server";
import { nasa } from "@/lib/nasaApiClient";
import type { ApodResponse } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const data = (await nasa.apod(3600)) as ApodResponse | null;
  if (!data) {
    return NextResponse.json(
      { error: "NASA APOD API is unavailable right now." },
      { status: 503 },
    );
  }
  return NextResponse.json(data);
}
