"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "es" | "en";

type Family = { n: string; name: string; desc: string };

type Dict = {
  nav: { announce: string; reserve: string; menu: string; bookTable: string; links: { label: string; href: string }[] };
  hero: { eyebrow: string; viewMenu: string; bookTable: string; marquee: string[] };
  about: {
    eyebrow: string; script: string; title: string; quote: string; p1: string; caption: string;
    stats: { n: string; l: string }[];
  };
  oven: {
    eyebrow: string; script: string; title: string; quote: string; caption: string; p1: string; p2: string;
    pillars: { t: string; d: string; n: string }[];
  };
  menu: { eyebrow: string; script: string; title: string; intro: string; note: string; image: string; families: Family[] };
  gallery: { eyebrow: string; script: string; title: string; tiles: { src: string; h: string; hint: string }[]; marquee: string[] };
  events: { eyebrow: string; script: string; title: string; items: { title: string; date: string; desc: string; img: string; n: string }[] };
  reservation: {
    eyebrow: string; script: string; title: string; intro: string; button: string; quick: string;
    addressLabel: string; address: string; hoursLabel: string; hours: string; contactLabel: string;
  };
  footer: {
    whereLabel: string; where: string[]; hoursLabel: string; hours: string[]; followLabel: string;
    waText: string; menuLink: string; marquee: string[]; fireIn: string; tagline: string; rights: string;
  };
};

