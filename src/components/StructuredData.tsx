import { INSTAGRAM, PHONE, EMAIL } from "@/lib/site";
import type { Lang } from "@/lib/i18n";

// Server-rendered JSON-LD. This is the single biggest local-SEO lever for a
// restaurant: it tells Google/AI search exactly what we are, where, when we're
// open, our cuisine, price range and how to reserve — powering rich results and
// the local pack. Keep NAP (name/address/phone) identical to the visible site
// and to the Google Business Profile.
export default function StructuredData({ lang, siteUrl }: { lang: Lang; siteUrl: string }) {
  const description =
    lang === "en"
      ? "Fire cooking in the heart of Sant Carles, Ibiza. Artisan wood-fired clay oven, open-flame grill, fresh ingredients and Mediterranean tradition."
      : "Cocina de fuego en el corazón de Sant Carles, Ibiza. Horno de barro artesanal alimentado con leña, brasa, ingredientes frescos y tradición mediterránea.";

  const restaurant = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteUrl}/#restaurant`,
    name: "La Cantina de San Carlos",
    description,
    url: `${siteUrl}/${lang}`,
    image: `${siteUrl}/og.jpg`,
    logo: `${siteUrl}/images/logo-mark-black.png`,
    telephone: PHONE,
    email: EMAIL,
    priceRange: "€€",
    servesCuisine: ["Mediterranean", "Wood-fired", "Spanish", "Ibizan"],
    acceptsReservations: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plaça de la Iglesia, bajos 4",
      addressLocality: "Sant Carles de Peralta",
      addressRegion: "Illes Balears",
      postalCode: "07850",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.9833,
      longitude: 1.5167,
    },
    hasMap: "https://www.google.com/maps/search/?api=1&query=La+Cantina+de+San+Carlos+Sant+Carles+Ibiza",
    // Every day except Wednesday · 13:00–16:00 (lunch) and 19:30–23:30 (dinner).
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "13:00",
        closes: "16:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "19:30",
        closes: "23:30",
      },
    ],
    sameAs: [INSTAGRAM],
    areaServed: ["Sant Carles de Peralta", "Santa Eulària des Riu", "Ibiza", "Eivissa"],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "La Cantina de San Carlos",
    url: siteUrl,
    inLanguage: lang === "en" ? "en" : "es",
    publisher: { "@id": `${siteUrl}/#restaurant` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurant) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
