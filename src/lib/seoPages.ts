// Bilingual content for the SEO landing pages under src/app/[lang]/<slug>/.
// Slugs are shared across locales (es/en) so hreflang mapping is 1:1 — keep this
// list in sync with src/app/sitemap.ts.
import type { Metadata } from "next";
import type { Lang } from "./i18n";

export type SeoSection = { heading: string; body: string[] };

export type SeoPageContent = {
  eyebrow: string;
  script: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  sections: SeoSection[];
  ctaLabel: string;
};

export type SeoSlug = "cocina-de-fuego" | "carta" | "reservas" | "como-llegar";

export const SEO_SLUGS: SeoSlug[] = ["cocina-de-fuego", "carta", "reservas", "como-llegar"];

// Per-page metadata with canonical + hreflang alternates. Slugs are shared
// across locales, so the alternate URLs only swap the /es | /en prefix.
export function buildSeoMetadata(slug: SeoSlug, lang: Lang): Metadata {
  const c = seoPages[slug][lang];
  const path = (l: Lang) => `/${l}/${slug}`;
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: path(lang),
      languages: { es: path("es"), en: path("en"), "x-default": path("es") },
    },
    openGraph: {
      title: c.title,
      description: c.description,
      url: path(lang),
      type: "article",
      locale: lang === "en" ? "en_GB" : "es_ES",
      siteName: "La Cantina de San Carlos",
      images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    },
  };
}

