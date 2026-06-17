"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { HornoIcon } from "./Icons";

type Dish = { name: string; desc: string };
type Category = { id: string; label: string; tag?: string; image: string; items: Dish[] };

const categories: Category[] = [
  {
    id: "horno",
    label: "Del Horno de Barro",
    tag: "La especialidad",
    image: "/images/fish.jpg",
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
    id: "entradas",
    label: "Entradas & Tapas",
    image: "/images/tapas.jpg",
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
    id: "pastas",
    label: "Pastas",
    image: "/images/pasta-caprese.jpg",
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
    id: "carnes",
    label: "Carnes",
    image: "/images/steak.jpg",
    items: [
      { name: "Entrecôte Angus", desc: "Corte madurado, sal Maldon, chimichurri de la casa" },
      { name: "Cotoletta", desc: "Chuleta empanada, queso fundido y berenjena" },
      { name: "Milanesa Napolitana", desc: "Milanesa clásica, tomate, jamón y queso gratinado" },
    ],
  },
];

export default function Menu() {
  const [active, setActive] = useState("horno");
  const current = categories.find((c) => c.id === active)!;

  return (
    <section id="carta" className="py-24 md:py-36 px-6" style={{ backgroundColor: "var(--white)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="flex items-center gap-3 mb-6" style={{ color: "var(--muted)" }}>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
              <span className="eyebrow">La carta</span>
              <span className="h-px w-6" style={{ backgroundColor: "currentColor" }} />
            </div>
          </Reveal>
          <Reveal delay={60}><HornoIcon size={40} className="mb-4" /></Reveal>
          <Reveal delay={100}>
            <span className="font-script" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--ink)" }}>nuestra carta</span>
          </Reveal>
          <Reveal delay={140}>
            <h2 className="headline mt-3" style={{ fontSize: "clamp(2.2rem,7vw,5.5rem)", color: "var(--ink)" }}>Lo que sale del fuego</h2>
          </Reveal>
        </div>

        {/* Category tabs — underline style */}
        <Reveal delay={140}>
          <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3" style={{ borderBottom: "1px solid var(--line)" }}>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className="relative pb-4 text-xs tracking-widest uppercase font-body font-bold transition-opacity"
                style={{
                  letterSpacing: "0.14em",
                  color: active === c.id ? "var(--ink)" : "var(--muted)",
                  opacity: active === c.id ? 1 : 0.7,
                }}
              >
                {c.label}
                <span
                  className="absolute left-0 right-0 bottom-0 h-0.5 transition-transform duration-300"
                  style={{ backgroundColor: "var(--ink)", transform: active === c.id ? "scaleX(1)" : "scaleX(0)" }}
                />
              </button>
            ))}
          </div>
        </Reveal>

        {/* Image + dish list */}
        <div className="mt-14 grid md:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Featured image */}
          <div className="md:col-span-2 md:sticky md:top-28">
            <figure className="img-zoom w-full rounded-sm relative aspect-[16/10] md:aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={current.image} src={current.image} alt={current.label} className="w-full h-full object-cover" />
              {current.tag && (
                <span className="absolute top-4 left-4 eyebrow px-3 py-1.5" style={{ backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: "0.55rem" }}>
                  {current.tag}
                </span>
              )}
              <figcaption className="absolute bottom-4 left-4 font-script" style={{ color: "var(--paper)", fontSize: "1.3rem", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}>
                {current.label}
              </figcaption>
            </figure>
          </div>

          {/* Dish list with dotted leaders */}
          <div className="md:col-span-3">
            {current.items.map((dish, i) => (
              <Reveal key={dish.name} delay={i * 40}>
                <div className="group py-5" style={{ borderBottom: "1px solid var(--line)" }}>
                  <div className="flex items-baseline">
                    <h4 className="font-display uppercase text-base md:text-lg transition-colors" style={{ color: "var(--ink)", letterSpacing: "0.02em" }}>{dish.name}</h4>
                    <span className="leader" />
                    <span className="flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "var(--ink)" }}>↗</span>
                  </div>
                  <p className="mt-1.5 font-body text-sm" style={{ color: "var(--muted)", lineHeight: 1.6 }}>{dish.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <p className="mt-16 text-center font-body text-xs tracking-wider" style={{ color: "var(--muted)", letterSpacing: "0.1em", lineHeight: 1.9 }}>
          La carta puede variar según el producto de temporada.
          <br />
          Consulta con nuestro equipo por alérgenos e ingredientes del día.
        </p>
      </div>
    </section>
  );
}
