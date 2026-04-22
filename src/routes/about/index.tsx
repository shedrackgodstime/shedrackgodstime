import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageHeader } from "../../components/page-header";

export default component$(() => {
  const expertise = [
    {
      category: "Systems Programming",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      skills: ["Rust", "C / C++", "Linux Internals", "High-Performance Computing"],
    },
    {
      category: "Security Research",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      skills: ["P2P Security", "Binary Analysis", "Vulnerability Assessment", "Threat Modeling"],
    },
    {
      category: "Network & Infrastructure",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
          <line x1="6" y1="6" x2="6.01" y2="6"></line>
          <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </svg>
      ),
      skills: ["Protocol Design", "Distributed Systems", "QUIC / iroh Transport", "NAT Traversal"],
    },
    {
      category: "Cryptography",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">
          <circle cx="8" cy="16" r="6"></circle>
          <line x1="12.24" y1="11.76" x2="19.41" y2="4.59"></line>
          <polyline points="20.59 5.41 18.59 3.41 15.59 6.41"></polyline>
        </svg>
      ),
      skills: ["ECDH Key Exchange", "ChaCha20-Poly1305", "Post-Quantum Primitives", "Protocol Design"],
    },
  ];

  return (
    <div class="min-h-screen py-12 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">

        {/* Full-width header — above the grid */}
        <PageHeader
          tag="PROFILE"
          title="About Me"
        />

        {/* Two-column grid below the header */}
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Left sticky column */}
          <div class="lg:col-span-4">
            <div class="lg:sticky lg:top-32 space-y-8">
              <p class="text-base leading-relaxed text-ink-subtle sm:text-lg animate-fade-in-up delay-300">
                Cybersecurity student and systems programmer at Auchi Polytechnic,
                specializing in P2P networking, cryptography, and secure system design.
              </p>

              <div
                class="p-6 bg-precision/5 border-precision/20 border animate-fade-in-up delay-500"
              >
                <div class="space-y-3">
                  {[
                    "Open to collaborations",
                    "Active builder",
                    "Security-focused",
                  ].map((item) => (
                    <div key={item} class="flex items-center gap-3">
                      <div class="h-1.5 w-1.5 bg-precision" />
                      <span class="font-mono text-sm text-ink-subtle">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div class="space-y-2 animate-fade-in-up delay-600">
                <p class="font-mono text-xs text-gray-400 uppercase tracking-widest">Currently Building</p>
                <p class="font-mono text-sm text-ink border-l-2 border-precision pl-4">
                  NodeChat — E2E encrypted P2P messaging
                </p>
                <p class="font-mono text-sm text-ink border-l-2 border-precision pl-4">
                  Irosh — P2P SSH orchestration tool
                </p>
              </div>
            </div>
          </div>

          {/* Right content column */}
          <div class="lg:col-span-8">
            <div class="mb-16 space-y-6 sm:mb-20 sm:space-y-8">
              {[
                "I am a Cybersecurity Technology student and systems programmer building tools in Rust, Python, and TypeScript. My focus is on the practical intersection of P2P networking, distributed systems, and applied cryptography.",
                "My current projects include NodeChat — a fully decentralized, E2E encrypted messaging application using ECDH key exchange and ChaCha20-Poly1305 — and Irosh, a P2P SSH orchestration tool that eliminates the need for central relay servers by using direct peer-to-peer connections.",
                "I approach security from the builder's side: understanding threat models well enough to design systems that are resilient by default, not by configuration.",
              ].map((text, index) => (
                <p
                  key={index}
                  class={`leading-relaxed animate-fade-in-up`}
                  style={{
                    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                    color: index === 0 ? "var(--color-ink)" : "var(--color-ink-subtle)",
                    animationDelay: `${(index + 1) * 150}ms`,
                  }}
                >
                  {text}
                </p>
              ))}
            </div>

            <div class="animate-fade-in-up delay-500">
              <h2 class="mb-8 text-2xl font-semibold tracking-tight sm:mb-10 sm:text-3xl">
                Core Expertise
              </h2>
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                {expertise.map((area, index) => (
                  <div
                    key={index}
                    class="group bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-precision/10 border-ink/10 border"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div class="mb-5 flex items-center gap-3 text-ink-subtle transition-colors group-hover:text-precision">
                      <span class="opacity-80 transition-transform group-hover:scale-110">{area.icon}</span>
                      <h3 class="font-mono text-xs font-semibold tracking-widest text-ink transition-colors group-hover:text-precision">
                        {area.category.toUpperCase()}
                      </h3>
                    </div>
                    <div class="mb-5 h-px w-full bg-gradient-to-r from-precision/20 to-transparent" />
                    <ul class="space-y-2.5">
                      {area.skills.map((skill, idx) => (
                        <li key={idx} class="flex items-start gap-3 text-ink-subtle">
                          <span class="mt-1 text-xs text-precision transition-transform group-hover:translate-x-1">→</span>
                          <span class="text-sm">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "About | Shedrack Godstime",
  meta: [
    {
      name: "description",
      content: "Cybersecurity researcher and systems programmer building secure distributed systems in Rust.",
    },
  ],
};
