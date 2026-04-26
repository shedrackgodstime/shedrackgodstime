import { component$ } from "@builder.io/qwik";
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
        } catch (e) {
          console.warn("Highlight failed:", e);
        }
      }

      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    },
  },
});

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = component$<MarkdownRendererProps>(
  ({ content }) => {
    const html = marked.parse(content, {
      gfm: true,
      breaks: false,
    }) as string;

    return <div class="markdown-content" dangerouslySetInnerHTML={html} />;
  },
);
