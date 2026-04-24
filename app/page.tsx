import {
  Accessibility,
  Globe2,
  Orbit,
  Ruler,
  Satellite,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SceneContainer } from "@/components/solar-system/SceneContainer";
import { NasaApodCard } from "@/components/nasa/NasaApodCard";

interface Feature {
  title: string;
  desc: string;
  icon: LucideIcon;
  accent: string;
}

const FEATURES: Feature[] = [
  {
    title: "Интерактивная 3D сцена",
    desc: "Плавное управление камерой, орбиты планет, собственное вращение, hover-подсветка.",
    icon: Orbit,
    accent: "text-accent-cyan",
  },
  {
    title: "Живые данные NASA",
    desc: "APOD, EPIC, Mars Rover Photos, Image Library и DONKI — всё через серверные route handlers.",
    icon: Satellite,
    accent: "text-accent-violet",
  },
  {
    title: "3D-глобус Земли",
    desc: "Архитектурные чудеса человечества на реальных координатах — плавный фокус камеры.",
    icon: Globe2,
    accent: "text-accent-cyan",
  },
  {
    title: "Два режима масштаба",
    desc: "Переключайтесь между удобным и более реалистичным представлением.",
    icon: Ruler,
    accent: "text-accent-amber",
  },
  {
    title: "Современный UX",
    desc: "Glassmorphism, плавные анимации Framer Motion, поддержка reduced motion.",
    icon: Sparkles,
    accent: "text-accent-amber",
  },
  {
    title: "Доступность",
    desc: "Aria-labels, управление с клавиатуры, высокий контраст текста.",
    icon: Accessibility,
    accent: "text-accent-violet",
  },
];

export default function HomePage() {
  return (
    <div className="pt-0">
      <SceneContainer />

      <section id="apod" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-widest text-accent-cyan">Сегодня от NASA</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
            Astronomy Picture of the Day
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            Ежедневное изображение или видео от NASA с описанием учёных.
          </p>
        </header>

        <div className="mt-10">
          <NasaApodCard />
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-widest text-accent-cyan">Возможности</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
            Что умеет Solar Explorer
          </h2>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <article
                key={f.title}
                className="glass group rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-glow"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 ${f.accent} transition group-hover:bg-white/10`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
