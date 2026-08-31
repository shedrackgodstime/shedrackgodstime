import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../../data/config";

export const GET: APIRoute = async () => {
  const entries = await getCollection("workbench");
  const visible = entries.filter((e) => e.id !== "test");

  const catalogList =
    visible.length > 0
      ? visible
          .map(
            (e) =>
              `- **${e.data.title}** (\`${e.data.type}\` · ${e.data.status}): ${e.data.summary}\n  * Path: \`${e.data.type}s/${e.id}/README.md\`\n  * Tags: ${e.data.tags.join(", ") || "none"}`,
          )
          .join("\n\n")
      : "_No public entries loaded yet._";

  const content = `# Workbench → Portfolio Contract & AI Agent Guide

You are an expert technical documentation agent. Your task is to generate or update a compliant Workbench record for ${SITE.name}'s technical portfolio.

---

## Instructions for AI Agents

When given this contract inside any project or research codebase:

1. **Check the Current Workbench Catalog:**
   Review the "Current Published Workbench Entries" section below.
   - **If the project/topic is already listed:** Ask the user:  
     _"I see [Title] is already in your Workbench. What is the objective for this update (e.g., new release features, architecture decisions, updated benchmarks, lessons learned)?"_  
     Wait for their direction before generating the updated entry.
   - **If the project/topic is not listed:** Analyze the current repository structure, code, configuration files, and protocols to draft a comprehensive new record.

2. **Inspect Existing Records & Syntax Reference:**
   - **Local Records:** If \`~/Projects/workbench/\` is accessible on the local filesystem, inspect existing \`projects/*/README.md\` or \`explorations/*/README.md\` entries as reference for tone, technical depth, and structure.
   - **Live Syntax & Diagram Reference:** Refer to \`${SITE.url}/workbench/test\` for comprehensive live examples of every supported Mermaid diagram type (sequence, flowcharts, C4, architecture, git graphs, timelines), dual-theme code blocks, and formatting rules.

3. **Determine the Entry Type:**
   - \`project\`: If the primary outcome is a built software artifact, tool, library, or prototype.
   - \`exploration\`: If the primary outcome is research, protocol study, technical experiment, or systems inquiry.

4. **Frontmatter & Title Conventions:**
   - Always include the full YAML frontmatter block at the very top of \`README.md\`.
   - **Project Title Format:** For projects/tools, use the format \`<ToolName> - <Core Capability>\` (e.g., \`irosh - Secure P2P SSH\` or \`nettrace - Low-Latency Packet Filter\`).
   - **Exploration Title Format:** For research topics, use a clear descriptive subject (e.g., \`NAT Traversal & Hole Punching\`).
   - \`summary\`: One concise sentence explaining what it is and what it does.
   - \`tags\`: Array of relevant technical keywords (languages, protocols, domains).
   - \`started\` / \`updated\`: \`YYYY-MM\` format (e.g., "2025-08").
   - \`source\`: Full GitHub repository URL if applicable.

5. **Output Destination:**
   Target file path is:
   - \`~/Projects/workbench/projects/<slug>/README.md\` (for projects)
   - \`~/Projects/workbench/explorations/<slug>/README.md\` (for explorations)

6. **Clean Up Project Workspace:**
   If you created any temporary draft markdown files in the project repository root during generation, remove them immediately after writing the record to \`~/Projects/workbench/\` so the project repository stays clean.

---

## Current Published Workbench Entries
(Automatically synced at build time)

${catalogList}

---

## The Two-Sided Publishing Contract

The architecture separates the content source from the presentation engine:

1. **Source Repository (\`shedrackgodstime/workbench\`):**
   - Holds the technical records, architectural decisions, and lab logs.
   - Pushes to \`projects/**/README.md\` or \`explorations/**/README.md\` automatically inspect the file status and notify the portfolio.
2. **Presentation Engine (\`shedrackgodstime/shedrackgodstime\`):**
   - At build time, fetches entries from the Workbench repository.
   - Filters out all entries with \`status: draft\` so private work is never published.
   - Automatically rewrites relative image paths (e.g. \`./arch.png\`) to raw GitHub CDN URLs.
   - Compiles Mermaid diagrams to zero-runtime static SVGs.

---

## File Hierarchy

\`\`\`txt
~/Projects/workbench/
  projects/<slug>/README.md
  explorations/<slug>/README.md
\`\`\`

One \`README.md\` per entry. The filename \`README.md\` is required — it is the only file the portfolio engine reads.

---

## Frontmatter Schema

\`\`\`yaml
---
title: "ToolName - Core Capability"
summary: "One-line description shown on cards and page header."
type: project | exploration
status: draft | active | completed | archived
tags:
  - Rust
  - Networking
  - Security
started: "YYYY-MM"
updated: "YYYY-MM"
context: "Optional longer context shown as a callout box."
source: "https://github.com/user/repo"
---
\`\`\`

### Field Specifications

| Field      | Required | Type     | Notes                                                                                         |
| ---------- | -------- | -------- | --------------------------------------------------------------------------------------------- |
| \`title\`    | yes      | string   | For tools: \`<Name> - <Capability>\` (e.g. \`irosh - Secure P2P SSH\`). Generates URL slug     |
| \`summary\`  | yes      | string   | One line. Shown on cards and page header                                                      |
| \`type\`     | yes      | enum     | \`project\` (built artifact) or \`exploration\` (research/inquiry)                             |
| \`status\`   | yes      | enum     | \`draft\`, \`active\`, \`completed\`, \`archived\`                                              |
| \`tags\`     | yes      | string[] | Array of strings. Shown as filter chips on cards and header                                   |
| \`started\`  | no       | string   | \`YYYY-MM\` format. Used for sorting (newest first)                                            |
| \`updated\`  | no       | string   | \`YYYY-MM\` format. Last update. Overrides \`started\` for sitemap \`lastmod\` and RSS dates  |
| \`context\`  | no       | string   | Longer description. Shown as "Record Context" callout box                                     |
| \`source\`   | no       | string   | Full repository URL. Shown as "Source ↗" link chip                                            |

---

### Status Lifecycle & Behavior

| Status | Meaning | Live Portfolio Behavior | Auto-Trigger on Push? |
| :--- | :--- | :--- | :--- |
| \`draft\` | Work-in-progress, raw notes, or private draft | **Hidden.** Never built or shown on the live site. | **No.** Ignored by GitHub Actions. |
| \`active\` | Ongoing project, lab, or active investigation | **Published.** Visible in catalog, RSS, and sitemap. | **Yes.** Automatically triggers build. |
| \`completed\` | Stable release, finished crate, or completed paper | **Published.** Visible in catalog, RSS, and sitemap. | **Yes.** Automatically triggers build. |
| \`archived\` | Historical reference or past experiment | **Published.** Visible with an archived status badge. | **Yes.** Automatically triggers build. |

---

## Markdown Formatting Guidelines

- **Headings:** Use structured sections (\`## Technical Overview\`, \`## Architecture\`, \`## Key Findings\`, \`## Trade-offs\`).
- **Code Blocks:** Always include language specifiers (\`\`\`rust, \`\`\`bash, \`\`\`toml).
- **Mermaid Diagrams:** Fully supported at build time with theme support and fullscreen expansion. See \`${SITE.url}/workbench/test\` for comprehensive examples across all supported diagram types.
- **Images:** Relative paths (e.g., \`![Architecture Diagram](./architecture.png)\`) are automatically resolved to raw GitHub CDN URLs at build time.
- **Tone:** Grounded, practical engineering narrative. Explain design decisions, protocols, failure points, and lessons learned.

---

## Example Entry

\`\`\`markdown
---
title: Packet Trace - Low-Latency Telemetry Capture
summary: A lightweight packet inspection tool written in Rust for analyzing local network telemetry.
type: project
status: active
tags:
  - Rust
  - Networking
  - Packet Analysis
started: "2025-04"
updated: "2025-08"
context: Built to explore raw socket interfaces and zero-copy packet parsing under high network throughput.
source: https://github.com/shedrackgodstime/packet-trace
---

## Technical Overview

Packet Trace is a command-line tool designed for low-overhead network diagnostics...

## Architecture & Data Flow

\`\`\`mermaid
graph TD
    NIC[Network Interface] -->|Raw Frames| Capture[Capture Engine]
    Capture -->|Zero-Copy Ring Buffer| Parser[Protocol Parser]
    Parser -->|Decoded Events| Filter[Filter Pipeline]
    Filter -->|Metrics| CLI[Terminal UI]
\`\`\`

## Key Design Decisions

- **Zero-Copy Parsing:** Utilized byte slices to minimize memory allocations.
- **Ring Buffer:** Decoupled frame capture from analysis to prevent dropped packets during bursts.

## Lessons Learned

- Kernel socket buffer tuning is essential under sustained Gigabit traffic.
- Handling out-of-order TCP segments requires explicit state tracking.
\`\`\`

---

## Pre-Submission Checklist

- [ ] File is \`README.md\` located in \`~/Projects/workbench/projects/<name>/\` or \`~/Projects/workbench/explorations/<name>/\`
- [ ] Title follows \`<ToolName> - <Core Capability>\` for projects
- [ ] Frontmatter contains all required fields: \`title\`, \`summary\`, \`type\`, \`status\`, \`tags\`
- [ ] \`type\` is either \`project\` or \`exploration\`
- [ ] \`status\` is one of: \`draft\`, \`active\`, \`completed\`, \`archived\`
- [ ] Dates follow strict \`YYYY-MM\` format
- [ ] Entry is self-contained and informative
- [ ] Any temporary draft files in the project workspace are cleaned up
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
