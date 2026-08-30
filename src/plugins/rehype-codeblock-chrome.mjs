/**
 * Runs after highlighting (last rehype step). Wraps every shiki-produced
 * <pre data-language> into a zero-dependency figure with a header bar:
 *
 *   <figure class="codeblock" >
 *     <figcaption class="codeblock-bar">
 *       <span class="codeblock-lang">rust</span>
 *       <span class="codeblock-title">src/main.rs</span>   ← only when set
 *       <button class="copy-btn" type="button">copy</button>
 *     </figcaption>
 *     <pre data-language="rust" data-hl="4,7,8,9">…</pre>
 *   </figure>
 *
 * Applies line highlighting from the <pre>'s data-hl (emitted by
 * shiki-fence-meta): shiki emits one span per line carrying a raw `class`
 * STRING property ("line") — note shiki builds hast with `class`, not
 * hast's canonical `className`.
 *
 * The copy button is inert without JS; the layout wires one delegated
 * clipboard listener for every block on the page. Mermaid output and the
 * diagram-source reveals carry no data-language and are left untouched.
 */
const classesOf = (props) => {
  const raw = props.class ?? props.className;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') return raw.split(/\s+/).filter(Boolean);
  return [];
};

export default function rehypeCodeblockChrome() {
  return (tree) => {
    const visit = (node) => {
      if (node?.type !== 'element' && node?.type !== 'root') return;
      const children = node.children ?? [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        visit(child);

        if (
          child?.type !== 'element' ||
          child.tagName !== 'pre' ||
          !child.properties?.dataLanguage
        ) {
          continue;
        }

        applyLineHighlights(child);
        stripShikiInlinePaint(child);

        // Lang label guard: a langless fence with meta makes Shiki treat the
        // first meta token as the "language" (e.g. title="plain) — anything
        // that isn't a sane language token renders as "text".
        const rawLang = String(child.properties.dataLanguage);
        const lang = /^[a-z0-9+#_.-]+$/i.test(rawLang) ? rawLang : 'text';
        const title =
          child.properties['data-title'] ?? child.properties.dataTitle;

        const barChildren = [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['codeblock-lang'] },
            children: [{ type: 'text', value: lang }],
          },
        ];
        if (title) {
          barChildren.push({
            type: 'element',
            tagName: 'span',
            properties: { className: ['codeblock-title'] },
            children: [{ type: 'text', value: String(title) }],
          });
        }
        barChildren.push({
          type: 'element',
          tagName: 'button',
          properties: {
            className: ['copy-btn'],
            type: 'button',
            ariaLabel: 'Copy code',
          },
          children: [{ type: 'text', value: 'copy' }],
        });

        children[i] = {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['codeblock'] },
          children: [
            {
              type: 'element',
              tagName: 'figcaption',
              properties: { className: ['codeblock-bar'] },
              children: barChildren,
            },
            child,
          ],
        };
      }
    };
    visit(tree);
  };
}

function stripShikiInlinePaint(pre) {
  // Shiki inlines the light theme's color/background-color on <pre>; strip
  // them so site tokens own the chrome. The --shiki-dark custom properties
  // are kept — display.css swaps them in under .dark.
  const style = String(pre.properties.style ?? '');
  pre.properties.style = style
    .replace(/(^|;)\s*(?:background-)?color\s*:[^;]*/g, '$1')
    .replace(/;;+/g, ';')
    .replace(/^;|;\s*$/g, '');
}

function applyLineHighlights(pre) {
  const raw = pre.properties['data-hl'] ?? pre.properties.dataHl;
  if (!raw) return;

  const targets = new Set(
    String(raw)
      .split(',')
      .map((n) => Number.parseInt(n, 10))
      .filter((n) => Number.isInteger(n) && n > 0),
  );
  if (targets.size === 0) return;

  const code = pre.children.find(
    (c) => c.type === 'element' && c.tagName === 'code',
  );
  if (!code) return;

  let n = 0;
  for (const lineNode of code.children ?? []) {
    if (lineNode.type !== 'element') continue;
    const classes = classesOf(lineNode.properties ?? {});
    if (!classes.includes('line')) continue;

    n += 1;
    if (targets.has(n)) {
      lineNode.properties.class = [...new Set([...classes, 'hl'])].join(' ');
    }
  }
}
