# 🌌 Solar Explorer

Интерактивный образовательный сайт с 3D-моделью Солнечной системы, расширенным 3D-глобусом Земли с архитектурными достижениями человечества и живыми данными NASA.

Построен на **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **React Three Fiber** и **Framer Motion**.

---

## ✨ Основные возможности

- **3D Солнечная система** — Солнце + 8 планет, орбиты, собственное вращение, анимация, hover-подсветка, клик для информации.
- **Управление сценой** — OrbitControls (mouse/touch), пауза/запуск, сброс камеры, переключатель «Упрощённо / Реалистичнее».
- **Информационная панель** — описание, факты, характеристики, анимация Framer Motion.
- **Расширенный режим Земли** с 4 вкладками:
  - Факты и характеристики
  - Архитектурные достижения (карточки)
  - 3D-глобус с маркерами на реальных координатах и плавным фокусом камеры
  - NASA EPIC — актуальные фото Земли из космоса
- **Интеграция NASA API** (через серверные route handlers, ключ НЕ уходит на клиент):
  - `/api/nasa/apod` — Astronomy Picture of the Day
  - `/api/nasa/epic` — снимки Земли из EPIC/DSCOVR
  - `/api/nasa/mars?rover=&sol=` — фото марсоходов
  - `/api/nasa/search?q=` — NASA Image and Video Library
  - `/api/nasa/solar?days=` — солнечные вспышки DONKI
- **Graceful fallback** — если API не ответил, UI показывает понятное сообщение и skeleton-ы.
- **UX** — glassmorphism, тёмная космическая тема, мягкое неоновое свечение, поддержка `prefers-reduced-motion`, адаптивность.

---

## 📁 Структура проекта

```
solar-explorer/
├─ app/
│  ├─ api/nasa/
│  │  ├─ apod/route.ts
│  │  ├─ epic/route.ts
│  │  ├─ mars/route.ts
│  │  ├─ search/route.ts
│  │  └─ solar/route.ts
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ providers.tsx
│  └─ globals.css
├─ components/
│  ├─ earth/
│  │  ├─ ArchitectureCards.tsx
│  │  ├─ EarthDetails.tsx
│  │  ├─ EarthGlobe.tsx
│  │  └─ GlobeMarker.tsx
│  ├─ layout/
│  │  ├─ Header.tsx
│  │  └─ Footer.tsx
│  ├─ nasa/
│  │  ├─ MarsRoverGallery.tsx
│  │  ├─ NasaApodCard.tsx
│  │  ├─ NasaEpicPanel.tsx
│  │  ├─ NasaImageSearch.tsx
│  │  └─ SolarActivity.tsx
│  ├─ solar-system/
│  │  ├─ CameraController.tsx
│  │  ├─ OrbitRing.tsx
│  │  ├─ PlanetMesh.tsx
│  │  ├─ SceneContainer.tsx
│  │  ├─ SceneControls.tsx
│  │  ├─ SolarSystemScene.tsx
│  │  └─ StarsBackground.tsx
│  └─ ui/
│     ├─ Button.tsx
│     ├─ FactList.tsx
│     ├─ InfoPanel.tsx
│     ├─ LoadingScreen.tsx
│     ├─ PlanetDetails.tsx
│     ├─ StatGrid.tsx
│     └─ Toast.tsx
├─ data/
│  ├─ landmarks.ts
│  └─ planets.ts
├─ hooks/
│  └─ useReducedMotion.ts
├─ lib/
│  ├─ cn.ts
│  ├─ format.ts
│  ├─ latLonToVector3.ts
│  ├─ nasaApiClient.ts
│  └─ safeFetch.ts
├─ public/
│  ├─ architecture/   ← опциональные локальные изображения
│  ├─ textures/       ← опциональная текстура Земли (earth.jpg)
│  └─ favicon.svg
├─ store/
│  └─ useSceneStore.ts
├─ types/
│  └─ index.ts
├─ .env.example
├─ .eslintrc.json
├─ .prettierrc
├─ next.config.mjs
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
└─ tsconfig.json
```

