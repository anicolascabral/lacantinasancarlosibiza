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
    eyebrow: string; script: string; title: string; intro: string; quick: string;
    addressLabel: string; address: string; hoursLabel: string; hours: string; contactLabel: string;
    form: {
      name: string; email: string; phone: string; date: string; time: string; guests: string;
      message: string; send: string; unit1: string; unitN: string; more: string;
    };
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
      eyebrow: "Cocina mediterránea al fuego · producto artesanal",
      viewMenu: "Nuestra cocina",
      bookTable: "Reservar mesa",
      marquee: ["Pasta artesanal", "Cocina de fuego", "Producto de temporada", "San Carlos · Ibiza", "Mediterráneo"],
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
      p2: "El fuego es el centro de todo: pasta artesanal, verduras de la huerta y pescado del día encuentran en la brasa y el horno su mejor expresión. Cocina mediterránea, de producto y sin prisa.",
      pillars: [
        { t: "Horno", d: "De barro y leña", n: "01" },
        { t: "Leña", d: "Fuego real", n: "02" },
        { t: "Mediterráneo", d: "De temporada", n: "03" },
        { t: "Tradición", d: "Sin prisas", n: "04" },
      ],
    },
    menu: {
      eyebrow: "La cocina",
      script: "qué cocinamos",
      title: "Cocina mediterránea al fuego",
      image: "/images/venue-oven-front.jpg",
      intro: "Cocina mediterránea, artesanal y de producto. Trabajamos lo fresco de cada día — pasta hecha en casa, verduras de la huerta y pescado del mar — y dejamos que la leña y la brasa hagan el resto.",
      families: [
        { n: "01", name: "Pastas", desc: "Frescas, elaboradas en casa cada día." },
        { n: "02", name: "Verduras al fuego", desc: "De la huerta, a la brasa y al horno de leña." },
        { n: "03", name: "Pescado del día", desc: "Producto del mar, según la lonja." },
        { n: "04", name: "Producto de temporada", desc: "Trabajamos lo fresco, con tiempo y sin prisa." },
      ],
      note: "La cocina cambia con el producto de cada jornada. También, pizza al metro al horno de leña. Consulta por alérgenos e ingredientes del día.",
    },
    gallery: {
      eyebrow: "Momentos", script: "galería", title: "Alrededor del fuego",
      tiles: [
        { src: "/images/fire-logs.jpg", h: "tall", hint: "Fuego real, solo leña" },
        { src: "/images/venue-terrace.jpg", h: "short", hint: "La pérgola" },
        { src: "/images/venue-olives.jpg", h: "short", hint: "De la tierra" },
        { src: "/images/venue-patio.jpg", h: "tall", hint: "El jardín" },
        { src: "/images/venue-mallet.jpg", h: "short", hint: "Oficio artesanal" },
      ],
      marquee: ["Pasta artesanal", "Verduras al fuego", "Pescado del día", "Producto de temporada", "Cocina mediterránea", "A la brasa"],
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
      intro: "Déjanos tus datos y te confirmamos por correo. Cuéntanos el día, la hora y el número de personas — del resto nos encargamos nosotros.",
      quick: "Te respondemos pronto · info@lacantinasancarlosibiza.com",
      addressLabel: "Dirección", address: "Plaça de la Iglesia, bajos 4\n07850 Sant Carles, Ibiza",
      hoursLabel: "Horario", hours: "Cada día excepto miércoles\n13:00 — 16:00 · 19:30 — 23:30",
      contactLabel: "Contacto",
      form: {
        name: "Nombre", email: "Correo", phone: "Teléfono", date: "Día", time: "Hora", guests: "Personas",
        message: "Mensaje", send: "Enviar reserva", unit1: "persona", unitN: "personas", more: "Más de 8",
      },
    },
    footer: {
      whereLabel: "Dónde", where: ["Plaça de la Iglesia, bajos 4", "07850 Sant Carles", "Ibiza, Islas Baleares"],
      hoursLabel: "Horario", hours: ["Cada día", "13:00 — 16:00 · 19:30 — 23:30", "Miércoles cerrado"],
      followLabel: "Contacto", waText: "Reservar por correo", menuLink: "Cocina",
      marquee: ["La Cantina de San Carlos", "Cocina mediterránea", "Pasta artesanal", "Ibiza"],
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
      eyebrow: "Mediterranean fire cooking · artisanal produce",
      viewMenu: "Our kitchen",
      bookTable: "Book a table",
      marquee: ["Handmade pasta", "Fire cooking", "Seasonal produce", "San Carlos · Ibiza", "Mediterranean"],
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
      p2: "Fire is the centre of everything: handmade pasta, garden vegetables and the catch of the day find their best expression over the coals and in the oven. Mediterranean cooking, produce-led and unhurried.",
      pillars: [
        { t: "Oven", d: "Clay & wood", n: "01" },
        { t: "Wood", d: "Real fire", n: "02" },
        { t: "Mediterranean", d: "In season", n: "03" },
        { t: "Tradition", d: "No rush", n: "04" },
      ],
    },
    menu: {
      eyebrow: "Our kitchen",
      script: "what we cook",
      title: "Mediterranean fire cooking",
      image: "/images/venue-oven-front.jpg",
      intro: "Mediterranean cooking, handmade and produce-led. We work what's fresh each day — house-made pasta, vegetables from the garden and fish from the sea — and let the wood and coals do the rest.",
      families: [
        { n: "01", name: "Pasta", desc: "Fresh, made in-house every day." },
        { n: "02", name: "Vegetables over fire", desc: "From the garden, grilled and wood-fired." },
        { n: "03", name: "Catch of the day", desc: "From the sea, as the market brings it." },
        { n: "04", name: "Seasonal produce", desc: "We work what's fresh, with time and care." },
      ],
      note: "Our kitchen changes with each day's produce. Also, metre-long pizza from the wood-fired oven. Ask us about allergens and the day's ingredients.",
    },
    gallery: {
      eyebrow: "Moments", script: "gallery", title: "Around the fire",
      tiles: [
        { src: "/images/fire-logs.jpg", h: "tall", hint: "Real fire, wood only" },
        { src: "/images/venue-terrace.jpg", h: "short", hint: "The pergola" },
        { src: "/images/venue-olives.jpg", h: "short", hint: "From the land" },
        { src: "/images/venue-patio.jpg", h: "tall", hint: "The garden" },
        { src: "/images/venue-mallet.jpg", h: "short", hint: "Handmade craft" },
      ],
      marquee: ["Handmade pasta", "Vegetables over fire", "Catch of the day", "Seasonal produce", "Mediterranean cooking", "Over the coals"],
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
      intro: "Leave us your details and we'll confirm by email. Tell us the day, time and number of guests — we'll take care of the rest.",
      quick: "We reply soon · info@lacantinasancarlosibiza.com",
      addressLabel: "Address", address: "Plaça de la Iglesia, bajos 4\n07850 Sant Carles, Ibiza",
      hoursLabel: "Hours", hours: "Every day except Wednesday\n13:00 — 16:00 · 19:30 — 23:30",
      contactLabel: "Contact",
      form: {
        name: "Name", email: "Email", phone: "Phone", date: "Date", time: "Time", guests: "Guests",
        message: "Message", send: "Send reservation", unit1: "guest", unitN: "guests", more: "More than 8",
      },
    },
    footer: {
      whereLabel: "Where", where: ["Plaça de la Iglesia, bajos 4", "07850 Sant Carles", "Ibiza, Balearic Islands"],
      hoursLabel: "Hours", hours: ["Every day", "13:00 — 16:00 · 19:30 — 23:30", "Closed Wednesdays"],
      followLabel: "Contact", waText: "Book by email", menuLink: "Kitchen",
      marquee: ["La Cantina de San Carlos", "Mediterranean cooking", "Handmade pasta", "Ibiza"],
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
