import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Project } from "../lib/data";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = component$<ProjectCardProps>(({ project }) => {
  return (
    <Link
      href={`/projects/${project.slug}`}
      class="group flex h-full flex-col border border-ink/10 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-precision/20 hover:shadow-[0_18px_40px_-28px_rgba(37,99,235,0.28)]"
    >
      <div class="mb-8">
        <span class="font-mono text-xs tracking-[0.18em] text-precision uppercase">
          {project.year}
        </span>
      </div>

      <p class="mb-3 font-mono text-[0.65rem] tracking-[0.18em] text-ink-subtle uppercase">
        {project.category} / {project.status}
      </p>

      <h3 class="mb-3 text-2xl font-semibold tracking-tight transition-colors group-hover:text-precision">
        {project.title}
      </h3>

      <p class="mb-6 text-sm leading-relaxed text-ink-subtle">
        {project.description}
      </p>

      <div class="mb-6 flex flex-wrap gap-2">
        {project.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            class="border border-ink/8 bg-canvas-subtle px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.08em] text-ink-subtle uppercase"
          >
            {tag}
          </span>
        ))}
      </div>

      <div class="mt-auto flex items-center justify-between border-t border-ink/8 pt-4">
        <span class="font-mono text-[0.65rem] tracking-[0.18em] text-ink-subtle uppercase">
          Open Project
        </span>
        <span class="font-mono text-[0.65rem] tracking-[0.18em] text-precision uppercase transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
});
