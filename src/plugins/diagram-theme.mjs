/**
 * Mermaid build config — theme variables, feed palette, and the final
 * mermaidConfig object consumed by rehype-mermaid.
 *
 * Strategy ("render concrete, tokenize after"):
 *   1. Mermaid renders ONCE at build time with the CONCRETE light palette
 *      (from `data/diagram-palette.js`), because its theme engine derives
 *      some colors via color math that cannot operate on `var(...)` strings.
 *   2. A post-processing rehype step (`rehype-recolor-svg.mjs`) rewrites
 *      every color literal in the resulting inline SVG into `var(--d-*)`
 *      tokens using the same palette as the lookup table.
 *   3. Site CSS defines those tokens differently under `.dark`.
 *      → ONE svg, both themes, zero duplication, zero client Mermaid.
 *
 * The pure runtime helper `cssVarsBlock(palette)` lives in
 * `utils/diagram-theme.ts`; the concrete color data lives in
 * `data/diagram-palette.ts`. This file owns only the build-time Mermaid
 * configuration: themeTokenMap, feedPalette, mermaidConfig.
 */

import { paletteLight } from "../data/diagram-palette.js";

/**
 * Every mermaid theme variable mapped to a palette token. Mapping to tokens
 * (not raw colors) keeps render palette and CSS tokens in lockstep.
 *
 * @type {Record<string, string>} mermaidThemeVariable → palette token
 */
const themeTokenMap = {
  primaryColor: 'surface',
  primaryTextColor: 'text',
  primaryBorderColor: 'border',
  secondaryColor: 'surface-2',
  secondaryTextColor: 'text',
  secondaryBorderColor: 'border',
  tertiaryColor: 'surface-3',
  tertiaryTextColor: 'text',
  tertiaryBorderColor: 'border',

  mainBkg: 'surface',
  nodeBorder: 'border',
  textColor: 'text',
  titleColor: 'text',
  lineColor: 'line',
  arrowheadColor: 'line',
  clusterBkg: 'surface-2',
  clusterBorder: 'border',
  edgeLabelBackground: 'edge-label',
  labelBoxBkgColor: 'surface-2',
  labelBoxBorderColor: 'border',
  labelTextColor: 'text',
  loopTextColor: 'text',

  noteBkgColor: 'note',
  noteTextColor: 'text',
  noteBorderColor: 'border',

  actorBkg: 'surface',
  actorBorder: 'border',
  actorTextColor: 'text',
  actorLineColor: 'line',
  signalColor: 'text',
  signalTextColor: 'text',
  activationBkgColor: 'surface-3',
  activationBorderColor: 'border',
  // autonumber digits are painted directly on the canvas — they must
  // contrast with the page, not with a circle that doesn't exist.
  sequenceNumberColor: 'text',

  classText: 'text',
  relationColor: 'line',
  relationColorActive: 'accent',
  attributeBackgroundColorOdd: 'surface',
  attributeBackgroundColorEven: 'surface-2',

  stateBkg: 'surface',
  stateBorderColor: 'border',
  transitionColor: 'line',
  transitionLabelColor: 'text',
  stateLabelColor: 'text',
  labelBackgroundColor: 'edge-label',
  compositeBackground: 'surface-2',
  compositeBorder: 'border',
  compositeTitleBackground: 'surface-3',
  altBackground: 'surface-2',

  sectionBkgColor: 'surface-2',
  sectionBkgColor2: 'surface',
  altSectionBkgColor: 'surface-3',
  gridColor: 'line',
  taskBkgColor: 'surface-2',
  taskBorderColor: 'border',
  taskTextColor: 'text',
  taskTextLightColor: 'text',
  taskTextOutsideColor: 'text',
  taskTextDarkColor: 'text',
  taskTextClickableColor: 'accent',
  activeTaskBkgColor: 'accent',
  activeTaskBorderColor: 'accent',
  doneTaskBkgColor: 'done',
  doneTaskBorderColor: 'border',
  critBkgColor: 'crit',
  critBorderColor: 'border',
  todayLineColor: 'accent',

  // misc defaults that otherwise resolve to shape-colored text or stale greys
  defaultLinkColor: 'line',
  vertLineColor: 'line',
  rectBkgColor: 'surface',
  excludeBkgColor: 'bg',
  errorBkgColor: 'note',
  errorTextColor: 'crit',
  rowOdd: 'surface',
  rowEven: 'surface-2',
  personBorder: 'border',
  personBkg: 'surface',
};

// Gantt/pie section colors: cycle palette surfaces so sections stay
// distinguishable without introducing off-palette hues.
const sectionCycle = ['surface-2', 'surface', 'surface-3'];
for (let i = 0; i < 12; i++) {
  themeTokenMap[`cScale${i}`] = sectionCycle[i % 3];
}
themeTokenMap.scaleLabelColor = 'text';

// Class-diagram gradient fills (useGradient) — map to flat surfaces.
const fillCycle = ['surface', 'surface-2', 'surface-3'];
for (let i = 0; i < 8; i++) {
  themeTokenMap[`fillType${i}`] = fillCycle[i % 3];
}

