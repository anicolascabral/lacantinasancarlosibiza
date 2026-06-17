// Central place for La Cantina contact details.
// TODO: replace WHATSAPP_NUMBER with the venue's real number (international format,
// digits only, no "+" or spaces). Example for Spain mobile: "34612345678".
export const WHATSAPP_NUMBER = "34600000000";

const WHATSAPP_MSG = encodeURIComponent(
  "¡Hola! Me gustaría reservar una mesa en La Cantina de San Carlos."
);

export const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

export const INSTAGRAM = "https://instagram.com/lacantinadesancarlos";
export const ADDRESS = "Plaça de la Iglesia, bajos 4, 07850 Sant Carles, Ibiza";
