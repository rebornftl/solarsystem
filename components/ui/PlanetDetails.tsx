"use client";

import Image from "next/image";
import type { CelestialBody } from "@/types";
import { FactList } from "./FactList";
import { StatGrid } from "./StatGrid";
import {
  formatDistance,
  formatDuration,
  formatMass,
  formatNumber,
  formatTemperature,
  formatYearLength,
} from "@/lib/format";
import { MarsRoverGallery } from "@/components/nasa/MarsRoverGallery";
import { SolarActivity } from "@/components/nasa/SolarActivity";
import { NasaImageSearch } from "@/components/nasa/NasaImageSearch";

export function PlanetDetails({ body }: { body: CelestialBody }) {
  return (
    <div className="space-y-6">
      <div
        className="relative h-48 overflow-hidden rounded-2xl bg-space-900"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${body.color}1a, transparent 70%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.4))`,
        }}
      >
        {body.textureUrl ? (
          <Image
            src={body.textureUrl}
            alt={body.name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover opacity-90"
            unoptimized
            priority={false}
          />
        ) : (
          <div
            className="absolute right-6 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full shadow-glow"
            style={{
              background: `radial-gradient(circle at 35% 35%, #fff 0%, ${body.color} 45%, rgba(0,0,0,0.6) 100%)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-space-950/80 via-transparent to-transparent" />
      </div>

      <p className="text-slate-300 leading-relaxed">{body.description}</p>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
          Характеристики
        </h3>
        <StatGrid
          stats={[
            { label: "Диаметр", value: `${formatNumber(body.stats.diameter)} км` },
            { label: "Масса", value: formatMass(body.stats.mass) },
            { label: "От Солнца", value: formatDistance(body.stats.distanceFromSun) },
            { label: "Сутки", value: formatDuration(body.stats.dayLength) },
            { label: "Год", value: formatYearLength(body.stats.yearLength) },
            { label: "Темп. (средн.)", value: formatTemperature(body.stats.avgTemperature) },
            { label: "Спутников", value: formatNumber(body.stats.moons) },
            { label: "Наклон оси", value: `${formatNumber(body.axialTilt)}°` },
          ]}
        />
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
          Интересные факты
        </h3>
        <FactList facts={body.facts} />
      </section>

      {body.id === "mars" && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
            Реальные фото с марсоходов
          </h3>
          <MarsRoverGallery />
        </section>
      )}

      {body.id === "sun" && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
            Солнечная активность (DONKI)
          </h3>
          <SolarActivity />
        </section>
      )}

      {body.id !== "earth" && body.id !== "sun" && body.id !== "mars" && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
            Галерея NASA
          </h3>
          <NasaImageSearch query={body.englishName} />
        </section>
      )}
    </div>
  );
}
