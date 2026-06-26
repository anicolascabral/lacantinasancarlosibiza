// Central place for La Cantina contact details.

// Canonical site URL. Falls back to the Vercel production URL until the custom
// domain is connected. Used for metadata, JSON-LD, sitemap and robots.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.lacantinasancarlosibiza.com");

export const LOCALES = ["es", "en"] as const;

export const INSTAGRAM = "https://instagram.com/lacantinadesancarlos";
export const ADDRESS = "Plaça de la Iglesia, bajos 4, 07850 Sant Carles, Ibiza";

// Google Maps link to the restaurant — clickable address & "how to get there".
export const MAPS_URL = "https://share.google/J0DDIKNT5taIaROIf";

// Phone (display + tel: link)
export const PHONE = "+34 971 24 36 27";
export const PHONE_TEL = "tel:+34971243627";

// Email — the main contact & reservations channel
export const EMAIL = "info@lacantinasancarlosibiza.com";
export const EMAIL_MAILTO =
  "mailto:info@lacantinasancarlosibiza.com?subject=" +
  encodeURIComponent("Reserva · La Cantina de San Carlos") +
  "&body=" +
  encodeURIComponent("Hola, me gustaría reservar una mesa.\n\nDía:\nHora:\nNº de personas:\nNombre:\n");
