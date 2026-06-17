import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lacantinasancarlosibiza.com"),
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