---

## 🚀 Быстрый старт

**Требования:** Node.js ≥ 18.17.0, npm (или pnpm/yarn).

```bash
# 1. Установите зависимости
npm install
# или pnpm install

# 2. Скопируйте пример env и добавьте ваш NASA API key
cp .env.example .env.local
# отредактируйте .env.local и задайте NASA_API_KEY

# 3. Запустите dev-сервер
npm run dev

# Откройте http://localhost:3000
```

### Получить NASA API key

Бесплатно за 30 секунд на [https://api.nasa.gov/](https://api.nasa.gov/) (форма "Generate API Key" — ключ приходит на email). Без него проект работает на `DEMO_KEY`, но этот ключ сильно ограничен (~30 запросов/час/IP), поэтому быстро начнут появляться ошибки.

### Production

```bash
npm run build
npm run start
```

---

## 🔧 Полезные скрипты

```bash
npm run dev         # dev-сервер
npm run build       # production-сборка
npm run start       # старт production-сборки
npm run lint        # ESLint
npm run typecheck   # TypeScript strict
npm run format      # Prettier
```

---

## 🖼️ Замена изображений и текстур

- **Текстура Земли** — положите файл `earth.jpg` (equirectangular, любое разрешение, 2–8 МБ) в `public/textures/`. Компонент `EarthGlobe` подхватит её автоматически; если файла нет, используется процедурный fallback-материал.
- **Фото архитектурных памятников** — в `data/landmarks.ts` замените поле `image` на локальный путь типа `"/architecture/eiffel.jpg"` и положите файлы в `public/architecture/`.
- **Текстуры планет** — добавьте `textureUrl` в объекте планеты в `data/planets.ts` и обработайте его в `PlanetMesh.tsx`. По умолчанию используются цветные материалы без тяжёлых текстур, чтобы сцена быстро грузилась на мобильных.

---

## 🏗️ Архитектурные решения

- **Server-only NASA client.** `lib/nasaApiClient.ts` + все роуты под `app/api/nasa/` — ключ никогда не попадает в клиентский бандл. Клиент общается только со своими собственными route handlers.
- **Graceful degradation.** `safeFetch` не бросает ошибки, а возвращает `null`. Любой компонент с данными NASA умеет показывать skeleton, пустое состояние и понятное сообщение об ошибке.
- **Zustand для сцены.** Одно маленькое хранилище на всю сцену: выбранный объект, hover, scale-mode, pause, time-scale, сигнал сброса камеры. Никаких пропс-дрилл.
- **TanStack Query для NASA.** Кэш на 5 минут (+ server-side ISR на 30–60 мин), retries=1, нет refetch on focus — это данные, которые реально редко меняются.
- **Динамический импорт R3F.** `SolarSystemScene` и `EarthGlobe` грузятся `next/dynamic` с `ssr: false` — React Three Fiber требует браузерных API.
- **Reduced motion.** Хук `useReducedMotionSync` синхронизирует медиа-запрос `prefers-reduced-motion` в store; CSS также глушит анимации.
- **Адаптивность.** Сетки используют Tailwind breakpoint-ы; 3D-сцены масштабируются под viewport.

---

## 📄 Источники данных

- [NASA Open APIs](https://api.nasa.gov/) — APOD, EPIC, Mars Rover Photos, DONKI.
- [NASA Image and Video Library](https://images.nasa.gov/) — поиск изображений.
- [Wikimedia Commons](https://commons.wikimedia.org/) — фото архитектурных памятников (по умолчанию).
- Данные о планетах — сводные справочные значения (NASA Planetary Fact Sheet).

---

## 📝 Лицензия

MIT — используйте свободно в образовательных и коммерческих целях.
