import type { Metadata, Viewport } from "next";
import "../globals.css";
import { LangProvider, type Lang } from "@/lib/i18n";
import StructuredData from "@/components/StructuredData";
import { SITE_URL } from "@/lib/site";

// Only Spanish and English are valid locales; anything else 404s.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

// Edge-to-edge on notched iPhones (Pro/Pro Max): the dark hero fills behind the
// status bar / Dynamic Island. Fixed UI is then inset via env(safe-area-inset-*).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#181613",
};

const siteUrl = SITE_URL;

const META: Record<Lang, { title: string; description: string; keywords: string; ogLocale: string }> = {
  es: {
    title: "La Cantina de San Carlos — Restaurante de cocina de fuego y horno de barro en Sant Carles, Ibiza",
    description:
      "Cocina de fuego en el corazón de Sant Carles, Ibiza. Horno de barro artesanal alimentado con leña, brasa, ingredientes frescos y tradición mediterránea. Reserva tu mesa.",
    keywords:
      "restaurante san carlos ibiza, restaurante sant carles, cocina de fuego ibiza, horno de barro ibiza, restaurante leña ibiza, brasa ibiza, la cantina san carlos, donde comer san carlos ibiza, restaurante mediterráneo ibiza",
    ogLocale: "es_ES",
  },
  en: {
    title: "La Cantina de San Carlos — Wood-Fired & Clay-Oven Restaurant in Sant Carles, Ibiza",
    description:
      "Fire cooking in the heart of Sant Carles, Ibiza. Artisan wood-fired clay oven, open-flame grill, fresh ingredients and Mediterranean tradition. Book your table.",
    keywords:
      "restaurant san carlos ibiza, sant carles restaurant, wood fired restaurant ibiza, clay oven ibiza, fire cooking ibiza, grill ibiza, la cantina san carlos, where to eat san carlos ibiza, mediterranean restaurant ibiza",
    ogLocale: "en_GB",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  const m = META[lang] ?? META.es;
  return {
    metadataBase: new URL(siteUrl),
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        es: "/es",
        en: "/en",
        "x-default": "/es",
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `/${lang}`,
      locale: m.ogLocale,
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
      title: m.title,
      description: m.description,
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
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const lang = (await params).lang as Lang;
  return (
    <html lang={lang} className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <LangProvider initialLang={lang}>{children}</LangProvider>
        <div className="grain-overlay" aria-hidden />
        <StructuredData lang={lang} siteUrl={siteUrl} />
      </body>
    </html>
  );
}
