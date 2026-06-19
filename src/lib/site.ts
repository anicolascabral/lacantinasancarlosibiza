// Central place for La Cantina contact details.

export const INSTAGRAM = "https://instagram.com/lacantinadesancarlos";
export const ADDRESS = "Plaça de la Iglesia, bajos 4, 07850 Sant Carles, Ibiza";

// Phone (display + tel: link)
export const PHONE = "+34 971 24 36 27";
export const PHONE_TEL = "tel:+34971243627";

// Email — the main contact & reservations channel
export const EMAIL = "info@lacantinasancarlosibiza.com";

// Web3Forms access key — lets the reservation form deliver the email straight to
// info@ (no mail app opens for the visitor). It's a PUBLIC key, safe to commit.
// Get a free one in ~2 min at https://web3forms.com (verify with info@) and paste
// it here. While empty, the form gracefully falls back to opening the mail app.
export const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";
export const EMAIL_MAILTO =
  "mailto:info@lacantinasancarlosibiza.com?subject=" +
  encodeURIComponent("Reserva · La Cantina de San Carlos") +
  "&body=" +
  encodeURIComponent("Hola, me gustaría reservar una mesa.\n\nDía:\nHora:\nNº de personas:\nNombre:\n");
