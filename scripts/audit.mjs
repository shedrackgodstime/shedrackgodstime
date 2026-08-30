import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  HEX_RE,
  ALPHA_RE,
  COLOR_MIX_INLINE_RE,
  LEGACY_RE,
  RGBA_RE,
  ARB_RE,
  LEGACY_CLASS_RE,
  CLASS_DECL_RE,
} from "./audit-rules.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(root, "src");

const EXIT = { ok: 0, fail: 1 };
let failures = 0;

function walk(dir, ext) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) results.push(...walk(p, ext));
    else if (extname(p) === ext) results.push(p);
  }
  return results;
}

function rel(p) { return root.endsWith("/") ? p.slice(root.length) : p.slice(root.length + 1); }

function isComment(line) {
  const t = line.trimStart();
  return t.startsWith("/*") || t.startsWith("*") || t.startsWith("//");
}

function auditFile(p) {
  const src = readFileSync(p, "utf8");
  const lines = src.split("\n");
  const relpath = rel(p);
  const isTokens = relpath.startsWith("src/styles/tokens.css");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isComment(line)) continue;

    if (!isTokens && HEX_RE.test(line)) {
      console.error(`FAIL ${relpath}:${i + 1} literal hex color (§1.2.3):`);
      console.error(`      ${line.trim()}`);
      failures++;
    }

    if (!isTokens && ALPHA_RE.test(line)) {
      console.error(`FAIL ${relpath}:${i + 1} magic alpha (§1.2.3/§1.2.6):`);
      console.error(`      ${line.trim()}`);
      failures++;
    }

    if (!isTokens && COLOR_MIX_INLINE_RE.test(line)) {
      console.error(`FAIL ${relpath}:${i + 1} inline color-mix() (§1.2.3):`);
      console.error(`      ${line.trim()}`);
      failures++;
    }

    if (!isTokens && LEGACY_RE.test(line)) {
      console.error(`FAIL ${relpath}:${i + 1} legacy token name (§3.9):`);
      console.error(`      ${line.trim()}`);
      failures++;
    }

    if (!isTokens && RGBA_RE.test(line) && !/\bvar\(--color-/.test(line)) {
      console.error(`FAIL ${relpath}:${i + 1} hardcoded rgba() (§1.2.3):`);
      console.error(`      ${line.trim()}`);
      failures++;
    }

    if (!isTokens && ARB_RE.test(line)) {
      console.error(`FAIL ${relpath}:${i + 1} arbitrary Tailwind value (§1.2.2):`);
      console.error(`      ${line.trim()}`);
      failures++;
    }

    if (!isTokens && LEGACY_CLASS_RE.test(line) && CLASS_DECL_RE.test(line)) {
      console.error(`FAIL ${relpath}:${i + 1} legacy Tailwind class — use 9-role (§3.9):`);
      console.error(`      ${line.trim()}`);
      failures++;
    }
  }
}

function auditDir(dir, ext) {
  for (const f of walk(dir, ext)) {
    try { auditFile(f); }
    catch (e) { console.error(`ERROR reading ${rel(f)}: ${e.message}`); }
  }
}

console.log(`=== Design-system audit (${rel(SRC)}) ===\n`);

auditDir(join(SRC, "styles"), ".css");
auditDir(join(SRC, "components"), ".astro");
auditDir(join(SRC, "pages"), ".astro");
auditDir(join(SRC, "layouts"), ".astro");

if (failures === 0) {
  console.log("PASS — no violations found.");
  process.exit(EXIT.ok);
} else {
  console.log(`\nFAIL — ${failures} violation(s) found.`);
  process.exit(EXIT.fail);
}
