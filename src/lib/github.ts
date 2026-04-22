import { z } from "zod";
import matter from "gray-matter";
import { marked } from "marked";

const GITHUB_USER = "shedrackgodstime";
const CONTENT_REPO = "portfolio-content";

// Define the Zod schemas for our frontmatter
export const ProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  year: z.coerce.string(),
  status: z.enum(["Active", "Completed"]).default("Completed"),
  category: z.string().default("Project"),
});

export const WriteupSchema = z.object({
  title: z.string(),
  date: z.string(),
  category: z.enum(["Incident Analysis", "Architecture", "Research"]).catch("Research"),
  readTime: z.string().optional().default("5 min read"),
  excerpt: z.string().optional().default(""),
});

// The final types used by the UI
export interface Project {
  slug: string;
  repo: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  status: "Active" | "Completed";
  category: string;
  sections: { label: string; content: string }[];
}

export interface Writeup {
  slug: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  body: string;
}

// In-memory cache for SSG build process
let projectsCache: Project[] | null = null;
let writeupsCache: Writeup[] | null = null;

// Fetch helper with standard headers
async function fetchGithubAPI(url: string, token?: string | null) {
  const headers: Record<string, string> = {
    "User-Agent": "Qwik-Portfolio-Builder",
    "Accept": "application/vnd.github.v3+json",
  };
  
  // Use passed token or fallback to process.env (for local dev)
  const actualToken = token || (typeof process !== "undefined" ? process.env?.GITHUB_TOKEN : undefined);
  
  if (actualToken) {
    headers["Authorization"] = `Bearer ${actualToken}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.error(`[GitHub API] ERROR: ${res.status} ${res.statusText} on ${url}`);
    if (res.status === 403) {
      console.error("[GitHub API] Rate limit hit! You MUST use a GITHUB_TOKEN.");
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText} on ${url}`);
  }
  return res.json();
}

/**
 * Fetches all repos tagged with "portfolio", then grabs their portfolio.md
 */
export async function fetchAllProjects(token?: string | null): Promise<Project[]> {
  if (projectsCache) return projectsCache;

  try {
    // 1. Find tagged repos
    const searchUrl = `https://api.github.com/search/repositories?q=user:${GITHUB_USER}+topic:portfolio`;
    const searchData = await fetchGithubAPI(searchUrl, token);
    
    const projects: Project[] = [];

    // 2. Fetch portfolio.md for each repo
    for (const repo of searchData.items) {
      try {
        const fileUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/main/portfolio.md`;
        const fileRes = await fetch(fileUrl);
        
        if (!fileRes.ok) {
          console.warn(`[GitHub] No portfolio.md found in ${repo.name}. Skipping.`);
          continue;
        }

        const rawMarkdown = await fileRes.text();
        
        // 3. Parse frontmatter
        const { data: frontmatter, content: markdownBody } = matter(rawMarkdown);
        
        // Validate against our schema
        const parsed = ProjectSchema.safeParse(frontmatter);
        if (!parsed.success) {
          console.warn(`[GitHub] Invalid frontmatter in ${repo.name}. Skipping.`);
          continue;
        }

        // 4. AST Parsing for sticky sections layout
        const tokens = marked.lexer(markdownBody);
        const sections: { label: string; content: string }[] = [];
        
        let currentSection: { label: string; content: string[] } | null = null;
        
        for (const token of tokens) {
          if (token.type === "heading" && token.depth === 2) {
            // New section found
            if (currentSection) {
              sections.push({ label: currentSection.label, content: currentSection.content.join("\\n\\n") });
            }
            currentSection = { label: token.text, content: [] };
          } else if (currentSection) {
            // Accumulate content into the current section
            currentSection.content.push(token.raw.trim());
          }
        }
        
        // Push the final section
        if (currentSection) {
          sections.push({ label: currentSection.label, content: currentSection.content.join("\\n\\n") });
        }

        projects.push({
          slug: repo.name,
          repo: repo.html_url,
          ...parsed.data,
          sections,
        });

      } catch (err) {
        console.error(`Error processing repo ${repo.name}:`, err);
      }
    }

    // Sort by year descending
    projectsCache = projects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    return projectsCache;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return []; // Return empty array on failure instead of breaking the build
  }
}

/**
 * Fetches writeups from two places:
 * 1. Local `src/content/writeups/` folder (for general writeups)
 * 2. Remote `writeups/` folder inside any GitHub repo tagged with "portfolio"
 */
export async function fetchAllWriteups(token?: string | null): Promise<Writeup[]> {
  if (writeupsCache) return writeupsCache;

  const writeups: Writeup[] = [];

  try {
    // --- SOURCE A: Local Writeups ---
    try {
      // Use Vite's glob import to bundle files at build time. 
      // This fixes the Cloudflare Worker error because Cloudflare cannot use Node 'fs' at runtime.
      const markdownFiles = import.meta.glob("../../writeups/*.md", { query: "?raw", import: "default", eager: true });
      
      for (const [filePath, rawMarkdown] of Object.entries(markdownFiles)) {
        const fileName = filePath.split("/").pop() || "";
        
        const { data: frontmatter, content: body } = matter(rawMarkdown as string);
        const parsed = WriteupSchema.safeParse(frontmatter);
        
        if (parsed.success) {
          writeups.push({
            slug: fileName.replace(".md", ""),
            ...parsed.data,
            body,
          });
        } else {
          console.warn(`[Local] Invalid frontmatter in ${fileName}. Skipping.`);
        }
      }
    } catch (err: any) {
      console.error("Error reading local writeups:", err);
    }

    // --- SOURCE B: Remote Writeups (from project repos) ---
    const searchUrl = `https://api.github.com/search/repositories?q=user:${GITHUB_USER}+topic:portfolio`;
    const searchData = await fetchGithubAPI(searchUrl, token).catch(() => ({ items: [] }));
    
    if (searchData.items && Array.isArray(searchData.items)) {
      for (const repo of searchData.items) {
        try {
          const contentsUrl = `https://api.github.com/repos/${GITHUB_USER}/${repo.name}/contents/writeups`;
          const contentsData = await fetchGithubAPI(contentsUrl, token).catch(() => null);
          
          if (!contentsData || !Array.isArray(contentsData)) {
            continue; // No writeups directory in this repo
          }

          for (const file of contentsData) {
            if (!file.name.endsWith(".md")) continue;

            const rawMarkdownRes = await fetch(file.download_url);
            if (!rawMarkdownRes.ok) continue;

            const rawMarkdown = await rawMarkdownRes.text();
            const { data: frontmatter, content: body } = matter(rawMarkdown);
            
            const parsed = WriteupSchema.safeParse(frontmatter);
            if (parsed.success) {
              writeups.push({
                slug: file.name.replace(".md", ""),
                ...parsed.data,
                body,
              });
            } else {
              console.warn(`[GitHub] Invalid frontmatter in ${repo.name}/writeups/${file.name}. Skipping.`);
            }
          }
        } catch (err) {
          console.error(`Error processing writeups for repo ${repo.name}:`, err);
        }
      }
    }

    // Sort by date descending
    writeupsCache = writeups.sort((a, b) => b.date.localeCompare(a.date));
    return writeupsCache;
  } catch (error) {
    console.error("Failed to fetch writeups:", error);
    return writeups; // return whatever we managed to fetch
  }
}
