"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import type { ApodResponse } from "@/types";
import { motion } from "framer-motion";

async function fetchApod(): Promise<ApodResponse> {
  const res = await fetch("/api/nasa/apod");
  if (!res.ok) throw new Error("apod_failed");
  return res.json();
}

export function NasaApodCard() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["apod"],
    queryFn: fetchApod,
    retry: 2,
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="glass h-80 animate-pulse rounded-2xl">
        <div className="h-full w-full rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="glass rounded-2xl p-6 text-sm text-slate-400">
        <p className="text-slate-200">NASA APOD временно недоступен.</p>
        <p className="mt-2 text-xs text-slate-500">
          Серверы NASA иногда отвечают с задержкой или с ошибкой 503 — это не
          зависит от нашего кода. Попробуйте перезагрузить блок, а если не
          поможет — подождите минуту: мы повторим запрос автоматически.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:border-white/20 hover:bg-white/10 disabled:opacity-50"
        >
          {isFetching ? "Загружаем…" : "Попробовать снова"}
        </button>
        <p className="mt-3 text-[11px] text-slate-500">
          Если используете{" "}
          <code className="rounded bg-white/5 px-1 py-0.5 text-[11px]">DEMO_KEY</code>, получите
          личный ключ на{" "}
          <a
            className="text-accent-cyan hover:underline"
            href="https://api.nasa.gov/"
            target="_blank"
            rel="noreferrer"
          >
            api.nasa.gov
          </a>{" "}
          и добавьте его в{" "}
          <code className="rounded bg-white/5 px-1 py-0.5 text-[11px]">.env.local</code> как{" "}
          <code className="rounded bg-white/5 px-1 py-0.5 text-[11px]">NASA_API_KEY</code>.
        </p>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass overflow-hidden rounded-2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[260px] bg-space-900">
          {data.media_type === "image" ? (
            <Image
              src={data.hdurl || data.url}
              alt={data.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
              priority={false}
            />
          ) : (
            <iframe
              src={data.url}
              title={data.title}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen"
            />
          )}
        </div>
        <div className="flex flex-col gap-3 px-6 py-6">
          <p className="text-xs uppercase tracking-wider text-accent-cyan">
            NASA · Astronomy Picture of the Day · {data.date}
          </p>
          <h2 className="font-display text-2xl font-semibold text-white">{data.title}</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            {data.explanation.slice(0, 420)}
            {data.explanation.length > 420 ? "…" : ""}
          </p>
          {data.copyright && (
            <p className="mt-auto text-xs text-slate-500">© {data.copyright.trim()}</p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
