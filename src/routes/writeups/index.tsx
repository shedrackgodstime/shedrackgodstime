import { component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { PageHeader } from "../../components/page-header";
import { fetchAllWriteups } from "../../lib/github";

export const useWriteups = routeLoader$(async () => {
  return await fetchAllWriteups();
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
    "Incident Analysis": "bg-red-50 border-red-200 text-red-600",
    "Architecture": "bg-precision/10 border-precision/25 text-precision",
    "Research": "bg-emerald-50 border-emerald-200 text-emerald-700",
  };

  return (
    <div class="min-h-screen py-12 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
        <PageHeader
          tag="RESEARCH"
          title="Technical Writeups"
          description="Incident analyses, architecture deep-dives, and security research."
        />

        {/* Search */}
        <div class="mb-10 max-w-md animate-fade-in-up delay-400">
          <input
            type="text"
            placeholder="Search writeups..."
            bind:value={searchTerm}
            class="w-full bg-white px-5 py-3.5 font-mono text-sm transition-all focus:ring-2 focus:ring-precision focus:outline-none border-ink/10 border placeholder:text-gray-400"
          />
        </div>

        {/* List */}
        <div class="space-y-4">
          {filteredWriteups.map((writeup, index) => (
            <a
              key={writeup.slug}
              href={`/writeups/${writeup.slug}`}
              class="group relative overflow-hidden bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-precision/8 border-ink/10 border block cursor-pointer"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Left border accent */}
              <div class="absolute left-0 top-0 h-0 w-[3px] bg-precision transition-all duration-300 group-hover:h-full" />

              <div class="relative px-7 py-6 transition-all duration-300 group-hover:pl-10">
                {/* Meta row */}
                <div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <span
                    class={`inline-block w-fit px-2.5 py-0.5 font-mono text-[0.65rem] tracking-wider uppercase border ${categoryColors[writeup.category] ?? "bg-gray-50 border-gray-200 text-gray-500"}`}
                  >
                    {writeup.category}
                  </span>
                  <span class="font-mono text-xs text-gray-400">{writeup.readTime}</span>
                </div>

                <h3
                  class="mb-2 font-semibold tracking-tight transition-colors group-hover:text-precision"
                  style={{ fontSize: "clamp(1rem, 2.5vw, 1.4rem)" }}
                >
                  {writeup.title}
                </h3>

                <p class="mb-4 text-sm leading-relaxed text-ink-subtle">
                  {writeup.excerpt}
                </p>

                <div class="flex items-center justify-between">
                  <span class="font-mono text-xs text-gray-400">{writeup.date}</span>
                  <span class="translate-x-0 text-sm text-precision opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                    Read →
                  </span>
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
