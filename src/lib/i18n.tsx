"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "es" | "en";

type Dish = { name: string; desc: string };
type Category = { id: string; label: string; tag?: string; image: string; items: Dish[] };

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
  menu: { eyebrow: string; script: string; title: string; note: string; categories: Category[] };
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
        { label: "El Horno", href: "#horno" },
        { label: "Carta", href: "#carta" },
        { label: "Reservas", href: "#reservas" },
      ],
    },
    hero: {
      eyebrow: "Cocina de fuego · San Carlos, Ibiza",
      viewMenu: "Ver la carta",
      bookTable: "Reservar mesa",
      marquee: ["Horno de barro", "Cocina de leña", "Producto de temporada", "San Carlos · Ibiza", "Fuego real"],
    },
    about: {
      eyebrow: "Nuestra esencia",
      script: "nuestra historia",
      title: "El fuego real convierte lo simple en memorable",
      quote: "“Algunas de las mejores cosas de la vida ocurren alrededor de las brasas”",
      p1: "En el corazón de San Carlos, Ibiza, la cocina vuelve a sus raíces. Un espacio sin prisa, donde cada plato nace del respeto por el producto y el tiempo que necesita. Desde Uruguay hasta Ibiza llevamos la cultura del fuego: ingredientes sencillos, leña de verdad, dedicación.",
      caption: "Cocina · La Cantina",
      stats: [
        { n: "100%", l: "Leña real" },
        { n: "400°", l: "En el horno" },
        { n: "1", l: "Horno de barro" },
        { n: "∞", l: "Posibilidades" },
      ],
    },
    oven: {
      eyebrow: "El alma de la casa",
      script: "el horno de barro",
      title: "Fuego, barro y tiempo",
      quote: "“Técnicas ancestrales que han acompañado a generaciones durante siglos”",
      caption: "Pizza artesanal · horno de leña",
      p1: "Cocinar con fuego y barro es otra forma de entender la gastronomía. El calor envuelve los alimentos lentamente, aportándoles una textura única, aromas profundos y ese inconfundible toque ahumado que solo la leña puede ofrecer.",
      p2: "Sus posibilidades son infinitas: pescados enteros, cortes de carne, verduras asadas, boniatos y panes artesanales encuentran en el fuego su mejor expresión.",
      pillars: [
        { t: "Barro", d: "Artesanal", n: "01" },
        { t: "Leña", d: "Fuego real", n: "02" },
        { t: "Tiempo", d: "Sin prisas", n: "03" },
        { t: "Tradición", d: "Siglos de saber", n: "04" },
      ],
    },
    menu: {
      eyebrow: "La carta",
      script: "nuestra carta",
      title: "Lo que sale del fuego",
      note: "La carta puede variar según el producto de temporada. Consulta con nuestro equipo por alérgenos e ingredientes del día.",
      categories: [
        {
          id: "horno", label: "Del Horno de Barro", tag: "La especialidad", image: "/images/fish.jpg",
          items: [
            { name: "Carrillera Ibérica", desc: "Confitada lentamente al horno de barro" },
            { name: "Costilla de Cerdo", desc: "Entera al horno de leña, marinada 24 horas" },
            { name: "Rodaballo Entero al Horno", desc: "Pescado fresco del día, aceite de oliva y limón" },
            { name: "Lubina Entera al Horno", desc: "Lubina salvaje, sal gruesa, aceite virgen extra" },
            { name: "Picaña", desc: "Corte uruguayo al horno de barro, sal parrillera" },
            { name: "Pizza Metro", desc: "Pizza de metro al horno de barro — ingredientes del día" },
          ],
        },
        {
          id: "entradas", label: "Entradas & Tapas", image: "/images/tapas.jpg",
          items: [
            { name: "Ensalada Thai de Gambas", desc: "Gambas frescas, hierbas asiáticas, jengibre y lima" },
            { name: "Selección de Tomates", desc: "Tomates de temporada, aceite de oliva, sal Maldon" },
            { name: "Trío de Mar", desc: "Selección de frutos del mar de la jornada" },
            { name: "Almejas a la Marinera", desc: "Almejas frescas, vino blanco, ajo y perejil" },
            { name: "Puerros a la Parrilla", desc: "Puerros confitados al horno con romesco" },
            { name: "Gazpacho Estilo Bangkok", desc: "Gazpacho clásico con un toque de lemongrass" },
            { name: "Hinojo Gratinado", desc: "Hinojo al horno de leña con queso y hierbas" },
            { name: "Carpaccio del Día", desc: "Según mercado — consultar disponibilidad" },
          ],
        },
        {
          id: "pastas", label: "Pastas", image: "/images/pasta-caprese.jpg",
          items: [
            { name: "Linguini con Pistacho y Gambas", desc: "Pasta fresca, gambas, pesto de pistacho y limón" },
            { name: "Gnocchi del Día", desc: "Gnocchi artesanal con salsa de temporada" },
            { name: "Gnocchi Carbonara", desc: "Yema curada, guanciale, pecorino romano" },
            { name: "Gnocchi al Cabrales", desc: "Salsa cremosa de queso Cabrales asturiano" },
            { name: "Ravioli Caprese", desc: "Relleno de burrata y tomate seco, albahaca" },
            { name: "Spaghetti Napoli", desc: "Tomate San Marzano, albahaca, aceite virgen extra" },
          ],
        },
        {
          id: "carnes", label: "Carnes", image: "/images/steak.jpg",
          items: [
            { name: "Entrecôte Angus", desc: "Corte madurado, sal Maldon, chimichurri de la casa" },
            { name: "Cotoletta", desc: "Chuleta empanada, queso fundido y berenjena" },
            { name: "Milanesa Napolitana", desc: "Milanesa clásica, tomate, jamón y queso gratinado" },
          ],
        },
      ],
    },
    gallery: {
      eyebrow: "Momentos", script: "galería", title: "Alrededor del fuego",
      tiles: [
        { src: "/images/fire-grill.jpg", h: "tall", hint: "A la brasa" },
        { src: "/images/fish-slate.jpg", h: "short", hint: "Pescado fresco" },
        { src: "/images/meat-grill.jpg", h: "short", hint: "Carnes al fuego" },
        { src: "/images/pasta-penne.jpg", h: "tall", hint: "Pasta artesanal" },
        { src: "/images/wine.jpg", h: "tall", hint: "Para acompañar" },
        { src: "/images/interior.jpg", h: "short", hint: "El ambiente" },
      ],
      marquee: ["Carrillera ibérica", "Rodaballo al horno", "Picaña", "Pizza metro", "Lubina salvaje", "Costilla de cerdo"],
    },
    events: {
      eyebrow: "Experiencias", script: "eventos", title: "Celebra con nosotros",
      items: [
        { title: "Noches de Brasa", date: "Cada viernes", desc: "Menú especial al horno de leña con maridaje de vinos.", img: "/images/meat-grill.jpg", n: "01" },
        { title: "Mesa Larga", date: "Bajo reserva", desc: "Celebraciones y grupos alrededor de una mesa compartida.", img: "/images/tapas.jpg", n: "02" },
        { title: "Fuego & Música", date: "Temporada", desc: "Cenas con música en vivo bajo el cielo de San Carlos.", img: "/images/wine.jpg", n: "03" },
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
      followLabel: "Contacto", waText: "Reservar por WhatsApp", menuLink: "Carta",
      marquee: ["La Cantina de San Carlos", "Cocina de leña", "Horno de barro", "Ibiza"],
      fireIn: "cocina de fuego en", tagline: "Donde el barro, la leña y la tradición se convierten en sabor.",
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
        { label: "The Oven", href: "#horno" },
        { label: "Menu", href: "#carta" },
        { label: "Reservations", href: "#reservas" },
      ],
    },
    hero: {
      eyebrow: "Fire cooking · San Carlos, Ibiza",
      viewMenu: "View the menu",
      bookTable: "Book a table",
      marquee: ["Clay oven", "Wood-fired cooking", "Seasonal produce", "San Carlos · Ibiza", "Real fire"],
    },
    about: {
      eyebrow: "Our essence",
      script: "our story",
      title: "Real fire turns the simple into the memorable",
      quote: "“Some of life's best things happen around the embers”",
      p1: "In the heart of San Carlos, Ibiza, cooking returns to its roots. An unhurried space where every dish is born from respect for the produce and the time it needs. From Uruguay to Ibiza we carry the culture of fire: simple ingredients, real wood, dedication.",
      caption: "Kitchen · La Cantina",
      stats: [
        { n: "100%", l: "Real wood" },
        { n: "400°", l: "In the oven" },
        { n: "1", l: "Clay oven" },
        { n: "∞", l: "Possibilities" },
      ],
    },
    oven: {
      eyebrow: "The soul of the house",
      script: "the clay oven",
      title: "Fire, clay and time",
      quote: "“Ancestral techniques that have accompanied generations for centuries”",
      caption: "Artisan pizza · wood-fired oven",
      p1: "Cooking with fire and clay is a different way of understanding gastronomy. The heat wraps the food slowly, giving it a unique texture, deep aromas and that unmistakable smoky touch only wood can offer.",
      p2: "The possibilities are endless: whole fish, cuts of meat, roasted vegetables, sweet potatoes and artisan breads all find their best expression in the fire.",
      pillars: [
        { t: "Clay", d: "Handcrafted", n: "01" },
        { t: "Wood", d: "Real fire", n: "02" },
        { t: "Time", d: "No rush", n: "03" },
        { t: "Tradition", d: "Centuries of know-how", n: "04" },
      ],
    },
    menu: {
      eyebrow: "The menu",
      script: "our menu",
      title: "Straight from the fire",
      note: "The menu may vary with the season's produce. Ask our team about allergens and the day's ingredients.",
      categories: [
        {
          id: "horno", label: "From the Clay Oven", tag: "The specialty", image: "/images/fish.jpg",
          items: [
            { name: "Iberian Pork Cheek", desc: "Slowly confit in the clay oven" },
            { name: "Pork Ribs", desc: "Whole in the wood-fired oven, marinated 24 hours" },
            { name: "Whole Roasted Turbot", desc: "Fresh fish of the day, olive oil and lemon" },
            { name: "Whole Roasted Sea Bass", desc: "Wild sea bass, coarse salt, extra virgin olive oil" },
            { name: "Picanha", desc: "Uruguayan cut in the clay oven, grill salt" },
            { name: "Metre Pizza", desc: "Metre-long pizza in the clay oven — ingredients of the day" },
          ],
        },
        {
          id: "entradas", label: "Starters & Tapas", image: "/images/tapas.jpg",
          items: [
            { name: "Thai Prawn Salad", desc: "Fresh prawns, Asian herbs, ginger and lime" },
            { name: "Tomato Selection", desc: "Seasonal tomatoes, olive oil, Maldon salt" },
            { name: "Trio of the Sea", desc: "Selection of the day's seafood" },
            { name: "Clams Marinara", desc: "Fresh clams, white wine, garlic and parsley" },
            { name: "Grilled Leeks", desc: "Oven-confit leeks with romesco" },
            { name: "Bangkok-Style Gazpacho", desc: "Classic gazpacho with a touch of lemongrass" },
            { name: "Gratinated Fennel", desc: "Wood-oven fennel with cheese and herbs" },
            { name: "Carpaccio of the Day", desc: "Market choice — ask for availability" },
          ],
        },
        {
          id: "pastas", label: "Pasta", image: "/images/pasta-caprese.jpg",
          items: [
            { name: "Linguine with Pistachio & Prawns", desc: "Fresh pasta, prawns, pistachio pesto and lemon" },
            { name: "Gnocchi of the Day", desc: "Handmade gnocchi with a seasonal sauce" },
            { name: "Gnocchi Carbonara", desc: "Cured yolk, guanciale, pecorino romano" },
            { name: "Gnocchi al Cabrales", desc: "Creamy Asturian Cabrales cheese sauce" },
            { name: "Caprese Ravioli", desc: "Filled with burrata and sun-dried tomato, basil" },
            { name: "Spaghetti Napoli", desc: "San Marzano tomato, basil, extra virgin olive oil" },
          ],
        },
        {
          id: "carnes", label: "Meats", image: "/images/steak.jpg",
          items: [
            { name: "Angus Entrecôte", desc: "Aged cut, Maldon salt, house chimichurri" },
            { name: "Cotoletta", desc: "Breaded chop, melted cheese and aubergine" },
            { name: "Milanesa Napolitana", desc: "Classic milanesa, tomato, ham and gratinated cheese" },
          ],
        },
      ],
    },
    gallery: {
      eyebrow: "Moments", script: "gallery", title: "Around the fire",
      tiles: [
        { src: "/images/fire-grill.jpg", h: "tall", hint: "Over the coals" },
        { src: "/images/fish-slate.jpg", h: "short", hint: "Fresh fish" },
        { src: "/images/meat-grill.jpg", h: "short", hint: "Fire-cooked meats" },
        { src: "/images/pasta-penne.jpg", h: "tall", hint: "Handmade pasta" },
        { src: "/images/wine.jpg", h: "tall", hint: "To pair" },
        { src: "/images/interior.jpg", h: "short", hint: "The atmosphere" },
      ],
      marquee: ["Iberian pork cheek", "Roasted turbot", "Picanha", "Metre pizza", "Wild sea bass", "Pork ribs"],
    },
    events: {
      eyebrow: "Experiences", script: "events", title: "Celebrate with us",
      items: [
        { title: "Ember Nights", date: "Every Friday", desc: "Special wood-fired menu with wine pairing.", img: "/images/meat-grill.jpg", n: "01" },
        { title: "Long Table", date: "On request", desc: "Celebrations and groups around a shared table.", img: "/images/tapas.jpg", n: "02" },
        { title: "Fire & Music", date: "In season", desc: "Dinners with live music under the San Carlos sky.", img: "/images/wine.jpg", n: "03" },
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
      followLabel: "Contact", waText: "Book via WhatsApp", menuLink: "Menu",
      marquee: ["La Cantina de San Carlos", "Wood-fired cooking", "Clay oven", "Ibiza"],
      fireIn: "fire cooking in", tagline: "Where clay, wood and tradition become flavour.",
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