const translations: Record<Lang, Dict> = {
  es: {
    nav: {
      announce: "Próxima apertura · Sant Carles, Ibiza",
      reserve: "Reservar",
      menu: "Menú",
      bookTable: "Reservar Mesa",
      links: [
        { label: "Historia", href: "#historia" },
        { label: "El Fuego", href: "#horno" },
        { label: "Cocina", href: "#carta" },
        { label: "Reservas", href: "#reservas" },
      ],
    },
    hero: {
      eyebrow: "Cocina de fuego · pescado, marisco y brasa",
      viewMenu: "Nuestra cocina",
      bookTable: "Reservar mesa",
      marquee: ["Pescado entero", "Cocina de fuego", "Producto del día", "San Carlos · Ibiza", "Marisco y brasa"],
    },
    about: {
      eyebrow: "Nuestra esencia",
      script: "nuestra historia",
      title: "El fuego real convierte lo simple en memorable",
      quote: "“Algunas de las mejores cosas de la vida ocurren alrededor de las brasas”",
      p1: "En el corazón de San Carlos, Ibiza, la cocina vuelve a sus raíces. Un espacio sin prisa, donde cada plato nace del respeto por el producto y el tiempo que necesita. Desde Uruguay hasta Ibiza llevamos la cultura del fuego: ingredientes sencillos, leña de verdad, dedicación.",
      caption: "Reunir y compartir",
      stats: [
        { n: "100%", l: "Leña real" },
        { n: "400°", l: "En el horno" },
        { n: "1", l: "Horno de barro" },
        { n: "∞", l: "Posibilidades" },
      ],
    },
    oven: {
      eyebrow: "El alma de la casa",
      script: "cocina de fuego",
      title: "Brasa, leña y producto",
      quote: "“Respetar el producto, esperar el momento justo y dejar que el fuego haga su trabajo”",
      caption: "El horno de barro",
      p1: "Cocinar con fuego es otra forma de entender la gastronomía. La brasa y la leña envuelven el producto lentamente, aportándole una textura única, aromas profundos y ese inconfundible toque ahumado que solo el fuego puede ofrecer.",
      p2: "El fuego es el centro de todo: pescados enteros, mariscos, verduras de temporada, arroces y cortes de carne encuentran en la brasa y el horno su mejor expresión.",
      pillars: [
        { t: "Mar", d: "Pescado del día", n: "01" },
        { t: "Brasa", d: "Fuego real", n: "02" },
        { t: "Huerta", d: "De temporada", n: "03" },
        { t: "Tiempo", d: "Sin prisas", n: "04" },
      ],
    },
    menu: {
      eyebrow: "La cocina",
      script: "qué cocinamos",
      title: "Lo que sale del fuego",
      image: "/images/venue-oven-front.jpg",
      intro: "No trabajamos con una carta cerrada: cocinamos con el producto fresco de cada día y dejamos que el fuego haga el resto. En las brasas y el horno de leña cobran vida recetas que encuentran en el fuego su mejor expresión.",
      families: [
        { n: "01", name: "Pescados enteros", desc: "Y mariscos del día, a la brasa y al horno de leña." },
        { n: "02", name: "Cortes de carne", desc: "Asados al fuego, jugosos y en su punto." },
        { n: "03", name: "Verduras asadas", desc: "De temporada, sobre las brasas." },
        { n: "04", name: "Boniatos", desc: "Al rescoldo, dulces y ahumados." },
        { n: "05", name: "Panes artesanales", desc: "Horneados con leña, recién hechos." },
      ],
      note: "La cocina cambia con el producto de cada jornada. También, pizza al metro al horno de leña. Consulta por alérgenos e ingredientes del día.",
    },
    gallery: {
      eyebrow: "Momentos", script: "galería", title: "Alrededor del fuego",
      tiles: [
        { src: "/images/fire-logs.jpg", h: "tall", hint: "Fuego real, solo leña" },
        { src: "/images/whole-fish.jpg", h: "short", hint: "Pescados enteros" },
        { src: "/images/steak.jpg", h: "short", hint: "Cortes de carne al fuego" },
        { src: "/images/seafood-rice.jpg", h: "tall", hint: "Arroces y marisco" },
        { src: "/images/venue-terrace.jpg", h: "short", hint: "Reunir y compartir" },
      ],
      marquee: ["Pescados enteros", "Cortes de carne", "Verduras asadas", "Boniatos", "Panes artesanales", "A la brasa"],
    },
    events: {
      eyebrow: "Experiencias", script: "eventos", title: "Celebra con nosotros",
      items: [
        { title: "Noches de Brasa", date: "Cada viernes", desc: "Menú especial de fuego con maridaje de vinos.", img: "/images/venue-oven-door.jpg", n: "01" },
        { title: "Mesa Larga", date: "Bajo reserva", desc: "Celebraciones y grupos alrededor de una mesa compartida.", img: "/images/venue-terrace.jpg", n: "02" },
        { title: "Fuego & Música", date: "Temporada", desc: "Cenas con música en vivo bajo el cielo de San Carlos.", img: "/images/venue-patio.jpg", n: "03" },
      ],
    },
    reservation: {
      eyebrow: "Reservas", script: "tu mesa te espera", title: "Reserva tu mesa",
      intro: "Escríbenos por WhatsApp y te confirmamos al momento. Cuéntanos día, hora y número de personas — del resto nos encargamos nosotros.",
      button: "Reservar por WhatsApp", quick: "Respuesta rápida · Sant Carles, Ibiza",
      addressLabel: "Dirección", address: "Plaça de la Iglesia, bajos 4\n07850 Sant Carles, Ibiza",
      hoursLabel: "Horario", hours: "Martes — Domingo\n13:00 — 16:00 · 19:30 — 23:30",
      contactLabel: "Contacto",
    },
    footer: {
      whereLabel: "Dónde", where: ["Plaça de la Iglesia, bajos 4", "07850 Sant Carles", "Ibiza, Islas Baleares"],
      hoursLabel: "Horario", hours: ["Martes — Domingo", "13:00 — 16:00 · 19:30 — 23:30", "Lunes cerrado"],
      followLabel: "Contacto", waText: "Reservar por WhatsApp", menuLink: "Cocina",
      marquee: ["La Cantina de San Carlos", "Cocina de fuego", "Pescado y marisco", "Ibiza"],
      fireIn: "cocina de fuego en", tagline: "Producto fresco, fuego real y mesa para compartir.",
      rights: "La Cantina de San Carlos · Ibiza",
    },
  },

  en: {
    nav: {
      announce: "Opening soon · Sant Carles, Ibiza",
      reserve: "Book",
      menu: "Menu",
      bookTable: "Book a Table",
      links: [
        { label: "Story", href: "#historia" },
        { label: "The Fire", href: "#horno" },
        { label: "Kitchen", href: "#carta" },
        { label: "Reservations", href: "#reservas" },
      ],
    },
    hero: {
      eyebrow: "Fire cooking · fish, seafood & coals",
      viewMenu: "Our kitchen",
      bookTable: "Book a table",
      marquee: ["Whole fish", "Fire cooking", "Catch of the day", "San Carlos · Ibiza", "Seafood & coals"],
    },
    about: {
      eyebrow: "Our essence",
      script: "our story",
      title: "Real fire turns the simple into the memorable",
      quote: "“Some of life's best things happen around the embers”",
      p1: "In the heart of San Carlos, Ibiza, cooking returns to its roots. An unhurried space where every dish is born from respect for the produce and the time it needs. From Uruguay to Ibiza we carry the culture of fire: simple ingredients, real wood, dedication.",
      caption: "Gather and share",
      stats: [
        { n: "100%", l: "Real wood" },
        { n: "400°", l: "In the oven" },
        { n: "1", l: "Clay oven" },
        { n: "∞", l: "Possibilities" },
      ],
    },
    oven: {
      eyebrow: "The soul of the house",
      script: "fire cooking",
      title: "Coals, wood and produce",
      quote: "“Respect the produce, wait for the right moment and let the fire do its work”",
      caption: "Our clay oven",
      p1: "Cooking with fire is a different way of understanding gastronomy. Coals and wood wrap the produce slowly, giving it a unique texture, deep aromas and that unmistakable smoky touch only fire can offer.",
      p2: "Fire is the centre of everything: whole fish, seafood, seasonal vegetables, rice dishes and cuts of meat find their best expression over the coals and in the oven.",
      pillars: [
        { t: "Sea", d: "Catch of the day", n: "01" },
        { t: "Coals", d: "Real fire", n: "02" },
        { t: "Garden", d: "In season", n: "03" },
        { t: "Time", d: "No rush", n: "04" },
      ],
    },
    menu: {
      eyebrow: "Our kitchen",
      script: "what we cook",
      title: "Straight from the fire",
      image: "/images/venue-oven-front.jpg",
      intro: "We don't work from a fixed menu: we cook with the fresh produce of each day and let the fire do the rest. Over the coals and in the wood-fired oven, recipes find their finest expression.",
      families: [
        { n: "01", name: "Whole fish", desc: "And seafood of the day, over the coals and wood-fired." },
        { n: "02", name: "Cuts of meat", desc: "Grilled over fire, juicy and just right." },
        { n: "03", name: "Roasted vegetables", desc: "Seasonal, over the embers." },
        { n: "04", name: "Sweet potatoes", desc: "In the embers, sweet and smoky." },
        { n: "05", name: "Artisan breads", desc: "Wood-fired, freshly baked." },
      ],
      note: "Our kitchen changes with each day's produce. Also, metre-long pizza from the wood-fired oven. Ask us about allergens and the day's ingredients.",
    },
    gallery: {
      eyebrow: "Moments", script: "gallery", title: "Around the fire",
      tiles: [
        { src: "/images/fire-logs.jpg", h: "tall", hint: "Real fire, wood only" },
        { src: "/images/whole-fish.jpg", h: "short", hint: "Whole fish" },
        { src: "/images/steak.jpg", h: "short", hint: "Cuts of meat over fire" },
        { src: "/images/seafood-rice.jpg", h: "tall", hint: "Rice & seafood" },
        { src: "/images/venue-terrace.jpg", h: "short", hint: "Gather and share" },
      ],
      marquee: ["Whole fish", "Cuts of meat", "Roasted vegetables", "Sweet potatoes", "Artisan breads", "Over the coals"],
    },
    events: {
      eyebrow: "Experiences", script: "events", title: "Celebrate with us",
      items: [
        { title: "Ember Nights", date: "Every Friday", desc: "Special fire menu with wine pairing.", img: "/images/venue-oven-door.jpg", n: "01" },
        { title: "Long Table", date: "On request", desc: "Celebrations and groups around a shared table.", img: "/images/venue-terrace.jpg", n: "02" },
        { title: "Fire & Music", date: "In season", desc: "Dinners with live music under the San Carlos sky.", img: "/images/venue-patio.jpg", n: "03" },
      ],
    },
    reservation: {
      eyebrow: "Reservations", script: "your table awaits", title: "Book your table",
      intro: "Message us on WhatsApp and we'll confirm right away. Tell us the day, time and number of guests — we'll take care of the rest.",
      button: "Book via WhatsApp", quick: "Quick reply · Sant Carles, Ibiza",
      addressLabel: "Address", address: "Plaça de la Iglesia, bajos 4\n07850 Sant Carles, Ibiza",
      hoursLabel: "Hours", hours: "Tuesday — Sunday\n13:00 — 16:00 · 19:30 — 23:30",
      contactLabel: "Contact",
    },
    footer: {
      whereLabel: "Where", where: ["Plaça de la Iglesia, bajos 4", "07850 Sant Carles", "Ibiza, Balearic Islands"],
      hoursLabel: "Hours", hours: ["Tuesday — Sunday", "13:00 — 16:00 · 19:30 — 23:30", "Closed Mondays"],
      followLabel: "Contact", waText: "Book via WhatsApp", menuLink: "Kitchen",
      marquee: ["La Cantina de San Carlos", "Fire cooking", "Fish & seafood", "Ibiza"],
      fireIn: "fire cooking in", tagline: "Fresh produce, real fire and a table to share.",
      rights: "La Cantina de San Carlos · Ibiza",
    },
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (stored === "es" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  return <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used within LangProvider");
  return ctx;
}
