/**
 * Runtime utility modules.
 *
 * Single import surface for client-side and build-time helpers that
 * power interactive behavior and data access. Anything imported here
 * must be safe to call at runtime (browser or Node), with no build-
 * plugin coupling. Build-time AST transforms (rehype/remark/shiki)
 * live in `src/plugins/`, not here.
 *
 * Concrete color data (e.g. diagram palettes) lives in `src/data/`,
 * not here — utils/ holds behavior, not values.
 */

export { slugify } from "./slug";

// Workbench content pipeline
export { loadWorkbench } from "./github";
export { WorkbenchSchema } from "./schemas";
export type { WorkbenchFrontmatter } from "./schemas";
export type {
  WorkKind,
  Lifecycle,
  ResolvedSource,
  Violation,
  WorkbenchEntry,
} from "./types";

// Client-side behavior helpers
export { initThemeToggle, getStoredTheme, setStoredTheme } from "./theme";
export type { Theme } from "./theme";
export { initLightbox } from "./lightbox";
export { initDiagrams } from "./diagrams";
export { copyText } from "./clipboard";

// Pure runtime helpers
export { cssVarsBlock } from "./diagram-theme";
export type { Palette } from "./diagram-theme";
