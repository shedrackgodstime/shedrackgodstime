/**
 * Runs AFTER rehype-mermaid. Walks inline <svg> diagrams and rewrites every
 * color literal (hex / rgb / rgba) into `var(--d-*)` tokens using the light
 * palette as the lookup table. Colors that don't belong to the palette are
 * left untouched.
 *
 * The result: one static SVG that adapts to dark/light purely through the
 * site's CSS custom properties.
 */
import { feedPalette } from './diagram-theme.mjs';

const hexToToken = new Map();
const rgbToToken = new Map(); // "r,g,b" → { token }

const hexTriplet = (hex6) => {
  const r = parseInt(hex6.slice(0, 2), 16);
  const g = parseInt(hex6.slice(2, 4), 16);
  const b = parseInt(hex6.slice(4, 6), 16);
  return [r, g, b];
};

for (const [token, value] of Object.entries(feedPalette)) {
  // hex form
  const m = /^#([0-9a-f]{6})$/i.exec(value);
  if (m) {
    const [r, g, b] = hexTriplet(m[1]);
    const key = `${r},${g},${b}`;
    // Pure black/white are reserved as author literals: they must survive
    // verbatim so label contrast on colored chips survives theme flips.
    // (Their rgb()/rgba() forms still register below for internal rules.)
    const pureBW =
      m[1].toLowerCase() === '000000' || m[1].toLowerCase() === 'ffffff';
    if (!pureBW && !hexToToken.has(`#${m[1].toLowerCase()}`)) {
      hexToToken.set(`#${m[1].toLowerCase()}`, `var(--d-${token})`);
    }
    // compressed #rgb form, if representable (e.g. #aa bb cc where each % 17 == 0)
    const shortKey =
      r % 17 === 0 && g % 17 === 0 && b % 17 === 0
        ? '#' + [r, g, b].map((c) => (c / 17).toString(16)).join('')
        : null;
    if (
      shortKey &&
      !pureBW &&
      !hexToToken.has(shortKey)
    ) {
      hexToToken.set(shortKey, `var(--d-${token})`);
    }
    if (!rgbToToken.has(key)) rgbToToken.set(key, { token });
    continue;
  }
  // rgba() form (e.g. semi-transparent edge-label backgrounds)
  const m2 = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*([\d.]+)?\s*\)$/i.exec(
    value,
  );
  if (m2) {
    const key = `${m2[1]},${m2[2]},${m2[3]}`;
    const fullKey = m2[4] && m2[4] !== '1' ? `${key}@${m2[4]}` : key;
    if (!rgbToToken.has(fullKey)) rgbToToken.set(fullKey, { token });
  }
}

/**
 * Mermaid hardcodes a few fallback colors in diagram renderers regardless of
 * theme variables (note fills, actor rects, drop shadows, error text…).
 * Map them onto semantic tokens so they adapt too.
 */
const aliasHex = {
  // NOTE: #000/#fff are deliberately NOT aliased — authors write them as
  // intentional label colors on colored chips; they must survive verbatim
  // so contrast survives theme flips.
  '#666': 'border',
  '#999': 'border',
  '#eaeaea': 'surface',
  '#eeeeee': 'surface-2',
  '#e0e0e0': 'border',
  '#edf2ae': 'note', // hardcoded sequence-note fill fallback
  '#efefef': 'surface-2', // mindmap node fill default
  '#ffd8b1': 'accent', // xychart default plot palette (overridden in themeCSS)
  '#fff4dd': 'accent', // xychart default plot palette (overridden in themeCSS)
  '#087ebf': 'accent', // architecture/block icon-placeholder tile
  // sankey-beta default node colors (Tableau palette constants)
  '#4e79a7': 'accent',
  '#f28e2c': 'note',
  '#e15759': 'crit',
  '#76b7b2': 'line',
  '#59a14f': 'done',
  // journey renderer constants — v11 ignores journey config sections, so
  // these are remapped directly onto semantic tokens.
  '#191970': 'surface-3', // section band (midnightblue)
  '#4b0082': 'surface-2', // section band variant (indigo)
  '#8b008b': 'border', // section band variant (darkmagenta)
  '#7cfc00': 'done', // task face (lawngreen)
  '#8fbc8f': 'done', // task face (darkseagreen)
  '#fff8dc': 'note', // actor face circle (cornsilk)
  // C4 renderer constants: external-element greys and relationship-label
  // ink are hardcoded regardless of theme variables.
  '#999999': 'surface-3', // external_person/system bg
  '#8a8a8a': 'border', // external element stroke
  '#444444': 'text', // relationship + boundary label fill
};
for (const [hex, token] of Object.entries(aliasHex)) {
  hexToToken.set(hex, `var(--d-${token})`);
}
// CSS named-color keywords mermaid hardcodes in some renderers
// (gitGraph commit/branch labels use literal "lightgrey").
const keywordToToken = new Map(
  Object.entries({
    lightgrey: 'border',
    lightgray: 'border',
    silver: 'border',
    grey: 'border',
    gray: 'border',
    whitesmoke: 'surface',
  }),
);
const KEYWORD_RE = /\b(lightgrey|lightgray|silver|grey|gray|whitesmoke)\b/gi;
rgbToToken.set('185,185,185', { token: 'border' }); // drop-shadow grey
// Mermaid internals emit white as rgb()/rgba() (e.g. .labelBkg backdrop);
// keep the rgb-form registered even though hex #ffffff stays author-owned.
if (!rgbToToken.has('255,255,255')) {
  rgbToToken.set('255,255,255', { token: 'bg' });
}
// NOTE: opaque black rgb(0,0,0) stays literal (author label color);
// only BLACK WITH ALPHA is treated as a shadow overlay in replaceRgb.

