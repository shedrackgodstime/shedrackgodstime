/**
 * Engine-side types for the workbench content pipeline.
 * Two kinds: project (built things) and exploration (investigated things).
 */

export type WorkKind = "project" | "exploration";

export type Lifecycle = "draft" | "active" | "completed" | "archived";

/** Where content came from — recorded per entry per build. */
export interface ResolvedSource {
  repo: string;
  ref: string;
  sha: string;
  path: string;
}

/** A contract violation — collected into the build-time report. */
export interface Violation {
  source: { repo: string; ref: string };
  kind: WorkKind | "unknown";
  reason: string;
}

/** A workbench entry ready for the Astro content collection. */
export interface WorkbenchEntry {
  id: string;
  body: string;
  data: {
    title: string;
    summary: string;
    type: WorkKind;
    status: Lifecycle;
    tags: string[];
    started?: string;
    updated?: string;
    context?: string;
    source?: string;
  };
  source: ResolvedSource;
}
