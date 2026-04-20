# Cybersecurity Portfolio — Objective & Structure

## Overview

A personal cybersecurity portfolio site for Shedrack Godstime (Kristency), a cybersecurity person and systems programmer. The site exists primarily to establish an online technical presence. It is not a job-hunting page or a marketing site.

The site has five pages: Home, About, Projects, Writeups, and Contact. Every page except the header and footer is driven by Markdown files. The site should never require a code change to update content — everything content-related is controlled via Markdown files hosted on GitHub.

---

## Content Architecture

### GitHub Repository Layout

There are two kinds of content repositories:

**1. Central content repo** (`portfolio-content`)

```
portfolio-content/
├── home.md
├── about.md
└── writeups/
    ├── payment-redirect-incident.md
    ├── artmis-architecture.md
    └── post-quantum-primer.md
```

**2. Individual project repos** (any repo tagged with the GitHub topic `portfolio`)

```
<project-repo>/
├── portfolio.md
└── portfolio-assets/
    ├── image-1.png
    └── diagram.gif
```

The site fetches all repos tagged `portfolio` via the GitHub API, then reads `portfolio.md` and `portfolio-assets/` from each.

---

## Pages

### Home (`/`)

Rendered from `home.md` in the central content repo.

The file contains:
- Full name
- A one or two line statement of who he is technically — straightforward, no hype
- Navigation links to the other pages

No extra sections. No introduction beyond what is in the MD file.

---

### About (`/about`)

Rendered from `about.md` in the central content repo.

The file contains:
- A short paragraph (150–200 words) written as a technical snapshot — not a biography
- What he actually works with: Rust, Python, networking, distributed systems, cybersecurity
- What he is currently building
- His background: Cybersecurity Technology, Auchi Polytechnic
- A brief statement of long-term interest

Nothing else. No lists of skills. No percentages. No soft-skill claims.

---

### Projects (`/projects`)

Project list is auto-fetched via the GitHub API — all repos belonging to the owner that carry the topic tag `portfolio`.

Each project card on the list page shows:
- Project title
- One-line description
- Tech tags
- Year

Both the description and tags come from the frontmatter of that repo's `portfolio.md`.

Clicking a project opens a full project page rendered from that repo's `portfolio.md`.

#### `portfolio.md` Frontmatter Schema

```yaml
---
title: Project Name
description: One sentence. What it is.
tags: [Rust, iroh, DHT, QUIC]
year: 2024
---
```

#### `portfolio.md` Body Structure

```md
## The Problem
What existed, what was missing, why this was built.

## Architecture
How it is structured. Can include images from portfolio-assets/.

## Key Decisions
The non-obvious technical choices made and why.

## Security Model
How the system handles trust, encryption, authentication, or threat surface.
(Omit this section only if the project has zero security relevance.)

## What I Would Do Differently
Honest reflection on tradeoffs and mistakes.
```

The "What I Would Do Differently" section is required in every project writeup.

#### Projects to Feature (in order of prominence)

1. **Capstone P2P Secure Messaging App**
   - End-to-end encrypted, decentralized, peer-to-peer messaging
   - Key areas: NAT traversal, DHT-based offline delivery, relay fallback, gossip protocol
   - Built in Rust using iroh transport

2. **ARTMIS**
   - Hybrid P2P mesh network
   - Key areas: iroh/QUIC transport, DHT discovery via mainline BitTorrent network, NodeID handshake bridge, rendezvous/relay server, gossip protocol
   - Solved a server flooding problem by replacing HTTP polling with DHT-first discovery

3. **ỌGBỌN**
   - Forex trading intelligence system
   - Key areas: local LLM inference via Ollama on headless Debian, phi4-mini as structured reasoning layer, SHAP values as JSON input to the model, frozen ML model revision

4. **Rexolution Vogue**
   - Luxury streetwear e-commerce site
   - Built with QwikCity and Tailwind v4

5. **Syvex**
   - Fintech demo app
   - Built with QwikCity, deployed on Vercel

---

### Writeups (`/writeups`)

Fetched from the `writeups/` directory inside the central content repo via GitHub API directory listing.

List page shows:
- Writeup title
- Date
- Category label

Category options: `Incident Analysis`, `Research`, `Architecture`

Clicking a writeup renders the full MD file.

#### Writeup MD File Structure

```md
---
title: Writeup Title
date: YYYY-MM-DD
category: Incident Analysis | Research | Architecture
---

Body content...
```

#### Writeups to Publish First

1. **Payment Redirect Incident** (`payment-redirect-incident.md`)
   - Category: Incident Analysis
   - A breakdown of a compromised payment page that redirected to a fraudulent endpoint
   - Cover: how it was discovered, what the attack looked like, what the indicators were, what server hardening applies

2. **ARTMIS Architecture** (`artmis-architecture.md`)
   - Category: Architecture
   - The full story of how ARTMIS moved from HTTP-based discovery (which flooded the server) to DHT-first discovery on the mainline BitTorrent network
   - Cover: the original problem, why DHT was chosen, how the NodeID handshake bridge works, what the gossip layer does

3. **Post-Quantum Cryptography Primer** (`post-quantum-primer.md`)
   - Category: Research
   - A plain technical overview of CRYSTALS-Kyber and CRYSTALS-Dilithium as near-term post-quantum baselines
   - Why they matter from a cybersecurity career standpoint

---

### Contact (`/contact`)

Static page, no MD file needed.

Contains only:
- Email address
- GitHub profile link

Nothing else.

---

## Data Fetching Rules

- All project repos must be tagged with the GitHub topic `portfolio` to appear on the site
- The site reads `portfolio.md` from the root of each tagged repo
- Images referenced inside `portfolio.md` are served from `portfolio-assets/` inside the same repo
- Writeups are discovered by reading the `writeups/` directory listing from the central content repo — no manual registration required
- Adding a new writeup = adding a new `.md` file to `writeups/`. The site picks it up automatically
- Adding a new project = tagging the repo with `portfolio` and dropping in `portfolio.md`. The site picks it up automatically

---

## What the Site Does Not Include

- Skill bars or percentage indicators
- A "hire me" or "available for work" section
- Testimonials
- Animated text effects
- A certifications section
- Any section that would look visually empty given the current stage of his career
