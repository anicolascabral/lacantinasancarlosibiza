import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";

// Edge-to-edge on notched iPhones (Pro/Pro Max): the dark hero fills behind the
// status bar / Dynamic Island. Fixed UI is then inset via env(safe-area-inset-*).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#181613",
};

// Resolve the canonical site URL so the OG image is always a live, fetchable
// absolute URL (WhatsApp/Facebook need that). Uses Vercel's production URL when
// the custom domain isn't connected yet.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.lacantinasancarlosibiza.com");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "La Cantina de San Carlos — Ibiza",
  description:
    "Cocina de fuego en el corazón de San Carlos, Ibiza. Horno de barro artesanal alimentado con leña, ingredientes frescos y tradición mediterránea.",
  keywords:
    "restaurante ibiza, san carlos ibiza, horno de barro, cocina de fuego, restaurante leña ibiza, la cantina",
  openGraph: {
    title: "La Cantina de San Carlos — Ibiza",
    description: "Cocina de fuego en el corazón de San Carlos, Ibiza.",
    locale: "es_ES",
    type: "website",
    siteName: "La Cantina de San Carlos",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "La Cantina de San Carlos — Cocina de fuego en Ibiza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Cantina de San Carlos — Ibiza",
    description: "Cocina de fuego en el corazón de San Carlos, Ibiza.",
    images: ["/og.jpg"],
  },
  // "Add to Home Screen" → runs full-screen (no Safari bars), status bar
  // translucent over the dark hero. The only way to truly remove browser chrome.
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "La Cantina",
  },
  other: {
    // Legacy iOS flag — still required for standalone "Add to Home Screen".
    "apple-mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <LangProvider>{children}</LangProvider>
        <div className="grain-overlay" aria-hidden />
      </body>
    </html>
  );
}
