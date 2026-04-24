"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Globe, Info, Satellite, type LucideIcon } from "lucide-react";
import type { CelestialBody, ArchitecturalLandmark } from "@/types";
import { FactList } from "@/components/ui/FactList";
import { StatGrid } from "@/components/ui/StatGrid";
import {
  formatDistance,
  formatDuration,
  formatMass,
  formatNumber,
  formatTemperature,
  formatYearLength,
} from "@/lib/format";
import { ArchitectureCards } from "./ArchitectureCards";
import { EarthGlobe } from "./EarthGlobe";
import { NasaEpicPanel } from "@/components/nasa/NasaEpicPanel";
import Image from "next/image";

type Tab = "facts" | "architecture" | "globe" | "nasa";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "facts", label: "Факты", icon: Info },
  { id: "architecture", label: "Архитектура", icon: Building2 },
  { id: "globe", label: "3D-глобус", icon: Globe },
  { id: "nasa", label: "NASA", icon: Satellite },
];

export function EarthDetails({ body }: { body: CelestialBody }) {
  const [tab, setTab] = useState<Tab>("facts");
  const [selected, setSelected] = useState<ArchitecturalLandmark | null>(null);

  return (
    <div className="space-y-5">
      <nav
        role="tablist"
        aria-label="Разделы Земли"
        className="glass flex flex-wrap gap-1 rounded-full p-1 text-xs"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition ${
                tab === t.id
                  ? "bg-accent-cyan text-space-950"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {tab === "facts" && (
          <div className="space-y-5">
            <div className="relative h-48 overflow-hidden rounded-2xl bg-space-900">
              <Image
                src="/textures/earth.jpg"
                alt="Earth Blue Marble"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
                unoptimized
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/10 to-transparent" />
            </div>

            <p className="text-slate-300 leading-relaxed">{body.description}</p>

            <StatGrid
              stats={[
                { label: "Диаметр", value: `${formatNumber(body.stats.diameter)} км` },
                { label: "Масса", value: formatMass(body.stats.mass) },
                { label: "От Солнца", value: formatDistance(body.stats.distanceFromSun) },
                { label: "Сутки", value: formatDuration(body.stats.dayLength) },
                { label: "Год", value: formatYearLength(body.stats.yearLength) },
                { label: "Темп. средн.", value: formatTemperature(body.stats.avgTemperature) },
                { label: "Спутников", value: formatNumber(body.stats.moons) },
                { label: "Наклон оси", value: `${formatNumber(body.axialTilt)}°` },
              ]}
            />

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
                Уникальность Земли
              </h3>
              <FactList
                facts={[
                  "Единственная планета с жидкой водой на поверхности в большом количестве.",
                  "Плотная атмосфера из азота и кислорода защищает жизнь от радиации.",
                  "Сильное магнитное поле удерживает солнечный ветер.",
                  "У Земли один естественный спутник — Луна, стабилизирующая наклон оси.",
                  ...body.facts,
                ]}
              />
            </div>
          </div>
        )}

        {tab === "architecture" && (
          <div className="space-y-5">
            <p className="text-sm text-slate-300">
              Величайшие архитектурные достижения человечества. Нажмите карточку, чтобы выбрать — во
              вкладке «3D-глобус» камера плавно наведётся на точку.
            </p>
            <ArchitectureCards
              onSelect={(l) => {
                setSelected(l);
              }}
              selectedId={selected?.id}
            />
            {selected && <LandmarkDetail landmark={selected} />}
          </div>
        )}

        {tab === "globe" && (
          <div className="space-y-4">
            <EarthGlobe selectedId={selected?.id ?? null} onSelect={(l) => setSelected(l)} />
            {selected ? (
              <LandmarkDetail landmark={selected} />
            ) : (
              <p className="text-sm text-slate-400">
                Кликните по маркеру на глобусе, чтобы увидеть информацию.
              </p>
            )}
          </div>
        )}

        {tab === "nasa" && <NasaEpicPanel />}
      </motion.div>
    </div>
  );
}

function LandmarkDetail({ landmark }: { landmark: ArchitecturalLandmark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass overflow-hidden rounded-2xl"
    >
      <div className="relative h-48 w-full bg-space-800">
        <Image
          src={landmark.image}
          alt={landmark.name}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent" />
      </div>
      <div className="space-y-3 px-5 py-4">
        <header>
          <h4 className="text-lg font-semibold text-white">{landmark.name}</h4>
          <p className="text-sm text-slate-400">
            {landmark.city}, {landmark.country} · {landmark.year}
          </p>
        </header>
        <p className="text-sm text-slate-200">{landmark.description}</p>
        <div className="rounded-xl border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-2 text-sm text-slate-200">
          <span className="font-medium text-accent-cyan">Факт: </span>
          {landmark.interestingFact}
        </div>
        <div className="flex gap-2 text-xs text-slate-400">
          <span>Координаты:</span>
          <span className="font-mono">
            {landmark.latitude.toFixed(4)}°, {landmark.longitude.toFixed(4)}°
          </span>
        </div>
      </div>
    </motion.div>
  );
}
