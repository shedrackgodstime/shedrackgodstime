/**
 * remark plugin: wrap ```mermaid fences in a zero-JS figure while keeping
 * the fence itself a REAL code node, because rehype-mermaid only matches
 * `pre > code.language-mermaid` *elements* (raw HTML is not yet parsed at
 * this stage of the pipeline).
 *
 *   <figure class="diagram">
 *     <pre><code class="language-mermaid">…</code></pre>  ← build-time SVG
 *     <details><summary>Diagram source</summary>
 *       <pre><code>…</code></pre>                          ← native reveal, no JS
 *     </details>
 *   </figure>
 */

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** @type {import('unified').Plugin} */
export default function remarkMermaidFigure() {
  return (tree) => {
    const out = [];
    for (const node of tree.children) {
      if (node.type !== 'code' || node.lang !== 'mermaid') {
        out.push(node);
        continue;
      }
      const escaped = escapeHtml(node.value);
      out.push({ type: 'html', value: '<figure class="diagram">' });
      out.push({
        type: 'html',
        value: [
          '<span class="diagram-controls">',
          '<button class="diagram-zoom" type="button" data-zoom="out" aria-label="Zoom out">−</button>',
          '<span class="diagram-zoom-label" aria-live="polite">100%</span>',
          '<button class="diagram-zoom" type="button" data-zoom="in" aria-label="Zoom in">+</button>',
          '<button class="diagram-expand" type="button" aria-label="Expand diagram" aria-expanded="false">',
          '<svg class="icon-expand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5"/></svg>',
          '<svg class="icon-collapse" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg>',
          '</button>',
          '</span>',
        ].join(''),
      });
      // Viewport: the ONLY scrollable region when expanded — the overlay
      // frame itself stays static so the pinned controls never move.
      out.push({ type: 'html', value: '<div class="diagram-viewport">' });
      out.push(node); // consumed by rehype-mermaid → inline SVG
      out.push({
        type: 'html',
        value: [
          `<details class="diagram-source"><summary>Diagram source</summary>`,
          `<pre><code>${escaped}</code></pre>`,
          `</details>`,
          `</div>`,
          `</figure>`,
        ].join('\n'),
      });
    }
    tree.children = out;
  };
}
