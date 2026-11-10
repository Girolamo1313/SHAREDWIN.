import { SITE_URL } from "@/lib/seo";
import { listMatches } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const now = new Date();
  const pages = [
    ["/", 1.0, "daily"], ["/matches", 0.9, "hourly"], ["/how-it-works", 0.8, "monthly"], ["/faq", 0.8, "monthly"],
    ["/glossary", 0.6, "monthly"], ["/leaderboard", 0.5, "daily"], ["/terms", 0.3, "yearly"],
  ].map(([p, priority, changeFrequency]) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency, priority }));

  let markets = [];
  try {
    const open = await listMatches({ status: "open" });
    markets = open.map((m) => ({ url: `${SITE_URL}/matches/${m.id}`, lastModified: now, changeFrequency: "hourly", priority: 0.7 }));
  } catch {}
  return [...pages, ...markets];
}
