import { component$ } from "@builder.io/qwik";

interface PageHeaderProps {
  tag: string;
  title: string;
  description?: string;
}

export const PageHeader = component$<PageHeaderProps>(({ tag, title, description }) => {
  return (
    <div class="mb-12 sm:mb-16 lg:mb-20">
      <div class="mb-6 animate-fade-in-up">
        <span class="font-mono text-[0.875rem] tracking-[0.1em] text-precision uppercase">
          {tag}
        </span>
      </div>
      <h1
        class="mb-6 font-bold animate-fade-in-up delay-100"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: "1.1", letterSpacing: "-0.02em" }}
      >
        {title}
      </h1>
      <div class="mb-8 h-1 w-24 origin-left bg-precision animate-fade-in-up delay-200" />
      {description && (
        <p class="max-w-3xl text-base text-gray-500 animate-fade-in-up delay-300 sm:text-xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
});