const RGB_RE =
  /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:[,/]\s*([\d.%]+)\s*)?\)/gi;
const RGB_SPACE_RE =
  /rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.%]+)\s*)?\)/g;
// Newer renderers (kanban, architecture…) emit theme colors as hsl()/hsla().
const HSL_RE =
  /hsla?\(\s*([\d.]+)(?:deg)?\s*(?:,\s*([\d.]+)%\s*,\s*([\d.]+)%|(?:\s+([\d.]+)%\s+([\d.]+)%))\s*(?:[,/]\s*([\d.%]+)\s*)?\)/gi;

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] : [c, 0, x];
  return [r, g, b].map((v) => Math.round((v + m) * 255));
}

function emitToken(hit, alpha) {
  if (!alpha || alpha === '1') return `var(--d-${hit.token})`;
  return `rgb(var(--d-${hit.token}-rgb) / ${alpha})`;
}

function replaceRgb(match, r, g, b, alpha) {
  const hasAlpha = alpha && alpha !== '1';
  // Tolerate float noise from mermaid's color math (e.g. 246.0000000001)
  const key = `${Math.round(+r)},${Math.round(+g)},${Math.round(+b)}`;
  const hit =
    (hasAlpha && rgbToToken.get(`${key}@${alpha}`)) ||
    (!hasAlpha && rgbToToken.get(key));
  if (!hit && hasAlpha) {
    // Exact alpha not registered: fall back to the opaque registration and
    // preserve the original alpha against its -rgb triplet.
    const plainHit = rgbToToken.get(key);
    if (plainHit) return `rgb(var(--d-${plainHit.token}-rgb) / ${alpha})`;
    // Black at ANY alpha is a shadow/overlay.
    if (key === '0,0,0') return `rgb(var(--d-shadow-rgb) / ${alpha})`;
    return match;
  }
  if (!hit) return match;
  if (!hasAlpha) return `var(--d-${hit.token})`;
  // Preserve alpha: site CSS defines --d-<token>-rgb as "r g b"
  return `rgb(var(--d-${hit.token}-rgb) / ${alpha})`;
}

function replaceHsl(match, h, s1, l1, s2, l2, alpha) {
  const s = s1 ?? s2;
  const l = l1 ?? l2;
  if (s === undefined || l === undefined) return match;
  const [r, g, b] = hslToRgb(+h, +s, +l);
  const key = `${r},${g},${b}`;
  const hasAlpha = alpha && alpha !== '1';
  const hit =
    (hasAlpha && rgbToToken.get(`${key}@${alpha}`)) ||
    (!hasAlpha && rgbToToken.get(key));
  if (!hit) return match;
  return emitToken(hit, hasAlpha ? alpha : undefined);
}

/**
 * @param {string} s
 * @param {boolean} allowKeywords - named colors appear as common English
 *   words ("gray"), so they're only rewritten in paint contexts.
 * @returns {string}
 */
export function tokenizeColors(s, allowKeywords = false) {
  let out = s.replace(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi, (hex) => {
    return hexToToken.get(hex.toLowerCase()) ?? hex;
  });

  if (allowKeywords) {
    out = out.replace(KEYWORD_RE, (kw) => {
      const token = keywordToToken.get(kw.toLowerCase());
      return token ? `var(--d-${token})` : kw;
    });
  }

  out = out.replace(RGB_RE, replaceRgb);
  out = out.replace(RGB_SPACE_RE, replaceRgb);
  out = out.replace(HSL_RE, replaceHsl);

  return out;
}

const PAINT_PROPS = new Set([
  'fill',
  'stroke',
  'color',
  'stop-color',
  'flood-color',
  'style',
  'background',
  'background-color',
]);

/** @type {import('unified').Plugin} */
export default function rehypeRecolorSvg() {
  return (tree) => {
    const visit = (node, inStyle = false, inC4External = false) => {
      if (!node) return;
      const isElement = node.type === 'element';
      const tag = isElement ? node.tagName : '';
      const styleCtx = inStyle || tag === 'style';

      let extCtx = inC4External;
      if (isElement) {
        const cls = String(node.properties?.className ?? '');
        if (cls.includes('c4-external')) {
          // C4 marks every external element; its label whites are
          // mermaid-internal (`?? "#FFFFFF"` fallback), not author intent,
          // so they flip with the theme like everything else.
          extCtx = true;
        }
      }

      if (node.type === 'element' || node.type === 'root') {
        for (const child of node.children ?? []) visit(child, styleCtx, extCtx);
      }
      if (!isElement) return;

      const rewrite = (value, allowKeywords) => {
        let s = value;
        if (extCtx) {
          s = s.replace(/#ffffff\b|#fff\b/gi, 'var(--d-text)');
        }
        return tokenizeColors(s, allowKeywords);
      };

      // <style> blocks inside the SVG carry most diagram colors as text;
      // visible label text must NOT go through the keyword pass.
      for (const child of node.children ?? []) {
        if (child.type === 'text' && typeof child.value === 'string') {
          child.value = rewrite(child.value, styleCtx);
        }
      }

      for (const [key, value] of Object.entries(node.properties ?? {})) {
        const kw = PAINT_PROPS.has(key);
        if (typeof value === 'string') {
          node.properties[key] = rewrite(value, kw);
        } else if (Array.isArray(value)) {
          node.properties[key] = value.map((v) =>
            typeof v === 'string' ? rewrite(v, kw) : v,
          );
        }
      }
    };
    visit(tree);
  };
}
