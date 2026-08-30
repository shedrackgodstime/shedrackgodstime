# Vision & Principles — Where This Site Came From

Captured from the original design conversation that started this project
(Aug 2026), before the reference materials were removed. Everything in this
document is the **durable reasoning** behind decisions already implemented in
`docs/portfolio-identity.md`, `docs/portfolio-workbench.md`, and
`docs/design-rules.md`.

## The Core Insight

The portfolio was never just "a portfolio". The real project is:

> A content architecture where the portfolio is merely one consumer of
> independently versioned technical documents.

The portfolio is the first serious test case of that system. It is a mini
publishing system: source repositories hold Markdown; a content layer
validates and versions it; a document pipeline renders it; the website
presents it.

## Three Principles

These governed every later decision (framework choice, static-first build,
token discipline):

1. **Lightweight** — the browser gets mostly HTML/CSS; JavaScript only where
   it adds genuine value.
2. **Platform-conscious** — don't hide everything behind abstractions; know
   what the framework is actually doing. (The site itself is meant to be an
   example of the owner's engineering philosophy.)
3. **Curiosity-driven** — the site is not "look at everything I'm qualified
   to do", but "here's what I'm building and trying to understand".

## Why The Identity Is Broader Than Cybersecurity

The interests are intentionally wild: security, Rust, networking, Linux,
CAD/FreeCAD, electronics, drones, embedded. A

cybersecurity-only identity would eventually break. So the identity is
defined by **how technology is approached**, not by the current subject:

> I build things, investigate how they work, and document what I learn.

This is the root of the workbench's two kinds: `projects/` (built things)
and `explorations/` (investigated things) — and one day a writing surface.
The same rule that made projects/explorations broad enough:

> The website is a public technical notebook that happens to be a portfolio.
> It shows a trajectory, not a final version.

## The Rendering Pipeline Vision (For Later)

The long-term technical north star, from the same conversation:

- Markdown → AST → **document IR** → renderers → HTML.
- Markdown stays the source; "what a document is" is decided by the AST, not
  by the page.
- Diagrams (Mermaid) are **first-class document nodes** with source +
  metadata + presentation, not just fenced code blocks.
- Diagrams render at **build time** (SVG + accessible fallback + source),
  with only a tiny interaction layer in the browser. Never ship the whole
  Mermaid runtime to visitors.
- Theme dark/light is handled by the diagram renderer and site tokens, not
  by rendering two SVGs or re-rendering in the browser.
- The renderer should be framework-independent so Fresh, Astro, a CLI, RSS,
  or PDF could all consume the same engine.

Implementing note: a working prototype of this display layer (code block
chrome, diagram expand/zoom overlay, Shiki dual-theme) existed in the
abandoned `portfolio` PoC and was specified in its
`docs/markdown-display.md` and `docs/aggregation-pipeline.md`. If those
reference files are removed without porting, recreate the display contract
from this document when the rendering phase begins.

## One Rule That Eventually Shaped The Tools

The habit the project leader wants to keep in check, stated honestly in the
original conversation:

> Don't let the excitement about implementation run ahead of a settled
> underlying idea.

For this site that played out as: settle identity and content architecture
first (this project), then the visual system, then the framework (Astro),
then the pipeline — each phase built on a settled previous one.