import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import yaml from "highlight.js/lib/languages/yaml";
import css from "highlight.js/lib/languages/css";
import sql from "highlight.js/lib/languages/sql";
import go from "highlight.js/lib/languages/go";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("shell", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("yml", yaml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("go", go);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("xml", xml);

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = component$<MarkdownRendererProps>(
  ({ content }) => {
    const containerRef = useSignal<HTMLDivElement>();

    const html = marked.parse(content, {
      gfm: true,
      breaks: false,
    }) as string;

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      if (containerRef.value) {
        containerRef.value.querySelectorAll("pre code").forEach((block) => {
          hljs.highlightElement(block as HTMLElement);
        });
      }
    });

    return (
      <div
        ref={containerRef}
        class="prose prose-slate prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-ink prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-ink-subtle prose-p:leading-relaxed prose-a:text-precision prose-a:no-underline hover:prose-a:underline prose-code:text-precision prose-code:bg-canvas-subtle prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-pre:bg-[#0d1117] prose-pre:rounded-lg prose-pre:overflow-x-auto prose-blockquote:border-l-4 prose-blockquote:border-precision prose-blockquote:bg-canvas-subtle prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-1 prose-li:text-ink-subtle prose-table:w-full prose-thead:bg-canvas-subtle prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:border-ink/10 prose-img:rounded-lg prose-img:shadow-md prose-hr:border-ink/10 max-w-none"
        dangerouslySetInnerHTML={html}
      />
    );
  },
);
