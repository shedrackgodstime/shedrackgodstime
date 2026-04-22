import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Project } from "../lib/github";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export const ProjectCard = component$<ProjectCardProps>(({ project, index = 0 }) => {
  const delayClass = `delay-${((index % 6) + 1) * 100}`;

  return (
    <Link
      href={`/projects/${project.slug}`}
      class={`group relative flex h-full flex-col overflow-hidden border border-ink/8 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-precision/30 hover:shadow-[0_32px_64px_-16px_rgba(37,99,235,0.14)] animate-fade-in-up ${delayClass}`}
    >
      {/* Background Accent */}
      <div class="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-precision/5 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-precision/10" />

      <div class="mb-10 flex items-center justify-between">
        <span class="font-mono text-[0.65rem] font-bold tracking-[0.25em] text-precision uppercase">
          {project.year}
        </span>
        <div class="h-[1px] flex-1 mx-4 bg-ink/5 group-hover:bg-precision/20 transition-colors duration-500" />
        <span class="font-mono text-[0.6rem] tracking-[0.1em] text-ink/40 uppercase">
          {project.status}
        </span>
      </div>

      <div class="mb-4">
        <p class="mb-2 font-mono text-[0.6rem] tracking-[0.2em] text-ink-subtle/60 uppercase">
          {project.category}
        </p>
        <h3 class="text-3xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-precision">
          {project.title}
        </h3>
      </div>

      <p class="mb-8 text-sm leading-relaxed text-ink-subtle line-clamp-2">
        {project.description}
      </p>

      <div class="mb-8 flex flex-wrap gap-2">
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            class="rounded-full bg-canvas-subtle px-3 py-1 font-mono text-[0.6rem] font-medium tracking-wider text-ink-subtle transition-colors duration-300 group-hover:bg-precision/5 group-hover:text-precision"
          >
            #{tag.toLowerCase()}
          </span>
        ))}
      </div>

      <div class="mt-auto flex items-center gap-3 pt-6 text-precision">
        <span class="font-mono text-[0.65rem] font-bold tracking-[0.2em] uppercase">
          Explore Technical Case
        </span>
        <div class="h-4 w-4 rounded-full border border-precision/30 flex items-center justify-center transition-all duration-500 group-hover:bg-precision group-hover:text-white">
          <span class="text-[0.6rem] transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </div>
    </Link>
  );
});
