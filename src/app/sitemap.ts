import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Slugs are shared across locales (es/en) so hreflang mapping is 1:1.
// "" = home. Keep in sync with the pages under src/app/[lang]/.
const PATHS = ["", "cocina-de-fuego", "carta", "reservas", "como-llegar"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.map((path) => {
    const suffix = path ? `/${path}` : "";
    return {
      url: `${SITE_URL}/es${suffix}`,
      lastModified: now,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: {
          es: `${SITE_URL}/es${suffix}`,
          en: `${SITE_URL}/en${suffix}`,
          "x-default": `${SITE_URL}/es${suffix}`,
        },
      },
    };
  });
}
