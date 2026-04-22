# Phase 2: GitHub Headless CMS Architecture

This document defines exactly how the portfolio transitions from hardcoded data in `src/lib/data.ts` to a fully automated, GitHub-backed Headless CMS architecture.

## 1. The Core Objective
The portfolio must require **zero code changes** to publish new projects or writeups. Content management must happen entirely through GitHub repository architecture and Markdown files.

## 2. Content Repositories
The system fetches from two distinct GitHub sources:

**A. Central Content Repo (`portfolio-content`)**
- Contains static pages (`home.md`, `about.md`)
- Contains the `writeups/` directory for all incident analyses and research articles.

**B. Tagged Project Repositories**
- The fetcher searches the GitHub API for any repository owned by `shedrackgodstime` tagged with the `portfolio` topic.
- Inside these repos, it looks for a `portfolio.md` file in the root.

## 3. Markdown Schema & Parsing Strategy

### Frontmatter (Zod Validated)
Every fetched Markdown file must begin with YAML frontmatter. This frontmatter will be parsed using `gray-matter` and strictly validated at build time using `Zod`. If a `portfolio.md` file is missing required fields (like `description` or `tags`), the build step logs a warning and skips it rather than breaking the UI.

### The "AST" Parsing Strategy (Crucial for Layouts)
The portfolio's UI is highly custom. For example, the Projects detail page uses a sticky left sidebar for section titles, while the right side scrolls through the content.

Flat Markdown (standard HTML conversion) breaks this layout because it creates a single continuous column. To fix this without forcing the author to write HTML inside the Markdown, we use an **Abstract Syntax Tree (AST)** parser (e.g., using `marked.lexer`):

1. **Fetch:** The raw `portfolio.md` string is pulled from GitHub.
2. **Lexing:** The parser reads the string into an array of tokens.
3. **Chunking:** The script iterates over the tokens. Whenever it encounters an `<h2>` token (e.g., `## The Problem`), it creates a new "Section" object. All subsequent paragraph, list, and code block tokens are collected into that Section's content array.
4. **Injection:** The Qwik app receives a structured Javascript array (e.g., `[{ label: 'The Problem', content: '...' }]`) and maps it directly into the sticky two-column layout.

### Custom Markdown Rendering (Tailwind Injection)
For Writeups, the content is rendered top-to-bottom. However, standard HTML tags must match the site's "Technical Precision" aesthetic. 

A custom renderer overrides standard elements:
- `<h2>` becomes `<h2 class="mt-10 mb-4 font-mono text-sm tracking-widest text-precision uppercase">`
- `<p>` becomes `<p class="mb-5 leading-relaxed text-ink-subtle">`
- `<img>` intercepts the `src` attribute. If it references `portfolio-assets/diagram.png`, the renderer rewrites the URL to the raw GitHub URL for that specific repository branch.

## 4. Performance & Caching
Because fetching the GitHub API on every page load would cause severe rate limiting and latency:
- **SSG (Static Site Generation):** The `routeLoader$` functions will execute during the `bun run build` process for Cloudflare Pages.
- **Result:** The site compiles to 100% static HTML. 
- **Publishing:** Adding a new project or writeup requires pushing to GitHub, which triggers a webhook to rebuild the Cloudflare Page. No runtime API calls happen for the end-user.
