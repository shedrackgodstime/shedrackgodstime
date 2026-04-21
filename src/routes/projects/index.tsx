import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageHeader } from "../../components/page-header";
import { projects } from "../../lib/data";

export default component$(() => {
  const filter = useSignal<string>("All");

  const categories = ["All", "P2P", "Systems", "Research", "Web"];

  const filteredProjects =
    filter.value === "All"
      ? projects
      : projects.filter((p) => p.category === filter.value);

  return (
    <div class="min-h-screen py-12 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
        <PageHeader
          tag="PORTFOLIO"
          title="Selected Projects"
          description="A curated selection of my work across P2P systems, security tooling, and applied cryptography."
        />

        {/* Category Filter */}
        <div class="mb-10 flex flex-wrap gap-3 animate-fade-in-up delay-400">
          {categories.map((category) => (
            <button
              key={category}
              onClick$={() => (filter.value = category)}
              class={`px-5 py-2 font-mono text-xs font-medium tracking-widest uppercase transition-all border ${
                filter.value === category
                  ? "bg-precision border-precision text-white"
                  : "bg-white border-ink/10 text-ink-subtle hover:border-precision/40 hover:text-precision"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div class="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <a
              key={project.title}
              href={`/projects/${project.slug}`}
              class="group relative overflow-hidden bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-precision/10 border-ink/10 border block"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Hover corner accent */}
              <div class="absolute right-0 top-0 h-24 w-24 bg-gradient-to-br from-precision/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div class="relative z-10">
                {/* Year + Status row */}
                <div class="mb-5 flex items-center justify-between">
                  <span class="font-mono text-xs tracking-widest text-precision">
                    {project.year}
                  </span>
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

                <h3
                  class="mb-3 font-semibold tracking-tight transition-colors group-hover:text-precision"
                  style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}
                >
                  {project.title}
                </h3>

                <p class="mb-5 leading-relaxed text-ink-subtle text-sm">
                  {project.description}
                </p>

                {/* Tags */}
                <div class="mb-5 flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      class="px-2.5 py-1 font-mono text-[0.7rem] tracking-wide bg-canvas-subtle border-ink/8 text-ink-subtle border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom accent line */}
                <div class="h-px w-0 bg-precision transition-all duration-500 group-hover:w-full" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Projects | Shedrack Godstime",
  meta: [
    {
      name: "description",
      content: "Cybersecurity and systems programming projects — P2P networks, cryptography, and secure tooling.",
    },
  ],
};
