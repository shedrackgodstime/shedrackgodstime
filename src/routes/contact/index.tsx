import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageHeader } from "../../components/page-header";

export default component$(() => {
  const contactMethods = [
    {
      label: "Email",
      value: "shedrackgodstime@outlook.com",
      href: "mailto:shedrackgodstime@outlook.com",
      description: "Primary contact",
    },
    {
      label: "GitHub",
      value: "github.com/shedrackgodstime",
      href: "https://github.com/shedrackgodstime",
      description: "Source code & contributions",
    },
  ];

  return (
    <div class="relative min-h-screen py-12 sm:py-20 lg:py-24">
      {/* Subtle Grid Background */}
      <div class="absolute inset-0 pointer-events-none opacity-[0.03]">
        <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="contact-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-grid)" />
        </svg>
      </div>

      <div class="relative mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
        <PageHeader
          tag="CONTACT"
          title="Direct Line"
          description="Email or GitHub. Secure communications preferred."
        />

        <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div class="lg:col-span-6">
            {/* Minimal contact cards */}
            <div class="space-y-4 animate-fade-in-up delay-400">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  class="group relative flex items-center justify-between overflow-hidden bg-white px-7 py-6 transition-all hover:-translate-x-1 hover:shadow-lg hover:shadow-precision/10 border-ink/10 border"
                >
                  {/* Left accent stripe */}
                  <div class="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-precision transition-transform duration-300 group-hover:scale-y-100" />

                  <div>
                    <p class="mb-1 font-mono text-xs tracking-widest text-gray-400 uppercase">
                      {method.label}
                    </p>
                    <p class="font-mono text-base font-medium text-ink transition-colors group-hover:text-precision">
                      {method.value}
                    </p>
                    <p class="mt-1 text-xs text-gray-400">{method.description}</p>
                  </div>

                  <span class="translate-x-0 text-xl text-precision opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div class="lg:col-span-6">
            <div class="border border-ink/10 bg-white p-8 animate-fade-in-up delay-500">
              <p class="mb-3 font-mono text-[0.65rem] tracking-widest text-precision uppercase">
                Reserved Space
              </p>
              <h3 class="mb-4 text-2xl font-semibold tracking-tight text-ink">
                Nothing dramatic lives here.
              </h3>
              <p class="max-w-md text-sm leading-relaxed text-ink-subtle">
                No contact form, no chatbot, no mysterious encrypted ritual.
                Just email, GitHub, and a reasonable response when the message is clear.
              </p>
              <div class="mt-8 border-t border-ink/8 pt-4">
                <p class="font-mono text-[0.65rem] tracking-widest text-gray-400 uppercase">
                  Intentionally kept simple.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Contact | Shedrack Godstime",
  meta: [
    {
      name: "description",
      content: "Get in touch with Shedrack Godstime via email or GitHub.",
    },
  ],
};
