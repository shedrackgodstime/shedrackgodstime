import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Footer } from "../components/footer";

export default component$(() => {
  const location = useLocation();
  const scrolled = useSignal(false);
  const mobileMenuOpen = useSignal(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/writeups", label: "Writeups" },
    { path: "/contact", label: "Contact" },
  ];

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const handleScroll = () => {
      scrolled.value = window.scrollY > 50;
    };
    window.addEventListener("scroll", handleScroll);

    // Prevent body scroll when mobile menu is open
    return () => window.removeEventListener("scroll", handleScroll);
  });

  // Lock body scroll when mobile menu open
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => mobileMenuOpen.value);
    document.body.style.overflow = mobileMenuOpen.value ? "hidden" : "";
  });

  const isActive = (path: string) =>
    location.url.pathname === path ||
    (path !== "/" && location.url.pathname.startsWith(path));

  return (
    <div class="min-h-screen bg-white font-sans text-ink">
      {/* ─── Navigation bar ─── */}
      <header
        class={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled.value
            ? "border-b border-ink/15 bg-white/98 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div class="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div class="flex h-16 items-center justify-between sm:h-20">

            {/* Logo */}
            <Link
              href="/"
              class="font-mono text-base font-bold tracking-tight transition-colors hover:text-precision sm:text-lg"
              onClick$={() => (mobileMenuOpen.value = false)}
            >
              SHEDRACK
            </Link>

            {/* Desktop nav */}
            <nav class="hidden items-center gap-8 lg:flex xl:gap-12">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  class={`group relative font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] transition-colors ${
                    isActive(item.path) ? "text-precision" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  {item.label}
                  <span
                    class={`absolute -bottom-1.5 left-0 h-[1.5px] bg-precision transition-all duration-300 group-hover:w-full ${
                      isActive(item.path) ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Mobile: right side — current page indicator + hamburger */}
            <div class="flex items-center gap-4 lg:hidden">
              {/* Current page label */}
              <span class="font-mono text-[0.6rem] tracking-[0.15em] text-gray-400 uppercase">
                {navItems.find((i) => isActive(i.path))?.label ?? ""}
              </span>

              {/* Hamburger button */}
              <button
                onClick$={() => (mobileMenuOpen.value = !mobileMenuOpen.value)}
                class="relative flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
                aria-label={mobileMenuOpen.value ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen.value}
              >
                <span
                  class="block h-[1.5px] w-5 bg-ink transition-all duration-300 origin-center"
                  style={{
                    transform: mobileMenuOpen.value
                      ? "translateY(6.5px) rotate(45deg)"
                      : "none",
                  }}
                />
                <span
                  class="block h-[1.5px] w-5 bg-ink transition-all duration-300"
                  style={{ opacity: mobileMenuOpen.value ? "0" : "1" }}
                />
                <span
                  class="block h-[1.5px] w-5 bg-ink transition-all duration-300 origin-center"
                  style={{
                    transform: mobileMenuOpen.value
                      ? "translateY(-6.5px) rotate(-45deg)"
                      : "none",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Mobile drawer (slides down below the header bar) ─── */}
        <div
          class={`absolute left-0 right-0 top-full overflow-hidden border-b transition-all duration-300 ease-in-out lg:hidden ${
            mobileMenuOpen.value
              ? "border-ink/10 bg-white opacity-100 shadow-xl"
              : "border-transparent bg-white opacity-0 pointer-events-none"
          }`}
          style={{
            maxHeight: mobileMenuOpen.value ? "420px" : "0px",
            transition:
              "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
          }}
        >
          <nav class="mx-auto max-w-[1600px] px-5 py-4 sm:px-8">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                href={item.path}
                onClick$={() => (mobileMenuOpen.value = false)}
                class={`flex items-center justify-between border-b py-4 transition-colors ${
                  index === navItems.length - 1 ? "border-transparent" : "border-ink/6"
                } ${
                  isActive(item.path)
                    ? "text-precision"
                    : "text-ink hover:text-precision"
                }`}
                style={{
                  transitionDelay: mobileMenuOpen.value ? `${index * 40}ms` : "0ms",
                }}
              >
                <span class="text-base font-semibold tracking-tight">{item.label}</span>
                <span
                  class={`font-mono text-[0.65rem] tracking-widest uppercase transition-colors ${
                    isActive(item.path) ? "text-precision" : "text-gray-400"
                  }`}
                >
                  {isActive(item.path) ? "CURRENT" : "→"}
                </span>
              </Link>
            ))}

            {/* Footer note in mobile menu */}
            <p class="pt-4 pb-2 font-mono text-[0.6rem] tracking-widest text-gray-300 uppercase">
              shedrackgodstime.com
            </p>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <div class="pt-16 sm:pt-20">
        <Slot />
        <Footer />
      </div>
    </div>
  );
});
