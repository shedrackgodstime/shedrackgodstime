import type { APIRoute } from "astro";
import { SITE } from "../data/config";

export const GET: APIRoute = async () => {
  const content = `User-agent: *
Allow: /
Disallow: /workbench/test
Disallow: /primitives-showcase

Sitemap: ${SITE.url}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
