# Design System & Architecture — Master Reference

Source of truth for the Shedrack Godstime portfolio: how the codebase is
structured (Astro + Tailwind) and how the visual system is governed
(tokens, starting with Color). Everything downstream — type, spacing,
components — plugs into the same governing law in §0 rather than
inventing its own discipline per section.

> **Status of this document.** PART 1 (Architecture), PART 2 (Color),
> PART 3 (Discipline) describe the **current shipped state** of the
> site at `src/styles/tokens.css` — what is actually rendering today.
> PART 4 is the **audit and remediation plan** (dated 2026-08-28) that
> captures every §1.2 violation in the live codebase and prescribes a
> 5-phase fix. The `shedrackgodstime/` subfolder at the repo root is
> the in-progress rebuild that targets a tighter 9-role palette; the
> "ideal" spec it implements is kept there as a working draft, not
> enforced here. Do not "fix" PART 2 by collapsing tokens toward the
> 9-role spec without completing Phase 4 of PART 4 first.

---

## 0. The Governing Law (applies to every section below)

> **A rule, a token, or a component is not created to solve a problem
> in front of you. It is created after the problem is proven to recur
> and nothing existing already covers it.**

This is the constitution the rest of the document enforces. Every
"Addition Gate" in every section (Color today; Type, Spacing, Components
later) is this same law applied to that section's vocabulary. If you're
tempted to add a new token, rule, or component, ask first: *has this
actually recurred, or am I solving a problem I'm imagining will recur?*

---

# PART 1 — ARCHITECTURE

## 1.1 Core Principle

Every styling decision must answer one question: **"Which layer owns
this?"**

| Layer | Owns | Never Owns |
|---|---|---|
| **Tailwind utilities** | Layout, spacing, sizing, typography scale, responsive breakpoints, state variants (hover/focus/active) | Design tokens, complex animation, brand-specific values |
| **CSS variables (tokens)** | Color palette, spacing scale, radius, shadow, font stacks, z-index scale | Layout logic |
| **Global CSS** | Resets, base element defaults, scrollbar/selection styling, truly global behavior | Component-specific rules |
| **Scoped component `<style>`** | Complex, one-off visual behavior that fights Tailwind (custom gradients, pseudo-elements, keyframes) | Anything expressible in 3–4 utility classes |
| **Astro components** | Structure, composition, data flow | Visual styling as a primary responsibility |

If you cannot name the layer a rule belongs to, you have not finished
designing your system — do not write the code yet.

## 1.2 Non-Negotiable Rules

1. **No file gets a CSS file "by default."** Scoped `<style>` blocks are earned, not assumed.
2. **No arbitrary values** (`w-[1247px]`, `gap-[37px]`) outside prototyping. Two occurrences → it becomes a token.
3. **No color literals in components.** Every color reference goes through a token. `bg-[#101827]` is a violation, full stop.
4. **No component exists without a reason** — reuse or conceptual meaning, never "looked cleaner extracted."
5. **No page-level styling decisions.** Pages compose sections; sections compose UI; UI consumes tokens.
6. **No duplicated token values.** Repeated raw utility values are a defect, not consistency.
7. **No mixing of responsibilities inside one file.** `Button.astro` never contains business logic; `Hero.astro` never redefines tokens locally.

## 1.3 Directory Structure

```
src/
├── assets/
│
├── components/
│   ├── ui/            # design-system primitives — Button, Card, Badge, Container, Section, Grid, Stack
│   ├── navigation/     # Header, Nav, MobileMenu
│   └── sections/         # Hero, Projects, Experience, Contact
│
├── layouts/
│   └── Layout.astro
│
├── pages/
│   ├── index.astro
│   ├── about.astro
│   └── projects/
│       └── index.astro
│
├── styles/
│   ├── global.css      # tokens + base resets
│   └── animations.css  # keyframes only
│
├── content/
│
└── lib/
```

**Rule:** `ui/` contains nothing that knows about site content. If a
component references "Projects" or "Hero" by name, it belongs in
`sections/`, not `ui/`.

## 1.4 The Layer Hierarchy (Build in This Order)

```
Design Tokens
     ↓
Layout Primitives   (Container, Section, Grid, Stack)
     ↓
UI Components        (Button, Card, Badge, Heading, Link)
     ↓
Sections              (Hero, Projects, Contact)
     ↓
Pages
```

Top-down, tokens first, is not optional. Pages-first with "extraction
later" produces drift you pay for in a rewrite.

## 1.5 Design Tokens (`global.css`)

```css
@import "tailwindcss";

:root {
  /* Color — see PART 2 for the governed role list and values */
  --color-surface: ...;
  --color-surface-raised: ...;
  --color-text: ...;
  --color-text-muted: ...;
  --color-text-faint: ...;
  --color-border: ...;
  --color-accent: ...;
  --color-accent-fill: ...;
  --color-on-accent: ...;

  /* Typography — governed when Type section is added */
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Spacing — governed when Spacing section is added */
  --space-section: 6rem;

  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;

  /* Shadow */
  --shadow-card: 0 10px 40px rgba(0, 0, 0, 0.15);
}

html { scroll-behavior: smooth; }

body {
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-sans);
}

::selection {
  background: var(--color-accent-fill);
  color: var(--color-on-accent);
}
```

**Tailwind v4 note:** prefer `@theme` for tokens over a parallel `:root`
block where possible — one source of truth, native utility classes
(`bg-surface`) instead of `bg-[var(--color-surface)]`.

**Belongs in `global.css` and nothing else:** CSS variables, `html`/`body`
base styles, `::selection`/scrollbar styling, `:focus-visible` and
reduced-motion defaults. **Never:** component-specific or page-specific rules.

## 1.6 Layout Primitives

```astro
---
// components/ui/Container.astro
---
<div class="mx-auto w-full max-w-6xl px-6">
  <slot />
</div>
```

```astro
---
// components/ui/Section.astro
---
<section class="py-24">
  <slot />
</section>
```

**Rule:** max-width, section padding, grid gaps are defined exactly
once, inside these primitives.

## 1.7 UI Components

```astro
---
// components/ui/Button.astro
interface Props {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
}
const { variant = "primary", href } = Astro.props;

const variants = {
  primary: "bg-[var(--color-accent-fill)] text-[var(--color-on-accent)] hover:opacity-90",
  secondary: "border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text-muted)]",
  ghost: "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
};

const Tag = href ? "a" : "button";
---
<Tag
  href={href}
  class:list={["rounded-md px-5 py-2.5 text-sm font-medium transition-colors", variants[variant]]}
>
  <slot />
</Tag>
```

