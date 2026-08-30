import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * The full logos pack is ~7 MB; shipping it into the browser context for
 * every render batch is wasteful. Whitelist exactly the icons the content
 * uses and rebuild an inline IconifyJSON from those entries.
 *
 * NOTE: mermaid-isomorphic passes icon packs through page.evaluate(), so
 * loaders (functions) cannot be used here — inline icon data only.
 */
const WANT = [
  'astro',
  'nginx',
  'postgresql',
  'redis',
  'rust',
  'docker',
];

export const iconPacks = (() => {
  const all = require('@iconify-json/logos/icons.json');
  const icons = {};
  for (const name of WANT) {
    const icon = all.icons[name];
    if (!icon) throw new Error(`iconify-json/logos has no "${name}"`);
    icons[name] = icon;
  }
  // NOTE: `icons` must be a complete IconifyJSON (inner prefix included),
  // not a bare name→icon map — otherwise Mermaid's getIconData() misses
  // every lookup and renders "?" placeholder tiles.
  return [
    {
      name: 'logos',
      icons: { prefix: all.prefix, icons, width: all.width, height: all.height },
    },
  ];
})();
