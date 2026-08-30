/**
 * Shiki transformer implementing the fence-meta vocabulary:
 *
 *   ```rust title="src/scanner.rs" ln {4,7-9}
 *   ```text wrap
 *
 * Emits data-title / data-ln / data-wrap / data-hl attributes on the
 * generated <pre>. rehype-codeblock-chrome builds the header bar from them
 * and applies `.hl` line classes post-render from data-hl (per-line
 * transformer mutations do not survive Astro's pipeline).
 *
 * Astro quirk this works around: @astrojs/internal-helpers forwards fence
 * meta as options.meta = { __raw } but never threads it into the
 * transformer context, so `this.meta` is always {} — while `this.options`
 * IS the full codeToHast options object and carries it just fine.
 *
 * Also strips shiki's inline light-theme paint (color/background-color)
 * from <pre> so site tokens own the chrome; spans keep their inline light
 * color + --shiki-dark pair, swapped by display.css under .dark.
 */
export function shikiFenceMeta() {
  return {
    name: 'fence-meta',
    preprocess(_input, options) {
      const meta = String(options?.meta?.__raw ?? '');
      // SECURITY: the title flows into an HTML attribute. Authors never need
      // markup characters in a label — strip them at parse time so no
      // serializer quirk can ever turn a fence into an injection sink.
      const title = /(?:^|\s)title="([^"]*)"/.exec(meta)?.[1]?.replace(
        /["<>&]/g,
        '',
      );
      const ln = /(?:^|\s)(?:ln|lines)(?:\s|$)/.test(meta);
      const wrap = /(?:^|\s)wrap(?:\s|$)/.test(meta);

      let hl;
      const ranges = /\{\s*([\d\s,\-]+?)\s*\}\s*$/.exec(meta)?.[1] ?? /\{\s*([\d\s,\-]+?)\s*\}/.exec(meta)?.[1];
      if (ranges) {
        const set = new Set();
        for (const part of ranges.split(',')) {
          const seg = part.trim();
          if (!seg) continue;
          const [a, b] = seg.split('-').map((n) => Number.parseInt(n, 10));
          if (Number.isNaN(a)) continue;
          // A bare number has b === undefined (not NaN): single line.
          if (b === undefined || Number.isNaN(b)) set.add(a);
          else for (let i = a; i <= b; i++) set.add(i);
        }
        if (set.size > 0) hl = [...set].sort((x, y) => x - y).join(',');
      }

      this._parsed = { title, ln, wrap, hl };
    },
    pre(node) {
      const { title, ln, wrap, hl } = this._parsed;
      const props = (node.properties ??= {});
      if (title) props.dataTitle = title;
      if (ln) props.dataLn = '';
      if (wrap) {
        props.dataWrap = '';
        (props.className ??= []).push('wrap');
      }
      if (hl) props.dataHl = hl;
      props.style = String(props.style ?? '')
        .replace(/(^|;)\s*(?:background-)?color\s*:[^;]*/g, '$1')
        .replace(/;;+/g, ';')
        .replace(/^;|;\s*$/g, '');
    },
  };
}
