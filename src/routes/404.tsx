import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="flex min-h-[80vh] flex-col items-center justify-center text-center px-6">
      {/* Technical decoration */}
      <p class="mb-4 font-mono text-[0.65rem] tracking-[0.3em] text-gray-300 uppercase">
        STATUS_CODE
      </p>
      <p
        class="font-bold text-precision bg-gradient-to-r from-precision to-blue-600 bg-clip-text text-transparent"
        style={{ fontSize: "clamp(5rem, 20vw, 12rem)", lineHeight: "1", letterSpacing: "-0.04em" }}
      >
        404
      </p>

      <div class="my-6 h-1 w-16 bg-precision" />

      <h1 class="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
        Page Not Found
      </h1>
      <p class="mb-10 max-w-sm text-sm text-ink-subtle">
        The page you're looking for doesn't exist, or has moved.
      </p>

      <div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <a
          href="/"
          class="bg-precision px-7 py-3 text-center text-sm font-medium text-white transition-all hover:bg-blue-700"
        >
          Back to Home
        </a>
        <a
          href="/projects"
          class="border border-ink/15 bg-white px-7 py-3 text-center text-sm font-medium transition-all hover:border-precision/40 hover:bg-canvas-subtle"
        >
          View Projects
        </a>
      </div>

      {/* Bottom monospace nav */}
      <div class="mt-16 flex gap-6">
        {["/about", "/writeups", "/contact"].map((href) => (
          <a
            key={href}
            href={href}
            class="font-mono text-xs tracking-widest text-gray-400 uppercase transition-colors hover:text-precision"
          >
            {href.replace("/", "")}
          </a>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "404 — Not Found | Shedrack Godstime",
  meta: [
    { name: "description", content: "Page not found." },
    { name: "robots", content: "noindex" },
  ],
};