**Rule:** variants are enumerated once, in one object, in one file.
Never a second `Button`-like component with slightly different styling.

## 1.8 When Scoped `<style>` Is Justified

Earned only for: custom gradient/grid-pattern backgrounds, keyframe
animation beyond Tailwind's transitions, pseudo-element-heavy effects,
component-specific CSS state machines (e.g. a terminal cursor blink).

```astro
<div class="grid-backdrop"><slot /></div>

<style>
  .grid-backdrop {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }
</style>
```

**Rule:** if expressible in 3–4 chained utilities, scoped CSS is a
violation of §1.2.1. Exception path, never default.

## 1.9 Sections vs. UI Components

`ui/` knows nothing about content. `sections/` knows content and
composes `ui/` to present it.

```astro
---
// components/sections/Projects.astro
import Section from "../ui/Section.astro";
import Container from "../ui/Container.astro";
import Card from "../ui/Card.astro";
import Heading from "../ui/Heading.astro";
const { projects } = Astro.props;
---
<Section>
  <Container>
    <Heading level={2}>Selected Projects</Heading>
    <div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => <Card {...p} />)}
    </div>
  </Container>
</Section>
```

No raw color, max-width, or padding value — everything flows through
primitives and tokens.

## 1.10 Pages

```astro
---
// pages/index.astro
import Layout from "../layouts/Layout.astro";
import Hero from "../components/sections/Hero.astro";
import Projects from "../components/sections/Projects.astro";
import Contact from "../components/sections/Contact.astro";
import { getCollection } from "astro:content";

const projects = await getCollection("projects");
---
<Layout title="Home">
  <Hero />
  <Projects projects={projects} />
  <Contact />
</Layout>
```

**Rule:** a page file with a raw `<div class="...">` carrying more than
one or two utility classes has markup that belongs in a section or UI
component instead.

## 1.11 Naming Conventions

| Type | Convention | Example |
|---|---|---|
| UI primitive | Noun, PascalCase, singular | `Button.astro`, `Card.astro` |
| Section | Noun matching content purpose | `Hero.astro`, `Projects.astro` |
| Layout | Suffix `Layout` | `Layout.astro`, `BlogLayout.astro` |
| CSS variable | `--<category>-<name>` | `--color-accent`, `--space-section` |
| Tailwind semantic alias (v4 `@theme`) | Same as token, no `--` duplication | `accent`, `surface` |

Never mix naming schemes within the same category.

## 1.12 Architecture Decision Tree

```
Need to style something?
│
├─ Is it layout, spacing, typography, or a state (hover/focus)?
│   └─ YES → Tailwind utility
│
├─ Is it a color, radius, shadow, or font that appears more than once?
│   └─ YES → CSS variable / theme token
│
├─ Is it a global default (html/body/selection/scrollbar)?
│   └─ YES → global.css
│
├─ Is it complex, custom visual behavior (gradients, keyframes, pseudo-elements)?
│   └─ YES → scoped component <style>
│
└─ None of the above → stop, reconsider whether this needs a new primitive
```

---

# PART 2 — COLOR (as shipped)

## 2.1 Principles

1. **Token-only references in components.** Every color use in `.astro` / `.css` outside `tokens.css` goes through a `var(--color-*)`. Zero raw hex in components (§1.2.3).
2. **Same token names in both themes.** `html.dark` overrides values; roles keep their meaning across themes.
3. **Surfaces, text, accent, lines are solid hex.** Hairline and overlay use a small set of `rgba()` mixes of the same base values (see §2.5). Decorative grid pattern is the only other rgba in use.
4. **Accessibility floor is WCAG AA** (4.5:1 small text, 3:1 large text/UI). Dark theme's text ladder clears AAA; light's `faint` is AA-gated (§2.6).
5. **No state-color tokens yet.** No `danger` / `success` / `warning` roles — known gap, not silent (§3.3).

## 2.2 Token Inventory (current)

Defined in `src/styles/tokens.css:15-138` under `@theme {}` (light) and
`html.dark {}` (dark). 13 light values + 16 dark values = 29 unique hex.

### Surfaces (4 tokens)

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--color-base` | `#f6f8f7` | `#080a0d` | Page background |
| `--color-base-soft` | `#eef2f0` | `#090d10` | Soft section bands |
| `--color-card` | `#ffffff` | `#0b0f12` | Card / panel surface |
| `--color-card-hover` | `#f0f5f2` | `#0e1418` | Card hover state |
| `--color-surface-muted` (9-role name) | `color-mix(raised 50%, surface)` | `color-mix(raised 50%, surface)` | Muted panel tier — a step off the page (GitHub file-view panel bg, `.content-panel`) |
| `--color-overlay` | `rgba(246,248,247,0.86)` | `rgba(8,10,13,0.86)` | Header / panel overlay |
| `--color-wash` | `rgba(238,242,240,0.8)` | `rgba(11,15,18,0.8)` | Subtle wash backgrounds |
| `--color-wash-soft` | `rgba(238,242,240,0.5)` | `rgba(11,15,18,0.5)` | Softer wash backgrounds |

### Text (8 tokens — kept as a ladder, not collapsed)

| Token | Light | Dark | Typical use |
|-------|-------|------|-------------|
| `--color-primary` | `#131c18` | `#f3f6f4` | Primary body / links |
| `--color-heading` | `#0b1210` | `#f6fbf8` | Headings (max contrast) |
| `--color-body` | `#33403b` | `#c9d2ce` | Body prose |
| `--color-muted` | `#55625d` | `#9da8a5` | Muted secondary text |
| `--color-subtle` | `#64716c` | `#8d9a97` | Subtle / meta |
| `--color-faint` | `#78857f` | `#83908c` | Faintest legible text |
| `--color-soft` | `#414e49` | `#b8c4c0` | Soft text variant |
| `--color-soft-strong` | `#232e2a` | `#dce7e3` | Stronger soft text |

> **Note on the ladder.** §2 of the working spec at `shedrackgodstime/`
> targets a collapsed 3-tier text system (`text` / `text-muted` /
> `text-faint`). The current shipped site keeps the 8-token ladder; do
> not collapse here without a parallel `tokens.css` rewrite.

