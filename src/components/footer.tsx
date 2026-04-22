import { component$ } from "@builder.io/qwik";

export const Footer = component$(() => {
  const socialLinks = [
    { href: "https://github.com/shedrackgodstime", label: "GitHub" },
    { href: "https://x.com/krixtency", label: "Twitter" },
    { href: "mailto:shedrackgodstime@outlook.com", label: "Email" },
  ];

  return (
    <footer class="border-t border-ink/5 bg-white">
      <div class="mx-auto max-w-[1600px] px-6 py-12 sm:px-8 lg:px-12">
        <div class="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          {/* Left: Monogram + tagline */}
          <div>
            <div class="flex items-center gap-3">
              <div class="h-6 w-6 rounded-full bg-precision" />
              <p class="font-mono text-sm font-bold tracking-[0.2em] text-ink uppercase">
                Shedrack Godstime
              </p>
            </div>
            <p class="mt-4 max-w-xs font-mono text-[0.65rem] leading-relaxed tracking-wider text-ink/30 uppercase">
              Systems thinker building at the edge of networks, security, and decentralized software.
            </p>
          </div>

          {/* Right: Social & Info */}
          <div class="flex flex-col gap-8 sm:items-end">
            <div class="flex gap-8">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  class="group flex flex-col font-mono text-[0.65rem] tracking-[0.2em] text-ink/40 uppercase transition-colors hover:text-precision"
                >
                  <span class="text-[0.6rem] text-ink/20 transition-colors group-hover:text-precision/40">Connect</span>
                  {link.label}
                </a>
              ))}
            </div>
            
            <p class="font-mono text-[0.6rem] tracking-[0.1em] text-ink/20 uppercase">
              © {new Date().getFullYear()} — Nigeria / Global
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});