export const seoPages: Record<SeoSlug, Record<Lang, SeoPageContent>> = {
  "cocina-de-fuego": {
    es: {
      eyebrow: "Sant Carles · Ibiza",
      script: "El fuego",
      h1: "Cocina de fuego y horno de barro en San Carlos, Ibiza",
      title: "Cocina de fuego y horno de barro en San Carlos, Ibiza — La Cantina",
      description:
        "Restaurante de cocina de fuego en San Carlos (Sant Carles), Ibiza: horno de barro artesanal a leña y brasa viva. Producto fresco y sabor mediterráneo. Reserva mesa.",
      intro:
        "En La Cantina de San Carlos todo gira en torno al fuego. Nuestro horno de barro artesanal, alimentado con leña, y la brasa viva son el corazón de una cocina honesta y mediterránea en el centro de Sant Carles, Ibiza.",
      sections: [
        {
          heading: "El horno de barro a leña",
          body: [
            "El horno de barro se construye y se cura a mano, y trabaja a alta temperatura con leña seleccionada. Esa inercia del barro reparte el calor de forma envolvente: la corteza se dora, el interior queda jugoso y el humo de la leña perfuma cada plato.",
            "Es la forma más antigua y más pura de cocinar en el Mediterráneo, y la que define el carácter de nuestra carta en Ibiza.",
          ],
        },
        {
          heading: "Brasa viva y producto de temporada",
          body: [
            "Junto al horno, la brasa nos permite sellar carnes, verduras de la isla y pescado fresco con el punto justo de fuego. Trabajamos con producto local y de temporada siempre que es posible, respetando el sabor original de cada ingrediente.",
            "Cocina de fuego sin artificios: buen producto, brasa y horno de barro. Esa es la propuesta de La Cantina en San Carlos.",
          ],
        },
      ],
      ctaLabel: "Reservar mesa",
    },
    en: {
      eyebrow: "Sant Carles · Ibiza",
      script: "The fire",
      h1: "Wood-fired cooking & clay oven in San Carlos, Ibiza",
      title: "Wood-Fired Cooking & Clay Oven in San Carlos, Ibiza — La Cantina",
      description:
        "Fire-cooking restaurant in San Carlos (Sant Carles), Ibiza: artisan wood-fired clay oven and live coals. Fresh produce and Mediterranean flavour. Book a table.",
      intro:
        "At La Cantina de San Carlos everything revolves around fire. Our artisan wood-fired clay oven and live coals are the heart of an honest, Mediterranean kitchen in the centre of Sant Carles, Ibiza.",
      sections: [
        {
          heading: "The wood-fired clay oven",
          body: [
            "The clay oven is hand-built, hand-cured and fired at high temperature with selected wood. The clay's inertia surrounds food with even heat: the crust turns golden, the inside stays juicy, and wood smoke perfumes every dish.",
            "It is the oldest and purest way of cooking in the Mediterranean, and the one that defines the character of our menu in Ibiza.",
          ],
        },
        {
          heading: "Live coals & seasonal produce",
          body: [
            "Next to the oven, the grill lets us sear meat, island vegetables and fresh fish with just the right touch of fire. We work with local, seasonal produce whenever possible, respecting the original flavour of every ingredient.",
            "Fire cooking with no tricks: great produce, live coals and a clay oven. That is what La Cantina is about in San Carlos.",
          ],
        },
      ],
      ctaLabel: "Book a table",
    },
  },
  carta: {
    es: {
      eyebrow: "Sant Carles · Ibiza",
      script: "La carta",
      h1: "Carta del restaurante La Cantina de San Carlos, Ibiza",
      title: "Carta — La Cantina de San Carlos, restaurante en Ibiza",
      description:
        "Descubre la carta de La Cantina de San Carlos, Ibiza: platos al horno de barro y a la brasa, cocina mediterránea con producto fresco de temporada. Reserva tu mesa.",
      intro:
        "Nuestra carta cambia con la temporada y con lo que nos da la isla. Cocina mediterránea de fuego, pensada para compartir, en el corazón de Sant Carles, Ibiza.",
      sections: [
        {
          heading: "Para compartir",
          body: [
            "Entrantes y platos para el centro de la mesa: verduras de la isla a la brasa, pan recién hecho en el horno de barro y elaboraciones de temporada que cambian cada semana.",
          ],
        },
        {
          heading: "Del horno y la brasa",
          body: [
            "Carnes y pescados cocinados al fuego, con guarniciones sencillas que dejan brillar el producto. Una cocina directa, mediterránea y de raíz ibicenca.",
            "Consulta disponibilidad y carta del día reservando tu mesa o escribiéndonos directamente.",
          ],
        },
      ],
      ctaLabel: "Reservar mesa",
    },
    en: {
      eyebrow: "Sant Carles · Ibiza",
      script: "The menu",
      h1: "Menu of La Cantina de San Carlos restaurant, Ibiza",
      title: "Menu — La Cantina de San Carlos, restaurant in Ibiza",
      description:
        "Discover the menu at La Cantina de San Carlos, Ibiza: clay-oven and grilled dishes, Mediterranean cooking with fresh seasonal produce. Book your table.",
      intro:
        "Our menu changes with the season and with what the island gives us. Mediterranean fire cooking, made to share, in the heart of Sant Carles, Ibiza.",
      sections: [
        {
          heading: "To share",
          body: [
            "Starters and dishes for the middle of the table: grilled island vegetables, bread freshly baked in the clay oven and seasonal plates that change every week.",
          ],
        },
        {
          heading: "From the oven & the grill",
          body: [
            "Meat and fish cooked over fire, with simple sides that let the produce shine. Direct, Mediterranean cooking rooted in Ibiza.",
            "Check availability and the dish of the day by booking your table or writing to us directly.",
          ],
        },
      ],
      ctaLabel: "Book a table",
    },
  },
  reservas: {
    es: {
      eyebrow: "Sant Carles · Ibiza",
      script: "Reservas",
      h1: "Reservar mesa en La Cantina de San Carlos, Ibiza",
      title: "Reservar mesa — La Cantina de San Carlos, Ibiza",
      description:
        "Reserva tu mesa en La Cantina de San Carlos (Sant Carles), Ibiza. Cocina de fuego y horno de barro. Abierto cada día excepto miércoles, comidas y cenas.",
      intro:
        "¿Quieres comer o cenar con nosotros? Reserva tu mesa en La Cantina de San Carlos, en el centro de Sant Carles, Ibiza. Te recomendamos reservar con antelación, sobre todo en temporada.",
      sections: [
        {
          heading: "Horario",
          body: ["Cada día excepto miércoles.", "Comidas 13:00 — 16:00 · Cenas 19:30 — 23:30."],
        },
        {
          heading: "Cómo reservar",
          body: [
            "Llámanos, escríbenos por correo o usa el formulario de reserva. Te confirmaremos disponibilidad lo antes posible.",
          ],
        },
      ],
      ctaLabel: "Ir al formulario de reserva",
    },
    en: {
      eyebrow: "Sant Carles · Ibiza",
      script: "Bookings",
      h1: "Book a table at La Cantina de San Carlos, Ibiza",
      title: "Book a Table — La Cantina de San Carlos, Ibiza",
      description:
        "Book your table at La Cantina de San Carlos (Sant Carles), Ibiza. Fire cooking and a wood-fired clay oven. Open every day except Wednesday, lunch and dinner.",
      intro:
        "Want to join us for lunch or dinner? Book your table at La Cantina de San Carlos, in the centre of Sant Carles, Ibiza. We recommend booking ahead, especially in season.",
      sections: [
        {
          heading: "Opening hours",
          body: ["Every day except Wednesday.", "Lunch 13:00 — 16:00 · Dinner 19:30 — 23:30."],
        },
        {
          heading: "How to book",
          body: [
            "Call us, send us an email or use the booking form. We'll confirm availability as soon as possible.",
          ],
        },
      ],
      ctaLabel: "Go to the booking form",
    },
  },
  "como-llegar": {
    es: {
      eyebrow: "Sant Carles · Ibiza",
      script: "Cómo llegar",
      h1: "Cómo llegar a La Cantina de San Carlos, Ibiza",
      title: "Cómo llegar — La Cantina de San Carlos, Sant Carles (Ibiza)",
      description:
        "Dirección y cómo llegar a La Cantina de San Carlos: Plaça de la Iglesia, 07850 Sant Carles, Ibiza. A pocos minutos de Santa Eulària y de las calas del noreste.",
      intro:
        "Estamos en pleno centro de Sant Carles de Peralta, junto a la iglesia, en el noreste de Ibiza. Un pueblo tranquilo y auténtico, cerca de algunas de las mejores calas de la isla.",
      sections: [
        {
          heading: "Dirección",
          body: ["Plaça de la Iglesia, bajos 4", "07850 Sant Carles de Peralta, Ibiza (Illes Balears)"],
        },
        {
          heading: "Desde Santa Eulària y la ciudad de Ibiza",
          body: [
            "Desde Santa Eulària des Riu estás a unos 10 minutos en coche por la carretera de San Carlos. Desde la ciudad de Ibiza, alrededor de 25 minutos.",
            "El pueblo es punto de partida ideal hacia calas cercanas como Cala Llenya, Cala Mastella, Cala Boix o Aigües Blanques.",
          ],
        },
      ],
      ctaLabel: "Reservar mesa",
    },
    en: {
      eyebrow: "Sant Carles · Ibiza",
      script: "Find us",
      h1: "How to get to La Cantina de San Carlos, Ibiza",
      title: "How to Find Us — La Cantina de San Carlos, Sant Carles (Ibiza)",
      description:
        "Address and directions to La Cantina de San Carlos: Plaça de la Iglesia, 07850 Sant Carles, Ibiza. Minutes from Santa Eulària and the north-east coves.",
      intro:
        "We're right in the centre of Sant Carles de Peralta, next to the church, in the north-east of Ibiza. A quiet, authentic village close to some of the island's best coves.",
      sections: [
        {
          heading: "Address",
          body: ["Plaça de la Iglesia, bajos 4", "07850 Sant Carles de Peralta, Ibiza (Balearic Islands)"],
        },
        {
          heading: "From Santa Eulària and Ibiza town",
          body: [
            "From Santa Eulària des Riu it's about a 10-minute drive along the San Carlos road. From Ibiza town, around 25 minutes.",
            "The village is an ideal starting point for nearby coves such as Cala Llenya, Cala Mastella, Cala Boix or Aigües Blanques.",
          ],
        },
      ],
      ctaLabel: "Book a table",
    },
  },
};
