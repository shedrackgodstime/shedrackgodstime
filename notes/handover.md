# Project Handover & Context
**Project:** Shedrack Godstime Cybersecurity Portfolio
**Last Updated:** 2026-04-21

---

## Current Status: Phase 1 COMPLETE ✅

All pages fully implemented in Qwik with real content + individual detail pages.

## Tech Stack
| Item | Detail |
| :--- | :--- |
| Framework | Qwik + Qwik City |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Fonts | Inter (UI) + JetBrains Mono (technical labels) — loaded via Google Fonts |
| Package Manager | Bun |
| Hosting Target | Cloudflare Pages |

## Route Map
| Route | File | Purpose |
| :--- | :--- | :--- |
| `/` | `src/routes/index.tsx` | Home — Hero + Featured Projects |
| `/about` | `src/routes/about/index.tsx` | Two-column bio + expertise grid |
| `/projects` | `src/routes/projects/index.tsx` | Filtered project card grid |
| `/projects/[slug]` | `src/routes/projects/[slug]/index.tsx` | Individual project detail |
| `/writeups` | `src/routes/writeups/index.tsx` | Searchable writeup list |
| `/writeups/[slug]` | `src/routes/writeups/[slug]/index.tsx` | Individual writeup reading page |
| `/contact` | `src/routes/contact/index.tsx` | Email + GitHub only |
| `404` | `src/routes/404.tsx` | 404 page |

## Key Files
| File | Purpose |
| :--- | :--- |
| `src/global.css` | Design tokens (colors, fonts, animations) — single source of truth |
| `src/routes/layout.tsx` | Global nav + footer wrapper |
| `src/lib/data.ts` | **ALL content lives here** — projects + writeups with full sections |
| `src/components/page-header.tsx` | Shared page header (tag + title + blue accent bar) |
| `src/components/footer.tsx` | Shared footer |
| `src/components/router-head/router-head.tsx` | Head tags — OG, Twitter Card, canonical, theme-color |

## Design System Tokens (`src/global.css`)
| Token | Value | Tailwind class |
| :--- | :--- | :--- |
| `--color-precision` | `#2563eb` | `text-precision`, `bg-precision`, `border-precision` |
| `--color-ink` | `#111827` | `text-ink`, `border-ink` |
| `--color-ink-subtle` | `#4b5563` | `text-ink-subtle` |
| `--color-canvas` | `#ffffff` | `bg-canvas` |
| `--color-canvas-subtle` | `#f9fafb` | `bg-canvas-subtle` |
| `--font-sans` | Inter | `font-sans` |
| `--font-mono` | JetBrains Mono | `font-mono` |

## Animation Utilities (in `global.css`)
- `.animate-fade-in-up` — entrance animation (opacity 0→1, translateY 20px→0)
- `.delay-100` through `.delay-800` — animation delay utilities

## Visual Aesthetic: "Digital Blueprint"
- Sharp corners, 1px borders, **zero** border-radius
- Precision blue (`#2563eb`) used sparingly — active states, labels, accents only
- SVG animated network grid background on Home only
- Typography-led: large `clamp()` font sizes for hierarchy

## Phase 2 Roadmap
- [ ] GitHub API integration: fetch projects by `portfolio` topic tag
- [ ] Markdown content: replace `src/lib/data.ts` body strings with `.md` files
- [ ] Add `[slug]` dynamic OG image generation via Cloudflare Workers
- [ ] Sitemap + robots.txt for full SEO

## Rules the Next Developer Must Follow
1. **No percentage skill bars** — see `notes/conclusion.md`
2. **All content goes through `src/lib/data.ts`** — never inline arrays in pages again
3. **No rounded corners** — design is `border-radius: 0` everywhere
4. **Contact = email + GitHub only** — no forms, no LinkedIn
5. **Animations** always use `.animate-fade-in-up` + `.delay-*` from `global.css`
