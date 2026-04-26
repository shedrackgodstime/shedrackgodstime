import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  type DocumentHead,
  type StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { fetchAllWriteups } from "../../../lib/github";
import { MarkdownRenderer } from "../../../components/markdown-renderer";

export const useWriteupData = routeLoader$(async ({ params, status, env }) => {
  const writeups = await fetchAllWriteups(env.get("GITHUB_TOKEN"));
  const writeup = writeups.find((w) => w.slug === params.slug);
  if (!writeup) {
    status(404);
  }
  return writeup ?? null;
});

export const useAllWriteups = routeLoader$(async ({ env }) => {
  return await fetchAllWriteups(env.get("GITHUB_TOKEN"));
});

export const onStaticGenerate: StaticGenerateHandler = async ({ env }) => {
  const writeups = await fetchAllWriteups(env.get("GITHUB_TOKEN"));
  return {
    params: writeups.map((w) => {
      return { slug: w.slug };
    }),
  };
};

const categoryColors: Record<string, string> = {
  "Incident Analysis": "bg-red-50 border-red-200 text-red-600",
  Architecture: "bg-precision/10 border-precision/25 text-precision",
  Research: "bg-emerald-50 border-emerald-200 text-emerald-700",
};

export default component$(() => {
  const writeupSig = useWriteupData();
  const allWriteupsSig = useAllWriteups();
  const writeup = writeupSig.value;
  const allWriteups = allWriteupsSig.value;

  if (!writeup) {
    return (
      <div class="flex min-h-[60vh] flex-col items-center justify-center">
        <p class="font-mono text-xs tracking-widest text-gray-400 uppercase">
          404
        </p>
        <h1 class="mt-3 text-2xl font-bold tracking-tight">
          Writeup not found
        </h1>
        <a
          href="/writeups"
          class="text-precision mt-6 font-mono text-sm underline-offset-4 hover:underline"
        >
          ← Back to Writeups
        </a>
      </div>
    );
  }

  return (
    <div class="min-h-screen py-12 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
        {/* Back nav */}
        <div class="animate-fade-in-up mb-10">
          <a
            href="/writeups"
            class="hover:text-precision font-mono text-xs tracking-widest text-gray-400 uppercase transition-colors"
          >
            ← Writeups
          </a>
        </div>

        <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left sticky meta panel */}
          <aside class="animate-fade-in-up lg:col-span-3">
            <div class="space-y-6 lg:sticky lg:top-32">
              <span
                class={`inline-block border px-2.5 py-0.5 font-mono text-[0.65rem] tracking-wider uppercase ${categoryColors[writeup.category] ?? "border-gray-200 bg-gray-50 text-gray-500"}`}
              >
                {writeup.category}
              </span>
              <div class="space-y-1">
                <p class="font-mono text-xs text-gray-400">{writeup.date}</p>
                <p class="font-mono text-xs text-gray-400">
                  {writeup.readTime}
                </p>
              </div>
              <div class="bg-ink/8 h-px w-full" />
              <p class="text-ink-subtle text-sm leading-relaxed">
                {writeup.excerpt}
              </p>
            </div>
          </aside>

          {/* Right: Article body */}
          <article class="animate-fade-in-up delay-200 lg:col-span-9">
            <h1
              class="mb-8 font-bold tracking-tight"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                lineHeight: "1.15",
                letterSpacing: "-0.02em",
              }}
            >
              {writeup.title}
            </h1>
            <div class="bg-precision mb-8 h-1 w-16" />

            <MarkdownRenderer content={writeup.body} />
          </article>
        </div>

        {/* More writeups */}
        <div class="border-ink/8 mt-20 border-t pt-10">
          <p class="mb-4 font-mono text-xs tracking-widest text-gray-400 uppercase">
            More Writeups
          </p>
          <div class="flex flex-wrap gap-4">
            {allWriteups
              .filter((w) => w.slug !== writeup.slug)
              .map((w) => (
                <a
                  key={w.slug}
                  href={`/writeups/${w.slug}`}
                  class="group border-ink/10 hover:border-precision/40 hover:text-precision border bg-white px-5 py-3 text-sm font-medium transition-all"
                >
                  {w.title}{" "}
                  <span class="group-hover:text-precision text-gray-400">
                    →
                  </span>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const writeup = resolveValue(useWriteupData);
  return {
    title: writeup
      ? `${writeup.title} | Shedrack Godstime`
      : "Writeup Not Found",
    meta: [
      {
        name: "description",
        content: writeup?.excerpt ?? "Writeup not found.",
      },
    ],
  };
};
