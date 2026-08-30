// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeMermaid from 'rehype-mermaid';
import rehypeCodeblockChrome from './src/plugins/rehype-codeblock-chrome.mjs';
import rehypeDiagramSize from './src/plugins/rehype-diagram-size.mjs';
import rehypeRecolorSvg from './src/plugins/rehype-recolor-svg.mjs';
import remarkMermaidFigure from './src/plugins/remark-mermaid-figure.mjs';
import { mermaidConfig } from './src/plugins/diagram-theme.mjs';
import { iconPacks } from './src/plugins/icon-packs.mjs';
import { shikiFenceMeta } from './src/plugins/shiki-fence-meta.mjs';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://shedrackgodstime.pages.dev',
  // Inline all CSS: the site is tiny, external sheets add a request + a
  // flash risk, and the contrast audit loads pages via file:// where
  // absolute /_astro/ URLs don't resolve.
  build: { inlineStylesheets: 'always' },
  integrations: [],
  markdown: {
    processor: unified({
      remarkPlugins: [/** @type {any} */ (remarkMermaidFigure)],
      rehypePlugins: [
        [rehypeMermaid, { strategy: 'inline-svg', mermaidConfig, iconPacks }],
        /** @type {any} */ (rehypeDiagramSize),
        /** @type {any} */ (rehypeRecolorSvg),
        /** @type {any} */ (rehypeCodeblockChrome),
      ],
    }),
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [shikiFenceMeta()],
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
