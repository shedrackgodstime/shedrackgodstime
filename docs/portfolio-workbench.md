# Portfolio And Workbench — Content Contract

The portfolio is the public presentation layer. The workbench is the source
repository for the technical record. The portfolio presents selected work
clearly; the workbench preserves the context, decisions, investigations,
and narratives behind that work.

This document is the **implemented** contract: the schema lives in
`src/content.config.ts` and the fetch pipeline in `src/utils/github.ts`.

## Context

The previous portfolio model discovered project repositories through the
`portfolio` GitHub topic and expected each selected repository to contain a
root-level `portfolio.md`. Research entries lived separately in a dedicated
`research` repository. That approach reduced manual updates but scattered
public narrative across repositories and split project content from research
content. The current model keeps project repositories focused on
implementation and moves portfolio-facing technical records into the
workbench.

## Source Boundary

Project repositories remain the source of truth for code, releases, issues,
crates, packages, and implementation history.

The workbench is the source of truth for:

- project explanations
- technical context
- research and exploration notes
- case-study material
- portfolio-ready narratives

The portfolio reads selected material from the workbench and turns it into
the public website.

```txt
project repo -> implementation
workbench    -> technical record
portfolio    -> public presentation
```

## Workbench Contract

The portfolio expects workbench content to follow this primary structure:

```txt
workbench/
  projects/
  explorations/
```

`projects/` records the context around things that are built.
`explorations/` records investigations, research, technical learning, and
structured inquiry.

Each portfolio-visible item exposes one canonical Markdown entry point:

```txt
projects/<name>/README.md
explorations/<topic>/README.md
```

That `README.md` carries the complete public narrative: title, summary,
context, technical explanation, status, links, lessons — enough detail for
the page to stand on its own.

Frontmatter fields the portfolio reads:

| Field      | Required | Notes                                                          |
| ---------- | -------- | -------------------------------------------------------------- |
| `title`    | yes      | Used to generate the URL slug and page title                   |
| `summary`  | yes      | One line; shown on cards and the page header                   |
| `type`     | yes      | `project` = built thing, `exploration` = investigated work     |
| `status`   | yes      | `draft`, `active`, `completed`, `archived`                     |
| `tags`     | yes      | Array of strings; shown as chips                               |
| `started`  | no       | `YYYY-MM`. Sorting, sitemap `lastmod`, and RSS dates           |
| `updated`  | no       | `YYYY-MM`. Last content update; overrides `started` for sitemap `lastmod` and RSS dates |
| `context`  | no       | Longer context shown as a callout box                          |
| `source`   | no       | URL to project repo; shown as "Source ↗" chip                  |

Supporting files may exist beside it for deeper notes, references,
diagrams, logs, or design decisions. The portfolio does not read those files
by default.

## Engine Rules

Enforced by `src/utils/github.ts`:

- **Loud failure.** Contract violations are reported by kind/reason; silent
  skipping is forbidden.
- **Reproducibility.** Fetches are pinned to a resolved commit SHA, recorded
  in build output.
- **Opt-in at source.** Nothing becomes public without an explicit signal in
  the workbench.
- **Slug uniqueness** is global across all entries.

## Direction

Portfolio content stays at `README.md` files under `projects/` /
`explorations/`. Presentation labels (project, case study, note, article,
lab entry) belong to the website; source organization stays simple: built
work and investigated work.