### Accent (4 tokens)

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--color-accent` | `#0b6d50` | `#7dd3b9` | Links, focus, brand marks |
| `--color-accent-fill-hover` | `#083f30` | `#ecfdf5` | Hover / pressed accent |
| `--color-accent-fill` | `#0b6d50` | `#d8f7ed` | Filled pill / button bg |
| `--color-on-accent` | `#ffffff` | `#07100d` | Text sitting on `accent-fill` |

### Lines (2 tokens + grid)

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--color-line` | `rgba(15,26,22,0.12)` | `rgba(226,232,240,0.12)` | Hairline dividers |
| `--color-line-strong` | `rgba(15,26,22,0.18)` | `rgba(226,232,240,0.18)` | Stronger dividers |
| `--grid-line-a` | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.028)` | Body grid pattern (decorative) |
| `--grid-line-b` | `rgba(0,0,0,0.042)` | `rgba(255,255,255,0.024)` | Body grid pattern (decorative) |

## 2.3 Contrast Baseline (WCAG) — current

Computed by `bun run check:contrast` against the actual hex above. Token
names are abbreviated; full names in §2.2.

| Foreground | On `base` (L) | On `card` (L) | On `base` (D) | On `card` (D) | Gate |
|------------|---------------|---------------|---------------|---------------|------|
| `primary` | high | high | high | high | AAA |
| `heading` | high | high | high | high | AAA |
| `body` | high | high | AAA | high | AAA/AA |
| `muted` | AA | AA | AAA | AAA | AA |
| `subtle` | AA | AA | AA | AA | AA |
| `faint` | **AA** | **AA** | AA | AA | AA — gated §2.6 |
| `accent` (L `#0b6d50`) | AA | AA | — | — | AA |
| `accent` (D `#7dd3b9`) | — | — | AAA | AAA | AAA |
| `on-accent` on `accent-fill` | AA | AA | AAA | AAA | AA / AAA |

`line` / `line-strong` are decorative; focus visibility uses `accent`
(≥3:1 non-text contrast). `accent-fill-hover` is a hover/pressed variant —
not a text foreground, so the text floor does not apply.

## 2.4 Stray values (outside the token system)

| Where | Value | Action |
|-------|-------|--------|
| `src/data/config.ts:15` | `#2563eb` | `themeColor` — used only for the `<meta name="theme-color">` browser/OS chrome tag. Not a UI token. Leave as-is. |

## 2.5 Alpha mixes (current)

The shipped site uses `rgba()` directly rather than `color-mix(in oklch, ...)`:

- `--color-overlay` = base at 0.86
- `--color-wash` = base-soft at 0.8
- `--color-wash-soft` = base-soft at 0.5
- `--color-line` = primary at 0.12
- `--color-line-strong` = primary at 0.18
- `--grid-line-a/b` = black/white at very low alpha (decorative only)

When a new state is needed (e.g. disabled text), prefer the pattern
from §3.6 of the working spec (`color-mix(in oklch, var(--color-text) 40%, transparent)`).
Do not add a new `--color-*-disabled` token.

## 2.6 `faint` margin rule

`--color-faint` in light mode sits near the AA floor (4.78:1 on
`base`). The same usage rule from the working spec applies here:

- **Large-text/UI gate only** (≥14px bold, ≥18px regular, or non-text UI).
- A small-text / thin / primary-meaning use of `faint` is a signal the
  value needs revisiting, not a license to ship it.
- Dark-mode `faint` (`#83908c`) has more headroom and is fine at body size.

---

# PART 3 — DISCIPLINE & ENFORCEMENT

Applies the Governing Law (§0) to Color as it currently ships; the same
pattern governs Type, Spacing, and Components as they're added — each
gets its own §3.x addition gate rather than a new discipline system.

## 3.1 The Addition Gate (Color, current)

Before a new `--color-*` token is added to `tokens.css`, **all** must be
true:

- [ ] Need has appeared in **at least 2 unrelated components**, not the one being built now
- [ ] None of the existing tokens in §2.2 can serve it, including via `rgba()` alpha mix or `color-mix()` derivation
- [ ] New token has a **stated semantic role**, not a component name (`--color-warning`, never `--color-form-error-text`)
- [ ] Defined for **both themes** in the same PR
- [ ] Contrast ratio computed by `bun run check-contrast` and entered into §2.3 **before merge**
- [ ] §2.2 inventory updated in the same change

Missing any checkbox = draft, not a change.

> **Tighten-toward-9 exception.** The 9-role spec at
> `shedrackgodstime/` is the future state. A PR that *removes* a token
> by collapsing it into an existing role is welcomed and exempted from
> the "2 unrelated components" rule — provided the new combined role
> preserves the contrast gate of every previous use.

## 3.2 Out of scope today (but not removed)

These tokens exist in the current palette but are not actively used in
new components. They stay until the rebuild clears them:

| Token | Re-enters / stays only if |
|-------|---------------------------|
| `--color-base-soft` | A section band needs a distinct-from-base surface that `card` is too contrasty for |
| `--color-wash` / `--color-wash-soft` | A background treatment recurs across ≥2 sections and can't be expressed via `card` + alpha |
| `--color-overlay` | A sticky header / drawer / modal ships |
| `--color-card-hover` | A card gains a real hover state (currently unused — see §3.7) |
| `--color-line-strong` | A divider needs more weight than `line` provides |
| `--grid-line-a` / `--grid-line-b` | The decorative body grid ships and needs states beyond its single use |

A component that "needs" one of these usually doesn't — use an existing
token, or finish the design before inventing a new one.

## 3.3 State colors — explicit deferral

No `danger` / `success` / `warning` roles exist yet. Known gap, not
silent.

- Any component needing validation/status color is **blocked** from ad
  hoc hex or borrowing `accent` for a non-accent meaning.
- Status roles are added as a **single batch** (light + dark + computed
  contrast, same saturation/lightness logic as the accent family), not
  one at a time as forms get built.
- Until then, status UI is a marked placeholder in code — not silently
  shipped on a borrowed token.

## 3.4 The `accent` / `accent-fill` asymmetry — recorded

Light mode shares one hex (`#0b6d50`) between `accent` and
`accent-fill`; dark mode splits them. **In the shipped site this is
not a deliberate design decision** — it's a side effect of the dark
accent being lifted for contrast. The 9-role spec at
`shedrackgodstime/` does this intentionally (light shares by design;
dark splits by design). Do not "fix" it here.

