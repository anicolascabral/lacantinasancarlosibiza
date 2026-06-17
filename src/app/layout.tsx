import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
        {children}
        <div className="grain-overlay" aria-hidden />
      </body>
    </html>
  );
}
