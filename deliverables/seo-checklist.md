# SEO La Cantina de San Carlos — guía de acciones

Estado: la parte **técnica y on-page ya está implementada en la web** (ver sección final). Este documento recoge lo que hay que hacer **fuera del código** — que es donde está la mayor palanca para el SEO local en Ibiza.

---

## 0. Objetivo realista

No pelees a corto plazo términos genéricos como "restaurante Ibiza" (los dominan marcas con mucho presupuesto: Leña/Dani García, etc.). El objetivo ganador y rentable es:

- **#1 en "restaurante San Carlos Ibiza" / "Sant Carles"** y variantes locales.
- **Nicho diferenciador:** "cocina de fuego", "horno de barro", "brasa" en Ibiza.
- **Local pack** (el mapa con 3 resultados) de la zona noreste: San Carlos, Santa Eulària.

---

## 1. Google Business Profile — PRIORIDAD #1

Sin ficha de Google no hay *local pack* ni Google Maps. Es lo más importante de todo.

- [ ] Crear/reclamar la ficha en https://business.google.com con el nombre exacto **La Cantina de San Carlos**.
- [ ] Categoría principal: **Restaurante** (+ secundarias: "Restaurante mediterráneo", "Parrilla/Asador").
- [ ] Dirección exacta: **Plaça de la Iglesia, bajos 4, 07850 Sant Carles de Peralta, Ibiza**.
- [ ] Teléfono **+34 971 24 36 27** y web **https://www.lacantinasancarlosibiza.com**.
- [ ] Horario: cada día excepto miércoles · 13:00–16:00 y 19:30–23:30.
- [ ] Subir 15–25 fotos de calidad (horno de barro, brasa, platos, sala, fachada, equipo).
- [ ] Activar **reservas** y enlace al formulario de la web.
- [ ] Publicar 1 "novedad" cada semana (eventos, platos de temporada) — Google premia la actividad.
- [ ] Pedir **reseñas** desde el primer día y responder a todas (clave para el ranking local).

> **NAP consistente:** Nombre + Dirección + Teléfono deben ser **idénticos** en la web, Google y todos los directorios. Cualquier variación resta.

---

## 2. Directorios y portales (citations + backlinks locales)

Alta con el mismo NAP en:

- [ ] **TripAdvisor** (imprescindible para restaurantes en Ibiza).
- [ ] **The Fork / ElTenedor** (reservas + visibilidad).
- [ ] **ibiza-spotlight.com**, **welcometoibiza.com**, **restaurantguru.com**, **minube**, **carta.menu**.
- [ ] Google Maps / Apple Maps / Bing Places.
- [ ] Instagram con enlace a la web (perfil ya existente: @lacantinadesancarlos) y NAP en la bio.

---

## 3. Search Console y seguimiento

- [ ] Dar de alta la propiedad en **Google Search Console** (https://search.google.com/search-console).
- [ ] Enviar el sitemap: `https://www.lacantinasancarlosibiza.com/sitemap.xml`.
- [ ] Repetir en **Bing Webmaster Tools**.
- [ ] Validar el marcado con el **Rich Results Test** (https://search.google.com/test/rich-results) y **validator.schema.org**.
- [ ] Tras desplegar, medir con **PageSpeed Insights / Lighthouse** (objetivo: SEO 100, buen LCP/CLS).

---

## 4. Estrategia de contenido y keywords

Ya hay páginas de aterrizaje creadas (`/cocina-de-fuego`, `/carta`, `/reservas`, `/como-llegar`). Para crecer:

- [ ] Mantener la **carta actualizada** en la web (texto, no solo imagen) — Google indexa el texto.
- [ ] Cuando abra: publicar notas/eventos (cenas temáticas, producto de temporada, fiestas de San Carlos) → long-tail + frescura.
- [ ] Conseguir menciones/enlaces de medios y blogs locales de Ibiza (notas de "nuevas aperturas 2026").
- [ ] Keywords objetivo: *restaurante san carlos ibiza, cocina de fuego ibiza, horno de barro ibiza, restaurante brasa santa eulària, dónde comer san carlos*.

---

## 5. Re-auditoría con claude-seo

La herramienta `claude-seo` (auditor) se puede instalar para puntuar la web tras desplegar:

```bash
git clone --depth 1 https://github.com/AgriciDaniel/claude-seo.git
bash claude-seo/install.sh   # macOS/Linux · requiere Python 3.10+
```

Luego, en Claude Code: `/seo audit https://www.lacantinasancarlosibiza.com`

---

## Implementado en la web (hecho ✅)

- Datos estructurados JSON-LD `Restaurant` + `WebSite` + `BreadcrumbList` (NAP, geo, horario, cocina, precio, reservas, sameAs).
- `<h1>` con keyword en cada página (sr-only en home para no tocar el diseño del hero).
- Rutas localizadas indexables **/es** y **/en** con `hreflang` + `canonical` (antes el inglés no se indexaba).
- `sitemap.xml` (con alternates hreflang) y `robots.txt` generados.
- 4 páginas de aterrizaje bilingües con enlazado interno.
- `proxy` que redirige `/` al idioma del navegador.
- Imágenes migradas a `next/image` (AVIF/WebP, LCP con priority) para Core Web Vitals.
- Metadata por página/idioma (title, description, OpenGraph, Twitter).
