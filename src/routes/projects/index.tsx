import { component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { PageHeader } from "../../components/page-header";
import { ProjectCard } from "../../components/project-card";
import { fetchAllProjects } from "../../lib/github";

export const useProjects = routeLoader$(async ({ env }) => {
  return await fetchAllProjects(env.get("GITHUB_TOKEN"));
});

export default component$(() => {
  const projectsSig = useProjects();
  const projects = projectsSig.value;
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
        <div class="mb-8 flex items-end justify-between gap-6">
          <p class="max-w-2xl text-sm leading-relaxed text-ink-subtle">
            Browse the project archive by category. Each entry is a concise
            technical summary before the full project writeup.
          </p>
          <p class="hidden font-mono text-[0.65rem] tracking-[0.18em] text-gray-400 uppercase sm:block">
            {filteredProjects.length} entries
          </p>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
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
