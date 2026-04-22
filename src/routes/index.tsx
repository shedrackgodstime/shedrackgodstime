import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { projects as allProjects } from "../lib/data";

export default component$(() => {
  const mousePosition = useSignal({ x: 0, y: 0 });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.value = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  });

  const skills = [
    "Rust",
    "P2P Systems",
    "Cryptography",
    "Distributed Networks",
    "Python",
    "Network Security",
  ];

  // First 3 projects from the shared data file
  const featuredProjects = allProjects.slice(0, 3);


  return (
    <div class="min-h-screen overflow-hidden">
      {/* ─── Hero Section ─── */}
      <section class="relative flex min-h-[95vh] items-center">

        {/* Animated SVG background: grid + glowing nodes */}
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            viewBox="0 0 1920 1080"
            class="h-full w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="var(--color-precision)" stop-opacity="0.015" />
                <stop offset="100%" stop-color="var(--color-precision)" stop-opacity="0.05" />
              </linearGradient>
              <radialGradient id="glowGradient">
                <stop offset="0%" stop-color="var(--color-precision)" stop-opacity="0.25" />
                <stop offset="100%" stop-color="var(--color-precision)" stop-opacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="1920" height="1080" fill="url(#gridGradient)" />

            {/* Grid lines */}
            <g opacity="0.08">
              {Array.from({ length: 48 }).map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * 40} y1="0"
                  x2={i * 40} y2="1080"
                  stroke="var(--color-precision)" stroke-width="0.5"
                />
              ))}
              {Array.from({ length: 28 }).map((_, i) => (
                <line
                  key={`h${i}`}
                  x1="0" y1={i * 40}
                  x2="1920" y2={i * 40}
                  stroke="var(--color-precision)" stroke-width="0.5"
                />
              ))}
            </g>

            {/* Mouse-follow glow orbs */}
            <circle
              cx={mousePosition.value.x * 0.05}
              cy={mousePosition.value.y * 0.05}
              r="160"
              fill="url(#glowGradient)"
              style={{ transition: "cx 0.15s ease, cy 0.15s ease" }}
            />
            <circle
              cx={1920 - mousePosition.value.x * 0.03}
              cy={1080 - mousePosition.value.y * 0.03}
              r="200"
              fill="url(#glowGradient)"
              style={{ transition: "cx 0.15s ease, cy 0.15s ease" }}
            />

            {/* Animated pulsing nodes */}
            <g filter="url(#glow)">
              {[
                { cx: 200, cy: 150, delay: 0 },
                { cx: 600, cy: 250, delay: 0.5 },
                { cx: 1200, cy: 200, delay: 1 },
                { cx: 1600, cy: 300, delay: 1.5 },
                { cx: 400, cy: 600, delay: 0.3 },
                { cx: 900, cy: 700, delay: 0.8 },
                { cx: 1400, cy: 650, delay: 1.3 },
              ].map((node, i) => (
                <circle key={i} cx={node.cx} cy={node.cy} r="3" fill="var(--color-precision)" opacity="0.5">
                  <animate attributeName="opacity" values="0.2;0.8;0.2"
                    dur={`${3 + i * 0.3}s`} begin={`${node.delay}s`} repeatCount="indefinite" />
                  <animate attributeName="r" values="3;5;3"
                    dur={`${3 + i * 0.3}s`} begin={`${node.delay}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>

            {/* Animated dashed connection lines */}
            <g opacity="0.12">
              {[
                { x1: 200, y1: 150, x2: 600, y2: 250, dur: "1s" },
                { x1: 600, y1: 250, x2: 1200, y2: 200, dur: "1.2s" },
                { x1: 1200, y1: 200, x2: 1600, y2: 300, dur: "1.4s" },
                { x1: 400, y1: 600, x2: 900, y2: 700, dur: "1.1s" },
              ].map((line, i) => (
                <line
                  key={i}
                  x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                  stroke="var(--color-precision)" stroke-width="1" stroke-dasharray="4,6"
                >
                  <animate attributeName="stroke-dashoffset"
                    from="0" to="10" dur={line.dur} repeatCount="indefinite" />
                </line>
              ))}
            </g>
          </svg>
        </div>

        {/* Hero content */}
        <div class="relative mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-12">
          <div class="max-w-4xl">

            {/* Role badge */}
            <div
              class="mb-6 inline-block bg-precision/5 px-4 py-2 backdrop-blur-sm animate-fade-in-up"
              style={{ border: "1px solid rgba(37, 99, 235, 0.2)" }}
            >
              <span class="font-mono text-xs uppercase tracking-widest text-precision">
                CYBERSECURITY / SYSTEMS_PROGRAMMER
              </span>
            </div>

            {/* Name */}
            <h1
              class="mb-6 font-bold animate-fade-in-up delay-200"
              style={{
                fontSize: "clamp(3rem, 10vw, 8rem)",
                lineHeight: "1.02",
                letterSpacing: "-0.03em",
              }}
            >
              Shedrack
              <br />
              <span class="bg-gradient-to-r from-precision to-blue-600 bg-clip-text text-transparent">
                Godstime
              </span>
            </h1>

            {/* Tagline */}
            <p
              class="mb-10 max-w-2xl leading-relaxed text-ink-subtle animate-fade-in-up delay-400"
              style={{ fontSize: "clamp(1rem, 2.5vw, 1.35rem)" }}
            >
              Building secure distributed systems — P2P networking,
              applied cryptography, and resilient infrastructure.
            </p>

            {/* CTAs */}
            <div class="mb-12 flex flex-col gap-4 sm:flex-row sm:gap-5 animate-fade-in-up delay-600">
              <Link
                href="/projects"
                class="group relative overflow-hidden bg-precision px-8 py-4 text-center font-medium tracking-wide text-white transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-precision/30"
              >
                <span class="relative z-10">View Projects</span>
                <div class="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                href="/about"
                class="border border-ink/15 bg-white px-8 py-4 text-center font-medium tracking-wide transition-all hover:border-precision/40 hover:bg-canvas-subtle"
              >
                About Me
              </Link>
            </div>

            {/* Skill chips */}
            <div class="flex flex-wrap gap-2.5 animate-fade-in-up delay-800">
              {skills.map((skill) => (
                <span
                  key={skill}
                  class="bg-white/80 px-3.5 py-1.5 font-mono text-xs text-ink-subtle backdrop-blur-sm border border-ink/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div class="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block animate-fade-in-up delay-800">
          <div class="flex flex-col items-center gap-3">
            <span class="font-mono text-[0.65rem] tracking-[0.2em] text-gray-400">SCROLL</span>
            <div class="relative h-12 w-[1px] bg-gradient-to-b from-precision/20 to-transparent overflow-hidden">
              <div class="absolute left-0 top-0 h-4 w-full bg-precision animate-[scroll-down_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Projects Preview ─── */}
      <section class="border-t border-ink/8 bg-canvas-subtle py-20 sm:py-28">
        <div class="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">

          <div class="mb-10 flex items-end justify-between">
            <div>
              <p class="mb-2 font-mono text-xs tracking-widest text-precision uppercase">Featured Work</p>
              <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Recent Projects</h2>
            </div>
            <Link
              href="/projects"
              class="hidden font-mono text-xs tracking-widest text-ink-subtle uppercase transition-colors hover:text-precision sm:block"
            >
              View All →
            </Link>
          </div>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Link
                key={project.title}
                href={`/projects/${project.slug}`}
                class="group block bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-precision/10 border-ink/10 border"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div class="mb-4 flex items-center justify-between">
                  <span class="font-mono text-xs tracking-widest text-precision">{project.year}</span>
                  <span class="font-mono text-[0.65rem] tracking-widest text-gray-400 uppercase">→</span>
                </div>
                <h3 class="mb-2 font-semibold tracking-tight transition-colors group-hover:text-precision">
                  {project.title}
                </h3>
                <p class="mb-4 text-sm leading-relaxed text-ink-subtle">{project.description}</p>
                <div class="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} class="font-mono text-[0.65rem] tracking-wide text-gray-400 bg-canvas-subtle border-ink/8 border px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
                <div class="mt-5 h-px w-0 bg-precision transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div class="mt-8 sm:hidden">
            <Link
              href="/projects"
              class="font-mono text-xs tracking-widest text-ink-subtle uppercase transition-colors hover:text-precision"
            >
              View All Projects →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Shedrack Godstime | Cybersecurity & Systems Programmer",
  meta: [
    {
      name: "description",
      content: "Building secure distributed systems — P2P networking, applied cryptography, and resilient infrastructure.",
    },
  ],
};
