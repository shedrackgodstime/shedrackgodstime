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
    <div class="min-h-screen py-12 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
        <PageHeader
          tag="CONTACT"
          title="Direct Line"
          description="Email or GitHub. That's it."
        />

        {/* Minimal contact cards */}
        <div class="max-w-xl space-y-4 animate-fade-in-up delay-400">
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
