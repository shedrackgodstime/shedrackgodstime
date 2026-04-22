import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { fetchAllProjects } from "../../../lib/github";

export const useProjectData = routeLoader$(async ({ params, status }) => {
  const projects = await fetchAllProjects();
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) {
    status(404);
  }
  return project ?? null;
});

export const useAllProjects = routeLoader$(async () => {
  return await fetchAllProjects();
});

export default component$(() => {
  const projectSig = useProjectData();
  const allProjectsSig = useAllProjects();
  const project = projectSig.value;
  const allProjects = allProjectsSig.value;

  if (!project) {
    return (
      <div class="flex min-h-[60vh] flex-col items-center justify-center">
        <p class="font-mono text-xs tracking-widest text-gray-400 uppercase">404</p>
        <h1 class="mt-3 text-2xl font-bold tracking-tight">Project not found</h1>
        <a href="/projects" class="mt-6 font-mono text-sm text-precision underline-offset-4 hover:underline">
          ← Back to Projects
        </a>
      </div>
    );
  }

  const sections = project.sections;

  return (
    <div class="min-h-screen py-12 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">

        {/* Back nav */}
        <div class="mb-10 animate-fade-in-up">
          <a
            href="/projects"
            class="font-mono text-xs tracking-widest text-gray-400 uppercase transition-colors hover:text-precision"
          >
            ← Projects
          </a>
        </div>

        {/* Two-column layout */}
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Left: Sticky meta panel */}
          <aside class="lg:col-span-4">
            <div class="lg:sticky lg:top-32 space-y-8 animate-fade-in-up">

              <div>
                <p class="mb-3 font-mono text-xs tracking-widest text-precision uppercase">
                  {project.year}
                </p>
                <h1
                  class="font-bold tracking-tight"
                  style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", lineHeight: "1.1", letterSpacing: "-0.02em" }}
                >
                  {project.title}
                </h1>
                <div class="mt-4 h-1 w-16 bg-precision" />
              </div>

              <p class="leading-relaxed text-ink-subtle">{project.description}</p>

              {/* Status badge */}
              <div class="flex items-center gap-3">
                <span
                  class={`px-2.5 py-0.5 font-mono text-[0.65rem] tracking-wider uppercase border ${
                    project.status === "Active"
                      ? "bg-precision/10 border-precision/25 text-precision"
                      : "bg-ink/5 border-ink/10 text-gray-400"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Tags */}
              <div class="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    class="px-2.5 py-1 font-mono text-[0.65rem] tracking-wide bg-canvas-subtle border-ink/10 text-ink-subtle border"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Repo link */}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-3 border-ink/10 border bg-white px-5 py-3 text-sm font-medium transition-all hover:border-precision/40 hover:shadow-md hover:shadow-precision/5"
                >
                  <span class="font-mono text-xs tracking-widest text-gray-400 uppercase">GitHub</span>
                  <span class="flex-1 font-mono text-xs text-ink-subtle truncate">
                    {project.repo.replace("https://github.com/", "")}
                  </span>
                  <span class="text-precision opacity-0 transition-opacity group-hover:opacity-100">→</span>
                </a>
              )}
            </div>
          </aside>

          {/* Right: Content sections */}
          <article class="lg:col-span-8 space-y-12 animate-fade-in-up delay-200">
            {sections.map((section, index) => (
              <div key={section.label} class="border-t border-ink/8 pt-10 first:border-t-0 first:pt-0">
                <h2
                  class="mb-5 font-mono text-xs tracking-widest text-precision uppercase"
                >
                  {String(index + 1).padStart(2, "0")} — {section.label}
                </h2>
                <div class="space-y-4">
                  {section.content.split("\n\n").map((para, i) => (
                    <p key={i} class="leading-relaxed text-ink-subtle" style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)" }}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </article>
        </div>

        {/* Next project navigation */}
        <div class="mt-20 border-t border-ink/8 pt-10">
          <p class="mb-4 font-mono text-xs tracking-widest text-gray-400 uppercase">More Projects</p>
          <div class="flex flex-wrap gap-4">
            {allProjects
              .filter((p) => p.slug !== project.slug)
              .slice(0, 3)
              .map((p) => (
                <a
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  class="group border-ink/10 border bg-white px-5 py-3 text-sm font-medium transition-all hover:border-precision/40 hover:text-precision"
                >
                  {p.title} <span class="text-gray-400 group-hover:text-precision">→</span>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const project = resolveValue(useProjectData);
  return {
    title: project ? `${project.title} | Shedrack Godstime` : "Project Not Found",
    meta: [
      {
        name: "description",
        content: project?.description ?? "Project not found.",
      },
    ],
  };
};
