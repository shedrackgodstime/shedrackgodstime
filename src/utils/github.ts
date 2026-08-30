/**
 * Content loader — fetches workbench entries from GitHub at build time.
 *
 * Pipeline:
 *   1. DISCOVER   List projects/ and explorations/ dirs in workbench repo
 *   2. FETCH      Get README.md from each dir (SHA-pinned)
 *   3. VALIDATE   Check frontmatter against WorkbenchSchema
 *   4. TRANSFORM  Resolve relative images → raw.githubusercontent.com URLs
 *   5. EMIT       Return entries for Astro content collection
 */
import matter from "gray-matter";
import { WorkbenchSchema } from "./schemas";
import type { ResolvedSource, Violation, WorkbenchEntry, WorkKind } from "./types";
import { REPO, DEFAULT_BRANCH } from "../data/config";

const RAW = "https://raw.githubusercontent.com";

interface LoadResult {
  entries: WorkbenchEntry[];
  violations: Violation[];
  sources: ResolvedSource[];
}

async function githubJson<T>(path: string, token?: string, silent404 = false): Promise<T | null> {
  const headers: Record<string, string> = {
    "User-Agent": "portfolio-engine",
    Accept: "application/vnd.github.v3+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    if (res.status !== 404 || !silent404) {
      console.error(`[github] ${res.status} ${res.statusText}: ${path}`);
    }
    return null;
  }
  return (await res.json()) as T;
}

async function fetchText(url: string): Promise<string | null> {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[github raw] ${res.status} ${res.statusText}: ${url}`);
    return null;
  }
  return res.text();
}

/** Resolve a branch/ref to its current commit SHA. */
async function resolveSha(
  ref: string,
  token?: string,
): Promise<string | null> {
  const data = await githubJson<{ sha: string }>(
    `/repos/${REPO}/commits/${ref}`,
    token,
  );
  return data?.sha ?? null;
}

/** List subdirectories under a path in the workbench repo. */
async function listDirs(
  path: string,
  token?: string,
): Promise<string[]> {
  const data = await githubJson<
    { name: string; type: string }[]
  >(`/repos/${REPO}/contents/${path}`, token, true);

  if (!data) return [];
  return data
    .filter((item) => item.type === "dir" && !item.name.startsWith("_") && !item.name.startsWith("."))
    .map((item) => item.name);
}

/** Resolve relative image URLs to absolute raw.githubusercontent.com URLs. */
function resolveRelativeImages(markdown: string, baseUrl: string): string {
  return markdown.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
    (_match, alt, path) => {
      const cleanPath = path.replace(/^\.\//, "");
      return `![${alt}](${baseUrl}${cleanPath})`;
    },
  );
}

/** Generate a slug from a title. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Fetch and process a single workbench entry. */
async function fetchEntry(
  kind: WorkKind,
  dirName: string,
  sha: string,
  token?: string,
): Promise<WorkbenchEntry | Violation> {
  const path = `${kind}s/${dirName}/README.md`;
  const rawUrl = `${RAW}/${REPO}/${sha}/${path}`;
  const rawMarkdown = await fetchText(rawUrl);

  if (!rawMarkdown) {
    return {
      source: { repo: REPO, ref: DEFAULT_BRANCH },
      kind,
      reason: `Missing README.md in ${kind}s/${dirName}`,
    };
  }

  const { data: frontmatter, content } = matter(rawMarkdown);
  const parsed = WorkbenchSchema.safeParse(frontmatter);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => i.message).join("; ");
    return {
      source: { repo: REPO, ref: DEFAULT_BRANCH },
      kind,
      reason: `Invalid frontmatter in ${kind}s/${dirName}: ${issues}`,
    };
  }

  const baseUrl = `${RAW}/${REPO}/${sha}/${kind}s/${dirName}/`;
  const body = resolveRelativeImages(content, baseUrl);
  const id = slugify(parsed.data.title);

  return {
    id,
    body,
    data: parsed.data,
    source: {
      repo: REPO,
      ref: DEFAULT_BRANCH,
      sha,
      path,
    },
  };
}

/**
 * Main entry point — fetches all workbench content from GitHub.
 * Returns entries ready for the Astro content collection, plus violations.
 */
export async function loadWorkbench(
  token?: string,
): Promise<LoadResult> {
  const violations: Violation[] = [];
  const sources: ResolvedSource[] = [];

  // Resolve the branch to a pinned SHA
  const sha = await resolveSha(DEFAULT_BRANCH, token);
  if (!sha) {
    console.error("[workbench] Failed to resolve SHA — aborting content load");
    return { entries: [], violations, sources };
  }

  console.log(`[workbench] Resolved ${DEFAULT_BRANCH} → ${sha.slice(0, 7)}`);

  // Discover entries in both directories
  const projectDirs = await listDirs("projects", token);
  const explorationDirs = await listDirs("explorations", token);

  console.log(`[workbench] Found ${projectDirs.length} projects, ${explorationDirs.length} explorations`);

  // Fetch all entries
  const results = await Promise.all([
    ...projectDirs.map((dir) => fetchEntry("project", dir, sha, token)),
    ...explorationDirs.map((dir) => fetchEntry("exploration", dir, sha, token)),
  ]);

  // Separate entries from violations
  const entries: WorkbenchEntry[] = [];
  for (const result of results) {
    if ("reason" in result) {
      violations.push(result);
      console.warn(`[workbench] SKIP: ${result.reason}`);
    } else {
      entries.push(result);
      sources.push(result.source);
    }
  }

  // Sort by started date (newest first), entries without started go last
  entries.sort((a, b) => {
    const dateA = a.data.started ?? "0000-00";
    const dateB = b.data.started ?? "0000-00";
    return dateB.localeCompare(dateA);
  });

  console.log(`[workbench] Loaded ${entries.length} entries, ${violations.length} violations`);

  return { entries, violations, sources };
}
