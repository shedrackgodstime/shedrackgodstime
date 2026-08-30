import type { APIRoute } from "astro";
import { SITE, SOCIALS, NAV_ITEMS } from "../data/config";

export const GET: APIRoute = async () => {
  const socials = SOCIALS.filter((s) => s.href.startsWith("http"))
    .map((s) => `- ${s.label}: ${s.href}`)
    .join("\n");

  const nav = NAV_ITEMS.map((item) => `- [${item.label}](${SITE.url}${item.path})`).join("\n");

  const content = `# ${SITE.name}

> ${SITE.tagline}

## About

${SITE.description}

## Pages

${nav}

## Contact

- Email: ${SITE.email}

## Socials

${socials}

## Site

- URL: ${SITE.url}
- Theme: Cybersecurity, systems programming, networking, and security research
- Built with: Astro
- Content: Workbench entries fetched from GitHub at build time
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