Any component where a link sits *inside* a filled button (the one case
where the two would collide in light mode) must be checked in both
themes before merge.

## 3.5 `faint` margin rule

`--color-faint` in light mode (`#78857f`) sits at the AA floor.

- Restricted to the **large-text/UI-component gate (3:1) context** —
  captions, meta, kicker at ≥14px bold or ≥18px regular. Never body
  copy, never small single-weight text carrying primary meaning.
- A use case at small/thin/primary-meaning text is a signal the *value*
  needs revisiting — not that today's number makes it fine.
- Dark-mode `faint` (`#83908c`) has more headroom and is fine at body size.

## 3.6 Disabled / inactive states

Not covered by an alpha token — disabled is a reduction in presence, not
a state mix of an existing role.

- Disabled text = `color-mix(in oklch, var(--color-primary) 40%, transparent)`; equivalent reduced-opacity mix for fills — same formula both themes.
- Exempt from the AA floor (WCAG's own inactive-UI carve-out) but must
  remain visually distinguishable from its active counterpart at a
  glance. If it isn't, the mix percentage is wrong, not the rule.

## 3.7 Enforcement Checklist — Architecture (every component PR)

- [ ] Zero hex/rgb color literals outside `tokens.css` (excludes `config.ts:15` meta theme-color)
- [ ] **Zero arbitrary Tailwind values** (`text-[clamp(...)]`, `px-[18px]`, `max-w-[1320px]`, `min-h-[44px]`, `leading-[1.6]`, `gap-4.5`, `bg-accent/34`, `backdrop-blur-[18px]`, `color-mix(in srgb, ...)` inlined in a class) — see §4.2
- [ ] Zero duplicated `max-w-*`/`px-*`/`py-*`/`leading-*` combos outside `Container` / `Section` / `Heading` (see §4.3)
- [ ] Zero component `.css` files unless §1.8 justification applies
- [ ] Zero business/content logic inside `components/` (`PhotoGallery.astro` is a known exception — flagged in §4.5)
- [ ] Zero raw utility soup inside `pages/` — section blocks (≥4 utility classes on a `<section>` or `<div>`) belong in `sections/` (see §4.4)
- [ ] Every reused visual pattern (3+ occurrences) extracted into a token or component
- [ ] Every color/spacing value traces back to a single token definition
- [ ] All page-header, section, container, button, tag, heading, and status-dot patterns use the primitives from `components/ui/` (Phase 2 — §4.6)

## 3.8 Enforcement Checklist — Color (every color-touching PR)

- [ ] Every color reference resolves to one of the §2.2 tokens or a §3.1-gated addition — zero raw hex in component code
- [ ] No new `--color-*-hover`/`-active`/`-disabled` tokens — state is `color-mix()` at the call site (§3.6)
- [ ] No magic alpha in utility classes (`bg-accent/8`, `text-accent/34`, `border-accent/30`) — promote to a token in §2.2 (e.g. `--color-accent-pill-bg`)
- [ ] No inline `color-mix()` in component class lists — promote to a token or scoped class in `components.css`
- [ ] Both themes touched together, never one patched alone
- [ ] §2.3 contrast table updated if any value changed
- [ ] §2.2 inventory updated if any token added or removed
- [ ] No token named after a component (`--color-card-border` is a violation; use `line`)
- [ ] `faint` usage checked against §3.5 before merge

Unchecked box on either checklist = the PR is a leak, not a change.
Block it.

## 3.9 Sprint Order & Migration Tracker

The phases below are the only sanctioned order of operations. Do not
reorder, do not skip, do not start a later phase before its predecessor
lands. Each phase = one PR (or one tightly-scoped PR set).

| Phase | Goal | Status |
|------:|------|--------|
| 0 | This audit (PART 4 of this document) | **Done** |
| 1 | Token promotion: every magic value in components/pages becomes a `--*` token in `tokens.css`. **Zero visual change.** | **Done** (rebuild at `shedrackgodstime/src/styles/tokens.css`) |
| 2 | Primitive components in `components/ui/` (Container, Section, PageHeader, Button, Heading, Kicker, Lede, Tag, StatusDot). Pages shrink. | **Done** (`shedrackgodstime/src/components/ui/`) |
| 3 | Section components in `components/sections/` (AboutHero, Philosophy, Experience, Education, Skills, ContactStrip, ContactHero, ContactTopics). `about.astro` and `contact.astro` become thin compositions. | Pending (no live pages yet in rebuild) |
| 4 | Color collapse: 13-light/16-dark token set → 9-role spec. **High visual-risk phase** — Playwright diff mandatory. | **Done** (`--color-line` now `color-mix()` of `--color-text`) |
| 5 | CI enforcement: `bun run audit` greps for arbitrary values, raw hex, and inline `color-mix()`; fails the build on violation. | **Done** (`scripts/audit.mjs` + `prebuild` hook) |

Phases 1–3 are mechanical (no design change). Phase 4 is the design
change. Phase 5 locks the wins. No phase is a "do as you go" task.

---

# PART 4 — AUDIT & REMEDIATION PLAN

The live site at `src/` looks polished but systematically violates
§1.2. PART 4 captures the findings, sizes the damage, and prescribes
the fix. Future audits live alongside this section; each one appends
to the §4.1 history.

## 4.1 Audit History

| Date | Scope | Findings | Plan ref |
|------|-------|---------:|---------:|
| 2026-08-28 | Full `./src/` (12 files in `components/`, 7 in `pages/`, 4 CSS, 1 layout) | 75+ arbitrary Tailwind values; 15+ duplicated utility patterns; flat `components/` violates §1.3; `about.astro` and `contact.astro` are utility soup | §4.2 – §4.6 |

## 4.2 §1.2.2 Violations — Arbitrary Tailwind Values

**75+ instances** of arbitrary values across components and pages. Per
§1.2.2: *"No arbitrary values (`w-[1247px]`, `gap-[37px]`) outside
prototyping. Two occurrences → it becomes a token."* — almost every
arbitrary value in the current codebase has more than two occurrences
and is therefore already a violation.

### Grouped by pattern

| Pattern | Count | Where | Token candidate |
|---------|------:|-------|-----------------|
| `text-[clamp(2.4rem,6vw,4.5rem)]` (page H1) | 2 | `about`, `contact` | `--text-h1` already exists in `tokens.css` — use it |
| `text-[clamp(1.8rem,4vw,2.8rem)]` (page H2) | 4 | `about` | `--text-h2` already exists — use it |
| `text-[clamp(1.6rem,3.6vw,2.5rem)]` (CTA H2) | 2 | `about`, `404` | `--text-h2-cta` already exists — use it |
| `text-[clamp(1.08rem,2.2vw,1.35rem)]` (lede) | 3 | `about`, `contact`, `workbench/index` | `--text-body-responsive` already exists — use it |
| `text-[clamp(2rem,7.5vw,3.2rem)] sm:text-[clamp(3.4rem,6.8vw,6.4rem)]` (hero H1) | 1 | `Hero` | Add `--text-h1-hero` / `--text-h1-hero-sm` |
| `text-[clamp(4rem,14vw,8rem)]` (404 numeral) | 1 | `404` | Add `--text-display` or accept as one-off with comment |
| `text-[1rem]` (kicker override) | 1 | `Hero` | Use existing `text-button` or `text-regular` |
| `px-[clamp(18px,4vw,56px)]` (page gutter) | 7 | `about`, `contact`, `404`, `Hero` (×4 inside complex class) | `--space-gutter` already exists — **use it** |
| `py-[clamp(48px,6vw,72px)]` (section pad) | 8 | `about`, `contact`, `workbench/[slug]` | `--space-section` already exists — **use it** |
| `pt-[clamp(48px,6vw,80px)]` (page header top) | 2 | `about`, `contact` | `--space-page-header-pt` already exists — **use it** |
| `pb-[clamp(36px,5vw,60px)]` (page header bottom) | 2 | `about`, `contact` | `--space-page-header-pb` already exists — **use it** |
| `pt-[58px] sm:pt-[clamp(52px,7vw,92px)]` (hero pt) | 1 | `Hero` | Add `--space-hero-pt` / `--space-hero-pt-sm` |
| `pb-[42px] sm:pb-[clamp(36px,6vw,68px)]` (hero pb) | 1 | `Hero` | Add `--space-hero-pb` / `--space-hero-pb-sm` |
| `gap-[clamp(28px,6vw,80px)]` (hero gap) | 1 | `Hero` | Add `--space-hero-gap` |
| `max-w-[1320px]` (container) | 4 | `about`, `contact`, `workbench/index`, `Hero` | Already in `.container` class in `components.css` — **use it** |
| `max-w-[1300px]` (workbench slug container) | 2 | `workbench/[slug]` | RESOLVED — slug chrome on `<Container>` (1320); markdown in a bordered `.content-panel` at container width holding a `max-w-content` (992) column, GitHub file-view style |
| `max-w-[840px] / 820px / 780px / 760px / 720px / 650px / 640px / 520px` | 8+ | various | RESOLVED for long-form — `--max-width-content` (992) / `--max-width-prose` (760) / `--max-width-prose-wide` (840) exposed via `<Container width="content/prose/prose-wide">` |
| `min-h-[76px]` (header) | 1 | `Header` | Add `--height-header` |
| `min-h-[44px]` (button) | 2 | `about`, `404` | Add `--height-button` |
| `min-h-[36px]` (nav link) | 1 | `Header` | Add `--height-nav-link` |
| `leading-[0.98] / [1.1] / [1.6] / [1.65] / [1.7]` | 12 | `about`, `contact`, `404` | Add `--leading-page-h1`, `--leading-h2`, `--leading-body-content`, `--leading-prose-content`, `--leading-list` |
| `gap-4.5 / mb-4.5 / px-4.5 / mt-3.5 / p-4.5` (Tailwind ½-step) | 8 | various | Add `--spacing-1-5` / `--spacing-3-5` / `--spacing-4-5` (or normalize to whole-step scale) |
| `border-accent-bright/20` (button border) | 4 | `about`, `404` | Add `--color-accent-bright-soft` (= `color-mix(... transparent 80%)`) |
| `bg-accent/8` (pill bg) | 2 | `about`, `workbench/[slug]` | Add `--color-accent-pill-bg` |
| `border-accent/30` (pill border) | 2 | `about`, `workbench/[slug]` | Add `--color-accent-pill-border` |
| `bg-accent/6` (pill bg alt) | 2 | `about`, `workbench/[slug]` | Same as `/8` — collapse to one token |
| `text-accent/34` (active nav) | 1 | `Header` | Add `--color-accent-active` |
| `bg-base/80` (caption scrim) | 1 | `PhotoGallery` | Add `--color-scrim-80` |
| `bg-base/95` (lightbox scrim) | 1 | `PhotoGallery` | Add `--color-scrim-95` |
| `min-h-[min(600px,calc(100vh-76px))]` (hero) | 1 | `Hero` | Add `--height-hero-min` (CSS calc) |
| `w-[34px] h-[34px]` (theme toggle) | 1 | `ThemeToggle` | Add `--size-icon-button` |
| `w-[96px] h-[96px]` (portrait thumb) | 1 | `about` | One-off — use `size-24` (Tailwind built-in) |
| `backdrop-blur-[18px]` (header) | 1 | `Header` | Add `--blur-header` |
| `px-[9px] sm:px-3` (nav link px) | 1 | `Header` | Add `--space-nav-px` / `--space-nav-px-sm` |
| `max-w-[90vw] max-h-[85vh] / max-h-[85vh]` (lightbox) | 3 | `PhotoGallery` | One-off — `90vw`/`85vh` is viewport-relative and intentional |
| `lg:bottom-[clamp(36px,6vw,68px)]` (hero status pos) | 1 | `Hero` | Same value as hero pb — token it |
| `bg-[color-mix(in_srgb,var(--color-base)_58%,transparent)]` (hero status) | 1 | `Hero` | Add `--color-scrim-58` (matches `bg-base/58` intent) |
| `bg-[linear-gradient(90deg,...)]` (hero gradient) | 1 | `Hero` | This is the only complex gradient — promote to `.hero-backdrop` class in `components.css` |
| `text-accent/34` repeated (also counts above) | — | — | — |

### Subtotal

- **~25 distinct arbitrary patterns**, most with 2–8 occurrences each.
- **~12 of these already have tokens defined but are not being used** — the simplest, safest sweep.
- **~13 require new tokens** added in Phase 1.

## 4.3 §1.2.6 Violations — Duplicated Utility Patterns

The 15 highest-impact duplications. Each must be eliminated by Phase 2
(extract to a component) or Phase 1 (extract to a token).

| Pattern | Files | Count | Extract to |
|---------|-------|------:|------------|
| Page header: `px-[clamp(18px,4vw,56px)] pt-[clamp(48px,6vw,80px)] pb-[clamp(36px,5vw,60px)] border-b border-line bg-wash-soft` | `about`, `contact`, (also defined as `.page-header` in `components.css`) | 2 inline + 1 class | `PageHeader.astro` |
| Section body: `px-[clamp(18px,4vw,56px)] py-[clamp(48px,6vw,72px)]` | `about` ×4, `contact` ×1 | 5 | `Section.astro` |
| Container: `max-w-[1320px] min-w-0` | `about`, `contact`, `workbench/index`, `Hero` | 4 | `Container.astro` (the `.container` class in `components.css` already exists — wrap it) |
| H1 page: `m-0 mb-4.5 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.98] font-bold text-primary` | `about`, `contact` | 2 | `Heading.astro` `level="1"` |
| H1 page (tokenized variant): `m-0 mb-4.5 text-[var(--text-h1)] leading-[var(--leading-tight)] font-bold text-primary` | `workbench/index` | 1 | Same component, after token cleanup |
| H2 page: `m-0 text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-bold text-primary` | `about` ×4 | 4 | `Heading.astro` `level="2"` |
| Lede paragraph: `max-w-[780px] m-0 ... text-body text-[clamp(1.08rem,2.2vw,1.35rem)] leading-[1.6]` | `about`, `contact`, `workbench/index` | 3 | `Lede.astro` or `Heading.astro` `as="lede"` |
| Primary button: `inline-flex items-center justify-center min-h-[44px] px-4.5 py-3 bg-accent-solid text-on-accent font-bold text-button border border-accent-bright/20 hover:border-accent hover:bg-accent-bright transition-colors` | `about`, `404` | 2 inline + unused `.btn-primary` class in `components.css` | `Button.astro` `variant="primary"` |
| Ghost button: same skeleton, `text-soft-strong ... hover:text-accent-bright` | `about`, `404` | 2 inline + unused `.btn-ghost` class | `Button.astro` `variant="ghost"` |
| Tag chip inline: `px-2.5 py-1 border border-line text-soft text-micro font-mono` | `about`, `workbench/[slug]` | 4 | `Tag.astro` `variant="muted"` (the `.tag-chip` class in `components.css` is the same — wrap it) |
| Status pill: `px-2.5 py-1 border border-accent/30 bg-accent/6 text-accent text-micro font-mono` | `about`, `workbench/[slug]` | 2 | `Tag.astro` `variant="accent"` |
| Active status dot: `w-1.5 h-1.5 rounded-full bg-accent animate-pulse` | `about` (×1), `Hero` (×1), `workbench/[slug]` (×1 plain, not pulsing) | 2 + 1 plain | `StatusDot.astro` |
| `kicker mb-3` paragraph | `about` ×6 | 6 | `Kicker.astro` (or keep as utility — already in `tokens.css`) |
| Filter pill: `px-2.5 py-1.5 border border-line text-soft` | `workbench/index` ×2 | 2 | `Tag.astro` `variant="filter"` |
| Filter pill active: `px-2.5 py-1.5 border border-accent bg-accent/8 text-accent font-bold` | `workbench/index` ×1 | 1 | Same component, `variant="filter-active"` |

**Net effect of Phase 2**: `about.astro` shrinks from 205 → ~50 lines;
`contact.astro` from 156 → ~30 lines; `workbench/index.astro` from
105 → ~40 lines; `workbench/[slug].astro` from 124 → ~60 lines.

## 4.4 §1.2.5 / §1.10 Violations — Pages Are Utility Soup

`about.astro` (205 lines) and `contact.astro` (156 lines) are the
violations. They contain 6 and 2 inlined `<section>` blocks respectively,
each carrying 5–10 utility classes. Per §1.10, this markup belongs in
section components.

After Phase 3:

- `about.astro` should look like:
  ```astro
  <Layout title={...} description={...}>
    <main>
      <AboutHero />
      <Philosophy />
      <Experience items={experienceTimeline} />
      <Education items={educationTimeline} />
      <Skills categories={skillCategories} />
      <ContactStrip />
    </main>
  </Layout>
  ```
  (≤30 lines, zero arbitrary values, zero utility soup.)

- `contact.astro` should look like:
  ```astro
  <Layout title={...} description={...}>
    <main>
      <ContactHero />
      <ContactTopics topics={contactTopics} />
    </main>
  </Layout>
  ```
  (≤20 lines.)

## 4.5 §1.2.7 / §1.7 Violations — Mixed Responsibilities

### `PhotoGallery.astro` (179 lines)

The component is 89 lines of markup + 90 lines of inline `<script>`
for lightbox behavior. Per §1.2.7 (`Button.astro` never contains
business logic; `Hero.astro` never redefines tokens locally), a
component shouldn't own its own complex client behavior.

**Remediation** (Phase 3):

- Split: `Gallery.astro` (markup only) + `gallery.ts` (lightbox
  controller, imported by the consuming page or hoisted by Astro).
- Or: accept this as a §1.7 exception — PhotoGallery *is* the
  controller, and splitting it across two files adds wiring for no
  reuse benefit. **Recommended**: keep co-located, add comment
  noting the exception.

### `Header.astro` — navigation logic

Inline route-matching (`item.path === "/" ? currentPath === "/" : ...`).
This is fine for one nav config but should be lifted to a `lib/nav.ts`
helper if it ever duplicates. Currently single-use — leave it.

### `Layout.astro` — 130 lines of inline scripts

The diagram zoom/expand/copy logic is 130 lines of `<script>` in the
layout. This is the right home for it (it's a global concern that
needs to listen at document level for content rendered by rehype
plugins), but it should move to `src/scripts/diagrams.ts` and be
imported — same justification as PhotoGallery.

## 4.6 §1.3 Violations — Flat Component Directory

`src/components/` is flat (8 files). The spec mandates:

```
src/components/
├── ui/            # primitives — Button, Card, Badge, Container, Section, Grid, Stack, Heading, Tag, Kicker, StatusDot
├── navigation/    # Header, Nav, MobileMenu
└── sections/      # Hero, TechnicalAreas, FeaturedWorkbench, AboutHero, Philosophy, Experience, Education, Skills, ContactStrip, ContactHero, ContactTopics, WorkbenchList, WorkbenchEntry
```

**Phase 2 introduces `ui/` and `navigation/`.** `sections/` is created
in Phase 3 as the section components are extracted.

Current components get re-homed:

| Current | New location |
|---------|--------------|
| `CallToAction.astro` | `sections/CallToAction.astro` |
| `FeaturedWorkbench.astro` | `sections/FeaturedWorkbench.astro` |
| `Footer.astro` | `navigation/Footer.astro` (or stays at root if no nav lib) |
| `Header.astro` | `navigation/Header.astro` |
| `Hero.astro` | `sections/Hero.astro` |
| `PhotoGallery.astro` | `ui/Gallery.astro` (with lightbox, §4.5) |
| `TechnicalAreas.astro` | `sections/TechnicalAreas.astro` |
| `ThemeToggle.astro` | `navigation/ThemeToggle.astro` (or `ui/`) |

## 4.7 The Five Phases (Detailed)

### Phase 0 — Audit documentation — **DONE**

This section. The migration table in §3.9 is the live tracker.

### Phase 1 — Token promotion (single PR, low risk)

**Goal**: every magic value in components/pages becomes a `--*` token
in `tokens.css`. Visual output is byte-identical.

**Procedure**:

1. Capture a baseline: `bun run build` into `dist-baseline/`.
2. Take Playwright screenshots of `/`, `/about`, `/contact`,
   `/workbench`, one workbench slug, and `/404` at desktop (1280px)
   and mobile (390px) widths in light + dark (8 conditions total).
3. Add every token listed in §4.2's "Token candidate" column to
   `tokens.css` under `@theme` (or `:root` for non-color tokens —
   see §1.5).
4. Sweep every component and page replacing literal values with token
   references. Allowed: `text-[var(--text-h1)]`. Forbidden going
   forward: `text-[clamp(...)]` unless in a `@utility` in `tokens.css`.
5. `bun run build` and compare `dist/` against `dist-baseline/`:
   - Same hash for the same route in the same theme = success.
   - Visual diff via Playwright screenshot.
6. `bun run check:contrast` must still pass.
7. Update §2.2 / §2.3 if any new color token was added.

**No design change. Pure refactor.** This is the foundation — every
later phase builds on it.

### Phase 2 — Primitive components (1–2 PRs, low risk)

**Goal**: every duplicated utility pattern in §4.3 lives in exactly
one component file. Pages compose primitives; they don't re-implement
them.

**New files** in `src/components/ui/`:

| File | Replaces |
|------|----------|
| `Container.astro` | every `max-w-[1320px] min-w-0` div (4×) + `.container` class in `components.css` |
| `Section.astro` | every `px-[clamp(...)] py-[clamp(...)] border-b border-line` (8×) — wraps `.page-header` and `.section-body` |
| `PageHeader.astro` | the `about` / `contact` / `workbench-index` page-header block (3×) |
| `Button.astro` | the 4 inline button skeletons (4×) + the unused `.btn-primary` / `.btn-ghost` classes in `components.css` — **delete the classes once Button.astro ships** |
| `Heading.astro` | every h1/h2 h3 with `m-0 mb-X text-[clamp(...)] leading-X font-bold text-primary` (≥12×) — takes `level` prop and uses the tokens from Phase 1 |
| `Tag.astro` | `.tag-chip` + 4 inline variants (pill, filter, filter-active) |
| `StatusDot.astro` | the 3 `w-1.5 h-1.5 rounded-full bg-accent` indicators (one of which animates) |
| `Kicker.astro` | the 6 `kicker mb-3` paragraphs in `about.astro` (or keep as utility — TBD) |

**Procedure**:

1. Add the new components.
2. Sweep every page and section to use them.
3. Delete `.btn-primary`, `.btn-ghost`, `.tag-chip` from `components.css`
   once their replacements exist in `.astro` files.
4. `bun run build`; visual diff (Phase 1's Playwright script).

**Risk**: low. The same DOM ends up in the same wrapper, just with one
fewer class per element.

### Phase 3 — Section components (1 PR, low risk)

**Goal**: `about.astro` and `contact.astro` become thin compositions.
Section blocks live in `src/components/sections/`.

**New files**:

| File | Replaces |
|------|----------|
| `AboutHero.astro` | about.astro lines 18–59 (header + profile strip + photo gallery) |
| `Philosophy.astro` | about.astro lines 62–81 |
| `Experience.astro` | about.astro lines 84–117 (takes `items` prop) |
| `Education.astro` | about.astro lines 120–145 (takes `items` prop) |
| `Skills.astro` | about.astro lines 148–175 (takes `categories` prop) |
| `ContactStrip.astro` | about.astro lines 178–203 (also used at page bottom) |
| `ContactHero.astro` | contact.astro lines 11–23 |
| `ContactTopics.astro` | contact.astro lines 26–end |

**Also in this phase**:

- Re-home existing components per §4.6.
- Move `PhotoGallery.astro` lightbox script to `src/scripts/lightbox.ts`
  OR keep co-located with a comment justifying the exception (§4.5).
- Move `Layout.astro`'s diagram-zoom script to `src/scripts/diagrams.ts`.

**Procedure**:

1. Extract each section.
2. Rewrite `about.astro` and `contact.astro` as compositions.
3. `bun run build`; visual diff.

**After Phase 3**:

| File | Lines before | Lines after |
|------|-------------:|------------:|
| `about.astro` | 205 | ~30 |
| `contact.astro` | 156 | ~20 |
| `workbench/index.astro` | 105 | ~40 |
| `workbench/[slug].astro` | 124 | ~60 |
| New section components | 0 | +~400 |
| New primitive components (Phase 2) | 0 | +~200 |

**Net**: ~+200 lines total, but each line has one job, and no line
duplicates another.

### Phase 4 — Color collapse to 9-role spec (1 PR, **high risk**)

**Goal**: align `tokens.css` with the working draft at
`shedrackgodstime/`. From 13-light/16-dark → 9-light/9-dark.

**Token mapping** (per PART 2 of the working draft):

| Old | New |
|-----|-----|
| `--color-base` | `--color-surface` |
| `--color-base-soft`, `--color-card`, `--color-card-hover` | `--color-surface-raised` (+ `color-mix()` hovers) |
| `--color-primary`, `--color-heading`, `--color-body`, `--color-muted`, `--color-subtle`, `--color-faint`, `--color-soft`, `--color-soft-strong` | `--color-text` (3-tier) |
| `--color-line`, `--color-line-strong` | `--color-border` |
| `--color-accent` | `--color-accent` (value: `#0b6d50` light, `#7dd3b9` dark) |
| `--color-accent-solid` | `--color-accent-fill` |
| `--color-accent-bright` | (delete — derive as `color-mix(... transparent 80%)` at call site) |
| `--color-on-accent` | `--color-on-accent` |
| `--color-overlay`, `--color-wash`, `--color-wash-soft` | (delete — use `surface-raised` + `color-mix()`) |
| `--grid-line-a`, `--grid-line-b` | (delete — use `color-mix(var(--color-text), transparent 95%)` in `body` background) |

**Component-level references to rewrite** (after Phases 1–3, the
sweep is mechanical because all references go through `var(--color-*)`):

| Old utility | New utility |
|-------------|-------------|
| `bg-base`, `bg-base-soft`, `bg-card`, `bg-card-hover`, `bg-overlay`, `bg-wash`, `bg-wash-soft` | `bg-surface`, `bg-surface-raised` |
| `text-primary`, `text-heading`, `text-body`, `text-muted`, `text-subtle`, `text-faint`, `text-soft`, `text-soft-strong` | `text-text`, `text-text-muted`, `text-text-faint` (or rename aliases in `@theme` to drop the redundancy) |
| `border-line`, `border-line-strong` | `border-border` (or alias to `border-line` for muscle memory) |
| `bg-accent-solid` | `bg-accent-fill` |
| `hover:bg-accent-bright` | `hover:bg-accent-fill` (the hover state changes) |
| `border-accent-bright/20` | (now a `color-mix` of `accent` per §3.1.3) |

**Procedure**:

1. Create a feature branch.
2. Apply the token rename in `tokens.css`.
3. Add Tailwind `@theme` aliases so that `bg-base` → `bg-surface`
   for the duration of the migration (optional; speeds the sweep).
4. Sweep every reference.
5. `bun run build`; visual diff.
6. `bun run check:contrast` — must pass with new values
   (`#0b6d50` accent light, `#11171d` surface-raised dark).
7. Update §2.2, §2.3, §2.4 (old-token mapping) in this document.

**Risk**: the value changes (`#0e7a5a` → `#0b6d50` light; `#0b0f12` →
`#11171d` dark) are visible. Visual diff catches regressions; expect
minor contrast lifts.

### Phase 5 — CI enforcement (1 PR, low risk)

**Goal**: prevent the audit findings from regressing.

**Add `scripts/audit.mjs`** (run via `bun run audit`):

```js
// scripts/audit.mjs
import { globby } from 'globby'; // or hand-rolled readdir
import { readFile } from 'node:fs/promises';

const FORBIDDEN = [
  // §1.2.3 — color literals
  { re: /class="[^"]*\[#[0-9a-fA-F]{3,8}\]/g, name: 'arbitrary hex in class' },
  { re: /style="[^"]*#[0-9a-fA-F]{3,8}/g, name: 'hex in style attribute' },
  // §1.2.2 — arbitrary values
  { re: /class="[^"]*\[[0-9]+px\]/g, name: 'arbitrary pixel value' },
  { re: /class="[^"]*\[[0-9.]+rem\]/g, name: 'arbitrary rem value' },
  { re: /class="[^"]*clamp\(/g, name: 'inline clamp() in class' },
  { re: /class="[^"]*color-mix\(/g, name: 'inline color-mix() in class' },
  // §1.2.5 — magic alphas
  { re: /class="[^"]*\b(?:bg|text|border|ring|fill|stroke)-(?:[a-z]+-)?[a-z]+\/[0-9]+\b/g, name: 'magic alpha in class' },
];

const SCAN_DIRS = ['src/components', 'src/pages', 'src/layouts'];
const SCAN_EXT = /\.(astro|ts|tsx|js|jsx)$/;

let violations = 0;
for (const dir of SCAN_DIRS) {
  for await (const file of expand(dir)) {
    if (!SCAN_EXT.test(file)) continue;
    const src = await readFile(file, 'utf8');
    for (const { re, name } of FORBIDDEN) {
      const matches = src.match(re);
      if (matches) {
        for (const m of matches) {
          console.error(`${file}: ${name}: ${m.slice(0, 80)}`);
          violations++;
        }
      }
    }
  }
}

if (violations > 0) {
  console.error(`\n${violations} violations. See design-rules.md §3.7 / §3.8.`);
  process.exit(1);
}
console.log('Audit clean.');
```

**Add to `package.json`**:

```json
"scripts": {
  "audit": "node scripts/audit.mjs",
  "prebuild": "bun run audit"
}
```

**Update `design-rules.md`**:

- Mark phases complete in §3.9 as they land.
- Append a new row to §4.1 audit history for each future audit.

## 4.8 Estimated Effort

| Phase | Files touched | LOC delta | Risk | Estimate |
|------:|--------------:|----------:|------|---------:|
| 0 | 1 doc | +1 | None | 1 hr |
| 1 | 1 CSS + 12 components/pages | ±0 (sweep) | Low | 3–4 hrs |
| 2 | 8 new components, 4 pages rewritten | –500 | Low | 4–6 hrs |
| 3 | 7 new sections, 2 pages rewritten | –400 | Low | 3–4 hrs |
| 4 | 1 CSS rewrite + 12 components/pages swept | ±0 | **High** | 4–6 hrs |
| 5 | 1 script + 1 doc + `package.json` | +80 | None | 1–2 hrs |
| **Total** | — | **–820 net** | — | **~16–23 hrs** |

The investment buys a codebase where:

- Every visual decision traces to one token
- Pages are 20-line compositions
- Components are 30–60 lines, single-responsibility
- A change to `--color-accent` ripples through the site in one place
- A new contributor can read `design-rules.md` and `components/ui/`
  and produce a PR that passes review on the first try

---

## 5. One-Sentence Summary

**The Governing Law in §0 is the only discipline mechanism in this
document — architecture, color, and the 5-phase remediation plan are
all applications of the same law: tokens and layers are the vocabulary,
pages and components only ever speak in it, and nothing new enters
that vocabulary without clearing its section's Addition Gate.**

The site today is a one-person portfolio and the bar is "shipped,
accessible, on-brand." It clears that bar. The bar in this document
is "the next contributor can read PART 1 and produce a §3.7/§3.8
clean PR on the first try." The audit in PART 4 is the roadmap from
one to the other.