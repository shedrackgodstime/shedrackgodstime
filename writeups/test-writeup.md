---
title: "Testing the Markdown Pipeline"
date: "2026-04"
category: "Architecture"
readTime: "3 min read"
excerpt: "This is a local writeup created to test the Qwik City MD AST parser and custom Tailwind renderer."
---

This is a test paragraph to verify that local markdown files are successfully parsed by the `fs` module and injected into the UI during the Qwik SSG build.

## Rendering Code Blocks

We also need to make sure that inline code blocks like `const test = true;` are wrapped in the custom Tailwind span defined in the `renderBody()` function inside the writeup route.

If you can read this, the local `src/content/writeups/` fetching logic is working perfectly.

## Checking Custom Classes

Notice how the `##` headings should not just render as generic `<h2>` tags. They should be intercepted by our custom renderer and styled with:

`class="mt-10 mb-4 font-mono text-xs tracking-widest text-precision uppercase"`

If everything is blue and sharp, we have succeeded.
