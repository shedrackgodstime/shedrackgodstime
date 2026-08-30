# Portfolio Identity — Governing Direction

This site is **based on** the identity plan in this document. It is the
single public portrait of Shedrack Godstime, replacing two older portfolio
directions:

- the first portfolio (broader personal/professional info: education,
  experience, skills, credentials, contact)
- the second portfolio (sharper technical identity, GitHub-driven content)

This site consolidates both: professional credibility **and** technical
depth, as one coherent presence.

## What It Should Be

A professional cybersecurity portfolio with a technical workbench at its
center — a cybersecurity-focused technical builder whose work extends into
systems programming, networking, Linux, protocols, infrastructure, open
source, and hardware-adjacent research.

One coherent direction:

> Understanding how systems work, how they fail, and how to build or secure
> them.

## Positioning

```txt
Shedrack Godstime
Cybersecurity, systems, and networked software.
```

Supporting idea:

```txt
I build tools, investigate how systems behave, and document the technical
work behind them.
```

## What It Must Not Feel Like

- a student resume
- a generic developer portfolio
- a blog-first website
- a product landing page
- a theatrical cyberpunk page

## Core Shape

```txt
/                  identity, current focus, featured work, compact credibility
/workbench         selected projects and explorations from the workbench
/workbench/[slug]  rendered README entries from the workbench
/about             background, experience, education, credentials, contact
```

Hierarchy: identity first, work as proof, background as support.

## Workbench Role

The workbench is the main evidence layer. The portfolio renders selected
workbench material instead of duplicating project descriptions inside the
site codebase. Project repositories stay the source of truth for code;
the workbench holds the public technical record; the portfolio is the
presentation. See `docs/portfolio-workbench.md` for the contract.

## Professional Context

Education, experience, credentials, contact, tools, and skills are present
as credibility signals that support the technical identity — they do not
dominate it. The site no longer feels organized around being a student.

## Visual Direction

The site should feel organized, precise, technical, and calm — closer to a
professional command center, a technical index, a public front for the
workbench — and never a colorful generic portfolio or startup landing page.
The design system that renders this direction lives in
`docs/design-rules.md` and `src/styles/tokens.css`.

## Consolidation

This site is the single public home for professional identity, technical
work, workbench-selected projects and explorations, background and
credibility, and contact and external links. It is the designated successor
for the older public portfolio URLs.