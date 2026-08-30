/**
 * Audit rules — shared regex constants and predicates.
 *
 * Imported by `audit.mjs` (the build-time check) and `audit-smoke.mjs`
 * (the development test). One source of truth for every regex the
 * design-system audit enforces, so the smoke test cannot drift from
 * the real check.
 */

// §1.2.3 — literal hex colors (#RGB, #RRGGBB) — allowed only in tokens.css
export const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;

// §1.2.3/§1.2.6 — magic alpha like /30, /8 in class values
export const ALPHA_RE = /\/[3-9]\b|\/[3-9][0-9]\b/;

// §1.2.3 — inline color-mix() in component class lists (should live in tokens only)
export const COLOR_MIX_INLINE_RE = /color-mix\(in\s+\w+,\s*var\(--color-/;

// §3.9 — legacy CSS variable names still referenced in components
export const LEGACY_RE = /--color-(accent-bright|base\b|heading\b|body\b|muted\b|subtle\b|soft\b|soft-strong|accent-solid)/;

// Hardcoded rgba() outside tokens.css
export const RGBA_RE = /rgba?\(/;

// §1.2.2 — arbitrary Tailwind values in class lists: `w-[123px]`,
// `text-[var(--token)]`, `duration-[120ms]`, `tracking-[0.04em]`.
// Requires a utility-name prefix (`\w+-[`) so JS object access like
// `}[variant]` and `arr[key]` is NOT falsely flagged.
export const ARB_RE = /[\w-]+-\[[^\]]+\]/;

// §3.9 — legacy Tailwind CLASS names (29-token → 9-role migration gate).
// The bare class names below are the legacy 29-token surface/text/accent
// utilities from the live site. The rebuild exposes the 9-role spec only,
// so these classes would silently do nothing — the denylist makes the
// regression visible.
//
// GATED by CLASS_DECL_RE: a legacy name only counts as a violation when
// the line is a class attribute. This exempts the same legacy token when
// it appears in non-class contexts (TS object keys, type-union members,
// comments) without needing to inspect quotes.
//
// Token boundaries (`(?<![-\w])` / `(?![-\w])`) ensure `bg-base` does NOT
// match inside `bg-base-soft` and 9-role names are not flagged.
//
// Magic-alpha forms like `bg-accent/30` are caught separately by ALPHA_RE.
export const LEGACY_CLASS_RE = new RegExp(
  "(?<![-\\w])(?:" +
    [
      // legacy surface backgrounds
      "bg-base",
      "bg-base-soft",
      "bg-card",
      "bg-card-hover",
      "bg-overlay",
      "bg-wash",
      "bg-wash-soft",
      // legacy text
      "text-primary",
      "text-heading",
      "text-body",
      "text-muted",
      "text-subtle",
      "text-faint",
      "text-soft",
      "text-soft-strong",
      // legacy accent
      "border-accent-bright",
      "text-accent-bright",
      "bg-accent-solid",
    ].join("|") +
    ")(?![-\\w])",
);

// Class-declaration marker. A line is a class context when it assigns to
// the `class` / `class:list` attribute. Covers the common Astro forms:
//   class="…"     class='…'     class={…}     class:list={…}
export const CLASS_DECL_RE = /class(?::list)?\s*=\s*["'{`]/;
