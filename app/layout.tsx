import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Solar Explorer — интерактивная 3D Солнечная система",
    template: "%s · Solar Explorer",
  },
  description:
    "Интерактивный образовательный сайт: 3D Солнечная система, факты о планетах, 3D-глобус Земли с архитектурными достижениями и живые данные NASA.",
  keywords: [
    "solar system",
    "three.js",
    "react-three-fiber",
    "NASA",
    "education",
    "3D",
    "Next.js",
  ],
  openGraph: {
    title: "Solar Explorer",
    description:
      "Исследуйте Солнечную систему в 3D: планеты, факты, архитектурные чудеса Земли и данные NASA.",
    url: siteUrl,
    siteName: "Solar Explorer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Explorer",
    description:
      "Исследуйте Солнечную систему в 3D: планеты, факты, архитектурные чудеса Земли и данные NASA.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-space-950 text-slate-100 antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
