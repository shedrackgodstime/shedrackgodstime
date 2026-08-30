/**
 * Zod contract for workbench README.md frontmatter.
 * Matches the schema in src/content.config.ts exactly.
 */
import { z } from "astro/zod";

export const WorkbenchSchema = z.object({
  title: z.string().min(1),
  summary: z.string().default(""),
  type: z.enum(["project", "exploration"]),
  status: z.enum(["draft", "active", "completed", "archived"]),
  tags: z.array(z.string()).default([]),
  started: z.string().optional(),
  updated: z.string().optional(),
  context: z.string().optional(),
  source: z.string().url().optional(),
});

export type WorkbenchFrontmatter = z.infer<typeof WorkbenchSchema>;
