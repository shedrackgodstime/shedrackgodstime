import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import type { Loader, LoaderContext } from "astro/loaders";
import { loadWorkbench } from "./utils/github";

const workbenchSchema = z.object({
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

function createGitHubLoader(): Loader {
  return {
    name: "workbench-github",
    schema: workbenchSchema,
    load: async (context: LoaderContext) => {
      const offline = process.env.OFFLINE === "1";
      const isDev = import.meta.env.DEV;

      // Local fixtures are dev/offline-only and must never reach a production
      // build (CI runs a plain online build). In dev we load BOTH fixtures and
      // the GitHub feed so e.g. test + remote entries coexist locally; offline builds
      // stay fixture-only and online builds stay GitHub-only.
      if (offline) {
        context.logger.info("OFFLINE mode — using local fixtures");
        const localLoader = glob({
          pattern: "**/*.md",
          base: "./contents",
        });
        await localLoader.load(context);
        if (!isDev) return;
        context.logger.info("DEV — loading GitHub feed alongside local fixtures");
      }

      context.logger.info("Loading from GitHub (workbench repo)");
      const token = process.env.GITHUB_TOKEN;
      const { entries, violations } = await loadWorkbench(token);

      if (violations.length) {
        context.logger.warn(`${violations.length} violation(s):`);
        for (const v of violations) {
          context.logger.warn(`  - [${v.kind}] ${v.reason}`);
        }
      }

      for (const entry of entries) {
        const data = await context.parseData({
          id: entry.id,
          data: entry.data,
        });
        const digest = context.generateDigest(data);
        const rendered = await context.renderMarkdown(entry.body);
        context.store.set({
          id: entry.id,
          data,
          body: entry.body,
          rendered,
          digest,
        });
      }

      context.logger.info(`Loaded ${entries.length} entries`);
    },
  };
}

const workbench = defineCollection({
  loader: createGitHubLoader(),
});

export const collections = { workbench };