// gitGraph: branch colors are theme variables but get darken()/lighten()
// derived when unset — set them explicitly to stay on-palette. Label text
// (gitBranchLabelN) must be the ON-color of the pill (labelN = gitN).
const branchCycle = [
  'accent', 'crit', 'line', 'border', 'note', 'done', 'surface-3', 'accent',
];
for (let i = 0; i < 8; i++) {
  themeTokenMap[`git${i}`] = branchCycle[i];
}
Object.assign(themeTokenMap, {
  commitLabelColor: 'text',
  commitLabelBackground: 'edge-label',
  branchLabelColor: 'text',
  tagLabelColor: 'text',
  tagLabelBackground: 'surface-2',
  tagLabelBorder: 'border',
  gitBranchLabel0: 'on-accent',
  gitBranchLabel1: 'on-crit',
  gitBranchLabel2: 'bg',
  gitBranchLabel3: 'bg',
  gitBranchLabel4: 'text',
  gitBranchLabel5: 'text',
  gitBranchLabel6: 'text',
  gitBranchLabel7: 'on-accent',
});

// quadrantChart fills/text derive via adjust()/lighten() when unset.
Object.assign(themeTokenMap, {
  quadrant1Fill: 'surface-2',
  quadrant2Fill: 'surface',
  quadrant3Fill: 'surface-2',
  quadrant4Fill: 'surface-3',
  quadrant1TextFill: 'text',
  quadrant2TextFill: 'text',
  quadrant3TextFill: 'text',
  quadrant4TextFill: 'text',
  quadrantPointFill: 'accent',
  quadrantPointTextFill: 'text',
  quadrantXAxisTextFill: 'text',
  quadrantYAxisTextFill: 'text',
  quadrantTitleFill: 'text',
  quadrantInternalBorderStrokeFill: 'border',
  quadrantExternalBorderStrokeFill: 'border',
});

// mindmap/timeline section chips derive off-palette blends when unset.
const scaleCycle = ['surface', 'surface-2', 'surface-3'];
for (let i = 0; i < 12; i++) {
  themeTokenMap[`cScale${i}`] = scaleCycle[i % 3];
  themeTokenMap[`cScaleLabel${i}`] = 'text';
  themeTokenMap[`cScaleInv${i}`] = 'bg';
}
Object.assign(themeTokenMap, {
  rootBkg: 'accent',
  rootTextColor: 'on-accent',
});

// pie: slice % text is ONE variable for every slice, so all fills must
// pair with the same on-color. accent/crit alternate; both pair with
// on-accent/on-crit, which share the bg token's values in both themes.
for (let i = 0; i < 12; i++) {
  themeTokenMap[`pie${i + 1}`] = i % 2 === 0 ? 'accent' : 'crit';
}
Object.assign(themeTokenMap, {
  pieSectionTextColor: 'bg',
  pieTitleTextColor: 'text',
  pieLegendTextColor: 'text',
  pieStrokeColor: 'border',
  pieOuterStrokeColor: 'border',
  // Default 0.7 washes slices out and drops slice-label contrast below
  // 4.5 in both themes; fully opaque keeps accent/crit pairings intact.
  pieOpacity: '1',
});

/**
 * Per-diagram config sections. NOTE: v11 ignores xyChart.plotColorPalette
 * and journey.sectionFills (verified empirically) — chart series colors and
 * journey bands are handled by themeCSS overrides + tokenizer aliases.
 */
export const mermaidConfigExtra = {
  xyChart: {
    xAxisLabelFill: 'var(--d-text)',
    yAxisLabelFill: 'var(--d-text)',
    xAxisTitleFill: 'var(--d-text)',
    yAxisTitleFill: 'var(--d-text)',
    xAxisLineColor: 'var(--d-line)',
    yAxisLineColor: 'var(--d-line)',
    backgroundColor: 'transparent',
  },
};

/**
 * Values fed to Mermaid must never be pure black/white: those literals are
 * reserved for authors (they survive verbatim so chip-label contrast
 * survives theme flips). Near-twins (#fefefe) are visually identical,
 * keep darken()/lighten() math equivalent, and give the tokenizer an
 * unambiguous "pipeline-owned" signal.
 */
export const feedPalette = Object.fromEntries(
  Object.entries(paletteLight).map(([token, value]) => [
    token,
    value === '#ffffff' ? '#fefefe' : value,
  ]),
);

export const mermaidConfig = {
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  ...mermaidConfigExtra,
  // Targeted patches for rules Mermaid generates without a theme-variable
  // hook (class names carry section indexes, hence [class*=]).
  themeCSS: `
    text[class*="activeText"] { fill: var(--d-on-accent) !important; }
    text[class*="critText"] { fill: var(--d-on-crit, var(--d-on-accent)) !important; }
    g[class*="bar-plot"] rect { fill: var(--d-accent) !important; stroke: var(--d-accent) !important; }
    g[class*="line-plot"] path { stroke: var(--d-crit) !important; }
  `,
  themeVariables: {
    darkMode: false,
    background: 'transparent',
    fontSize: '15px',
    ...Object.fromEntries(
      Object.entries(themeTokenMap).map(([k, token]) => [
        k,
        feedPalette[token] ?? token,
      ]),
    ),
  },
};
