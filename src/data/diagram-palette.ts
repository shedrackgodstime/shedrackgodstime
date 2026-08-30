/**
 * Diagram palettes — concrete light/dark color sets consumed by the
 * Mermaid build-time render and (via cssVarsBlock) emitted into site CSS
 * as `--d-*` custom properties.
 *
 * Why concrete hex lives here, not in tokens.css:
 *   Mermaid renders ONCE at build time. Its theme engine derives some
 *   colors via color math (darken/lighten/adjust) that cannot operate
 *   on `var(...)` strings. So we must hand it real hex values. The
 *   post-render recolor pass (in `src/plugins/`) then rewrites every
 *   color literal into `var(--d-*)` so the SAME svg adapts to the
 *   site's light/dark theme via CSS custom properties.
 *
 * This file is the single source of truth for the two palettes.
 * The `cssVarsBlock(palette)` function in `utils/diagram-theme.ts` is a
 * pure helper that takes a palette and emits the corresponding
 * `--d-*` declarations.
 */

export type DiagramPalette = Record<string, string>;

/** Light palette. */
export const paletteLight: DiagramPalette = {
  bg: "#ffffff",
  surface: "#f6f8fa",
  "surface-2": "#eef1f4",
  "surface-3": "#e7ebef",
  border: "#57606a",
  line: "#444c56",
  text: "#1f2328",
  accent: "#0969da",
  note: "#fff8c5",
  done: "#d1d9e0",
  crit: "#cf222e",
  "on-accent": "#ffffff",
  "on-crit": "#ffffff",
  "edge-label": "rgba(255, 255, 255, 0.85)",
};

/** Dark palette. */
export const paletteDark: DiagramPalette = {
  bg: "#0d1117",
  surface: "#161b22",
  "surface-2": "#21262d",
  "surface-3": "#2d333b",
  border: "#8b949e",
  line: "#adbac7",
  text: "#e6edf3",
  accent: "#539bf5",
  note: "#3a2e00",
  done: "#37424c",
  crit: "#f85149",
  "on-accent": "#0d1117",
  "on-crit": "#0d1117",
  "edge-label": "rgba(13, 17, 23, 0.85)",
};
