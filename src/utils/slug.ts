/**
 * Generate a URL-safe slug from a title.
 * Single source of truth — used by the workbench content loader
 * and anywhere else a human-readable identifier is needed.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
