import type { Metadata } from "next";
import SeoArticle from "@/components/SeoArticle";
import { buildSeoMetadata } from "@/lib/seoPages";
import type { Lang } from "@/lib/i18n";

const SLUG = "carta" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return buildSeoMetadata(SLUG, lang);
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  return <SeoArticle lang={lang} slug={SLUG} />;
}
