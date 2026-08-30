/**
 * Diagram color helpers — pure functions only.
 *
 * The actual color data lives in `data/diagram-palette.ts` (a data
 * module). This file owns the pure function that takes a palette and
 * emits the corresponding `--d-*` custom-property declarations.
 *
 * No concrete colors live here. utils/ holds behavior, not values.
 */

import type { DiagramPalette } from "../data/diagram-palette";

/** Re-export the palette type so consumers can import it from utils. */
export type Palette = DiagramPalette;

/**
 * Generate the custom-property declarations consumed by both the rendered
 * Mermaid SVGs and site CSS. Every hex token also gets a "-rgb" triplet
 * so alpha variants can be expressed as `rgb(var(--d-x-rgb) / a)`.
 *
 * Returns a string of indented `--d-<token>: <value>;` declarations.
 */
export function cssVarsBlock(palette: Palette): string {
  const lines: string[] = [];
  const pushTriplet = (token: string, r: number, g: number, b: number): void => {
    lines.push(`  --d-${token}-rgb: ${r} ${g} ${b};`);
  };
  for (const [token, value] of Object.entries(palette)) {
    lines.push(`  --d-${token}: ${value};`);
    const hex = /^#([0-9a-f]{6})$/i.exec(value);
    if (hex) {
      pushTriplet(
        token,
        parseInt(hex[1].slice(0, 2), 16),
        parseInt(hex[1].slice(2, 4), 16),
        parseInt(hex[1].slice(4, 6), 16),
      );
      continue;
    }
    // rgba() tokens also need triplets: mermaid emits rules like
    // rgb(var(--d-edge-label-rgb) / 0.85) which must resolve.
    const fn = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*[\d.]*\s*\)$/i.exec(
      value,
    );
    if (fn) pushTriplet(token, +fn[1], +fn[2], +fn[3]);
  }
  return lines.join("\n");
}
