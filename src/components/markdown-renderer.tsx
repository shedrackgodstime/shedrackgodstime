import { component$, useVisibleTask$ } from "@builder.io/qwik";
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
import rust from "highlight.js/lib/languages/rust";

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
hljs.registerLanguage("rust", rust);

marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      const language = lang || "";
      let highlighted = text;

      if (language && hljs.getLanguage(language)) {
        try {
          highlighted = hljs.highlight(text, { language }).value;
        } catch {
          // fallback to plain text
        }
      }

      return `<pre class="code-block"><button class="copy-button" aria-label="Copy code"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button><code class="hljs language-${language}">${highlighted}</code></pre>`;
    },
  },
});

interface MarkdownRendererProps {
  content: string;
}

const COPY_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

export const MarkdownRenderer = component$<MarkdownRendererProps>(
  ({ content }) => {
    const html = marked.parse(content, {
      gfm: true,
      breaks: false,
    }) as string;

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      const copyButtons = document.querySelectorAll(".copy-button");
      copyButtons.forEach((btn) => {
        btn.addEventListener("click", async () => {
          const pre = btn.closest("pre");
          const code = pre?.querySelector("code");
          const text = code?.textContent || "";

          try {
            await navigator.clipboard.writeText(text);
            btn.classList.add("copied");
            const svg = btn.querySelector("svg");
            if (svg) svg.outerHTML = CHECK_ICON;
            setTimeout(() => {
              btn.classList.remove("copied");
              const svg = btn.querySelector("svg");
              if (svg) svg.outerHTML = COPY_ICON;
            }, 2000);
          } catch {
            console.error("Failed to copy");
          }
        });
      });
    });

    return <div class="markdown-content" dangerouslySetInnerHTML={html} />;
  },
);
