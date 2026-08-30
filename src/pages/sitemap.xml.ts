import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../data/config";

const BASE_URL = SITE.url.replace(/\/$/, "");

function lastmodIso(date?: string): string {
  if (!date) return new Date().toISOString().slice(0, 10);
  return new Date(`${date}-01`).toISOString().slice(0, 10);
}

function xmlUrl(url: string, priority: number, changefreq: string, lastmod: string): string {
  return [
    "  <url>",
    `    <loc>${url}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority.toFixed(1)}</priority>`,
    "  </url>",
  ].join("\n");
}

export const GET: APIRoute = async () => {
  const entries = await getCollection("workbench");
  const visible = entries
    .filter((e) => e.id !== "test")
    .sort((a, b) => (a.data.started || "").localeCompare(b.data.started || ""));

  const urls = [
    xmlUrl(`${BASE_URL}/`, 1.0, "weekly", new Date().toISOString().slice(0, 10)),
    xmlUrl(`${BASE_URL}/workbench/`, 0.9, "weekly", new Date().toISOString().slice(0, 10)),
    xmlUrl(`${BASE_URL}/about/`, 0.7, "monthly", new Date().toISOString().slice(0, 10)),
    xmlUrl(`${BASE_URL}/contact/`, 0.6, "monthly", new Date().toISOString().slice(0, 10)),
    ...visible.map((entry) =>
      xmlUrl(
        `${BASE_URL}/workbench/${entry.id}/`,
        0.8,
        "monthly",
        lastmodIso(entry.data.updated ?? entry.data.started),
      ),
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
