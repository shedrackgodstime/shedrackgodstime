import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../data/config";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const entries = await getCollection("workbench");
  const visible = entries.filter((e) => e.id !== "test");

  return rss({
    title: `${SITE.name} | Workbench`,
    description: SITE.description,
    site: context.site!,
    items: visible.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.updated ?? entry.data.started
        ? new Date(`${(entry.data.updated ?? entry.data.started) as string}-01`)
        : new Date(),
      description: entry.data.summary,
      link: `/workbench/${entry.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
