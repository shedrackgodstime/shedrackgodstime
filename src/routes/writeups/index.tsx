import { component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { PageHeader } from "../../components/page-header";
import { fetchAllWriteups } from "../../lib/github";

export const useWriteups = routeLoader$(async ({ env }) => {
  return await fetchAllWriteups(env.get("GITHUB_TOKEN"));
});

export default component$(() => {
  const writeupsSig = useWriteups();
  const writeups = writeupsSig.value;
  const searchTerm = useSignal("");

  const filteredWriteups = writeups.filter(
    (writeup) =>
      writeup.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      writeup.category.toLowerCase().includes(searchTerm.value.toLowerCase())
  );

  const categoryColors: Record<string, string> = {
    "Incident Analysis": "bg-red-500/5 border-red-500/20 text-red-600",
    "Architecture": "bg-precision/5 border-precision/20 text-precision",
    "Research": "bg-emerald-500/5 border-emerald-500/20 text-emerald-600",
  };

  return (
    <div class="min-h-screen py-12 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
        <PageHeader
          tag="RESEARCH"
          title="Technical Writeups"
          description="In-depth post-mortems, system design documents, and security research findings."
        />

        {/* Search */}
        <div class="mb-16 max-w-lg animate-fade-in-up delay-400">
          <div class="group relative">
            <input
              type="text"
              placeholder="Search by keyword or category..."
              bind:value={searchTerm}
              class="w-full bg-white px-6 py-4 font-mono text-xs tracking-wider transition-all focus:ring-1 focus:ring-precision focus:outline-none border-ink/8 border-l-4 border-l-precision/20 focus:border-l-precision placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* List */}
        <div class="grid grid-cols-1 gap-4">
          {filteredWriteups.map((writeup, index) => (
            <a
              key={writeup.slug}
              href={`/writeups/${writeup.slug}`}
              class={`group relative overflow-hidden bg-white border border-ink/8 px-8 py-8 transition-all duration-500 hover:-translate-x-1 hover:border-precision/30 hover:shadow-[32px_0_64px_-16px_rgba(37,99,235,0.08)] animate-fade-in-up delay-${((index % 6) + 1) * 100}`}
            >
              {/* Vertical Accent */}
              <div class="absolute right-0 top-0 h-full w-[2px] bg-precision/5 transition-all duration-500 group-hover:bg-precision group-hover:w-1" />

              <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex-1">
                  {/* Meta */}
                  <div class="mb-4 flex items-center gap-4">
                    <span
                      class={`px-3 py-1 font-mono text-[0.6rem] font-bold tracking-widest uppercase border ${categoryColors[writeup.category] ?? "bg-gray-50 border-gray-200 text-gray-500"}`}
                    >
                      {writeup.category}
                    </span>
                    <span class="font-mono text-[0.6rem] tracking-[0.2em] text-ink/30 uppercase italic">
                      {writeup.readTime}
                    </span>
                  </div>

                  <h3 class="text-2xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-precision">
                    {writeup.title}
                  </h3>
                  
                  <p class="mt-2 max-w-3xl text-sm leading-relaxed text-ink-subtle">
                    {writeup.excerpt}
                  </p>
                </div>

                <div class="flex items-center justify-between border-t border-ink/5 pt-6 lg:border-none lg:pt-0">
                  <div class="flex flex-col lg:items-end">
                    <span class="font-mono text-[0.65rem] font-bold tracking-widest text-ink/80 uppercase">
                      {writeup.date.split("-")[1]}
                    </span>
                    <span class="font-mono text-[0.65rem] tracking-widest text-ink/30 uppercase">
                      {writeup.date.split("-")[0]}
                    </span>
                  </div>
                  
                  <div class="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 transition-all duration-500 group-hover:border-precision group-hover:bg-precision group-hover:text-white lg:ml-12">
                    <span class="text-xs transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}

          {filteredWriteups.length === 0 && (
            <div class="py-16 text-center">
              <p class="font-mono text-sm text-gray-400">
                No writeups matching "{searchTerm.value}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Writeups | Shedrack Godstime",
  meta: [
    {
      name: "description",
      content: "Technical writeups on incident analysis, security architecture, and cryptography research.",
    },
  ],
};
