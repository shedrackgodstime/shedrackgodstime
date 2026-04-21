import { component$ } from "@builder.io/qwik";

export const Footer = component$(() => {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/writeups", label: "Writeups" },
    { href: "/contact", label: "Contact" },
  ];

  const socialLinks = [
    { href: "https://github.com/shedrackgodstime", label: "GitHub" },
    { href: "https://x.com/krixtency", label: "Twitter" },
    { href: "mailto:shedrackgodstime@outlook.com", label: "Email" },
  ];

  return (
    <footer class="border-t border-ink/8 bg-canvas-subtle">
      <div class="mx-auto max-w-[1600px] px-6 py-10 sm:px-8 lg:px-12">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Monogram + tagline */}
          <div>
            <p class="font-mono text-sm font-bold tracking-tight text-ink">SHEDRACK</p>
            <p class="mt-0.5 font-mono text-xs text-gray-400">
              Building a safer digital world.
            </p>
          </div>

          {/* Center: Nav links */}
          <nav class="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                class="font-mono text-xs tracking-widest text-ink-subtle uppercase transition-colors hover:text-precision"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Social */}
          <div class="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                class="font-mono text-xs text-gray-400 transition-colors hover:text-precision"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div class="mt-8 border-t border-ink/5 pt-5">
          <p class="font-mono text-[0.65rem] text-gray-300">
            © {new Date().getFullYear()} Shedrack Godstime. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});
