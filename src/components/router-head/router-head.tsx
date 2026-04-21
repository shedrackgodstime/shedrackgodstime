import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

const SITE_URL = "https://shedrackgodstime.com";
const SITE_NAME = "Shedrack Godstime";
const DEFAULT_DESCRIPTION =
  "Cybersecurity researcher and systems programmer. Building secure distributed systems — P2P networking, applied cryptography, and resilient infrastructure.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * The RouterHead component is placed inside of the document <head> element.
 * Handles title, canonical URL, meta descriptions, and Open Graph tags.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  const title = head.title || `${SITE_NAME} | Cybersecurity & Systems Programmer`;
  const description =
    head.meta.find((m) => m.name === "description")?.content ?? DEFAULT_DESCRIPTION;
  const canonicalUrl = loc.url.href;

  return (
    <>
      <title>{title}</title>

      {/* Core */}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content="index, follow" />

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@krixtency" />
      <meta name="twitter:creator" content="@krixtency" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

      {/* Theme color */}
      <meta name="theme-color" content="#2563eb" />

      {/* Remaining dynamic head entries from each page's DocumentHead */}
      {head.meta
        .filter((m) => m.name !== "description") // already rendered above
        .map((m) => (
          <meta key={m.key} {...m} />
        ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.style })}
        />
      ))}

      {head.scripts.map((s) => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </>
  );
});
