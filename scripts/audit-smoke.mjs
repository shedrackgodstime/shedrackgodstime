/**
 * Smoke test for the design-system audit rules.
 *
 * Verifies the regexes in `audit-rules.mjs`:
 *   - catch every legacy class name we care about
 *   - never flag 9-role names
 *   - never flag the same legacy token in non-class contexts
 *     (TS object keys, type-union members)
 *
 * Run with: `bun run scripts/audit-smoke.mjs`
 * This complements (but does not replace) the real audit on the rebuild
 * source tree (`bun run scripts/audit.mjs`).
 */
import {
  LEGACY_CLASS_RE,
  CLASS_DECL_RE,
} from "./audit-rules.mjs";

const check = (line) =>
  LEGACY_CLASS_RE.test(line) && CLASS_DECL_RE.test(line);

const shouldCatch = [
  'class="text-muted text-faint"',
  'class="bg-base border-line text-primary"',
  'class="text-accent-bright"',
  'class:list={["bg-card", "text-body"]}',
  'class:list={["text-muted text-faint"]}',
  ' class="bg-wash-soft px-3"',
  "class:list={[`text-body border-accent-bright`]}",
];
const shouldNotCatch = [
  '9-role: class="bg-surface text-text-muted text-text"',
  '9-role: class="bg-surface-raised border-line"',
  'TS key: "text-muted": "bg-text-muted",',
  'TS union: tone?: "accent" | "text-muted";',
  'TS union single-quote: tone?: accent | text-muted;',
  '9-role: text-accent border-accent-soft',
  '9-role: bg-accent-pill-bg bg-scrim-50',
  '9-role: rounded-pill min-h-button max-w-container leading-body',
  '9-role: text-h1 text-h2 text-h3 text-subtitle',
  '9-role: hover:bg-accent-fill-hover border-accent-fill-hover-soft',
];

let bad = 0;
for (const s of shouldCatch) {
  if (!check(s)) { console.error("MISSED catch:", s); bad++; }
}
for (const s of shouldNotCatch) {
  if (check(s)) { console.error("FALSE positive:", s); bad++; }
}
if (bad === 0) {
  console.log(`OK — ${shouldCatch.length} catches, ${shouldNotCatch.length} non-catches`);
} else {
  console.error(`FAIL — ${bad} mismatch(es)`);
  process.exit(1);
}
