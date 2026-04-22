import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead, type StaticGenerateHandler } from "@builder.io/qwik-city";
import { fetchAllWriteups } from "../../../lib/github";

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
  "Architecture": "bg-precision/10 border-precision/25 text-precision",
  "Research": "bg-emerald-50 border-emerald-200 text-emerald-700",
};

/** Very minimal Markdown-to-HTML: headings and paragraphs only */
function renderBody(raw: string) {
  const blocks = raw.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          class="mt-10 mb-4 font-mono text-xs tracking-widest text-precision uppercase"
        >
          {block.replace(/^## /, "")}
        </h2>
      );
    }
    // Inline code: `code`
    const parts = block.split(/(`[^`]+`)/g);
    return (
      <p key={i} class="leading-relaxed text-ink-subtle" style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)" }}>
        {parts.map((part, j) =>
          part.startsWith("`") && part.endsWith("`") ? (
            <code key={j} class="font-mono text-[0.85em] bg-canvas-subtle border border-ink/10 px-1.5 py-0.5">
              {part.slice(1, -1)}
            </code>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

export default component$(() => {
  const writeupSig = useWriteupData();
  const allWriteupsSig = useAllWriteups();
  const writeup = writeupSig.value;
  const allWriteups = allWriteupsSig.value;

  if (!writeup) {
    return (
      <div class="flex min-h-[60vh] flex-col items-center justify-center">
        <p class="font-mono text-xs tracking-widest text-gray-400 uppercase">404</p>
        <h1 class="mt-3 text-2xl font-bold tracking-tight">Writeup not found</h1>
        <a href="/writeups" class="mt-6 font-mono text-sm text-precision underline-offset-4 hover:underline">
          ← Back to Writeups
        </a>
      </div>
    );
  }

  return (
    <div class="min-h-screen py-12 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">

        {/* Back nav */}
        <div class="mb-10 animate-fade-in-up">
          <a
            href="/writeups"
            class="font-mono text-xs tracking-widest text-gray-400 uppercase transition-colors hover:text-precision"
          >
            ← Writeups
          </a>
        </div>

        <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Left sticky meta panel */}
          <aside class="lg:col-span-3 animate-fade-in-up">
            <div class="lg:sticky lg:top-32 space-y-6">
              <span
                class={`inline-block px-2.5 py-0.5 font-mono text-[0.65rem] tracking-wider uppercase border ${categoryColors[writeup.category] ?? "bg-gray-50 border-gray-200 text-gray-500"}`}
              >
                {writeup.category}
              </span>
              <div class="space-y-1">
                <p class="font-mono text-xs text-gray-400">{writeup.date}</p>
                <p class="font-mono text-xs text-gray-400">{writeup.readTime}</p>
              </div>
              <div class="h-px w-full bg-ink/8" />
              <p class="text-sm leading-relaxed text-ink-subtle">{writeup.excerpt}</p>
            </div>
          </aside>

          {/* Right: Article body */}
          <article class="lg:col-span-9 animate-fade-in-up delay-200">
            <h1
              class="mb-8 font-bold tracking-tight"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", lineHeight: "1.15", letterSpacing: "-0.02em" }}
            >
              {writeup.title}
            </h1>
            <div class="mb-8 h-1 w-16 bg-precision" />

            <div class="space-y-4">
              {renderBody(writeup.body)}
            </div>
          </article>
        </div>

        {/* More writeups */}
        <div class="mt-20 border-t border-ink/8 pt-10">
          <p class="mb-4 font-mono text-xs tracking-widest text-gray-400 uppercase">More Writeups</p>
          <div class="flex flex-wrap gap-4">
            {allWriteups
              .filter((w) => w.slug !== writeup.slug)
              .map((w) => (
                <a
                  key={w.slug}
                  href={`/writeups/${w.slug}`}
                  class="group border-ink/10 border bg-white px-5 py-3 text-sm font-medium transition-all hover:border-precision/40 hover:text-precision"
                >
                  {w.title} <span class="text-gray-400 group-hover:text-precision">→</span>
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
    title: writeup ? `${writeup.title} | Shedrack Godstime` : "Writeup Not Found",
    meta: [
      {
        name: "description",
        content: writeup?.excerpt ?? "Writeup not found.",
      },
    ],
  };
};
