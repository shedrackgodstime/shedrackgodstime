/**
 * Runs after rehype-mermaid. Reads each SVG's viewBox width and emits it as
 * the --natural-w custom property on the element, enabling the scroll-first
 * responsive policy in display.css: diagrams render at their natural size,
 * centering inside narrow containers and panning horizontally when wider —
 * never shrinking labels below legibility.
 */
export default function rehypeDiagramSize() {
  return (tree) => {
    const visit = (node) => {
      if (node?.type !== 'element' && node?.type !== 'root') return;
      for (const child of node.children ?? []) visit(child);
      if (node.type !== 'element' || node.tagName !== 'svg') return;

      const vb = String(node.properties?.viewBox ?? '')
        .trim()
        .split(/\s+/)
        .map(Number);
      const w = vb[2];
      if (!Number.isFinite(w) || w <= 0) return;

      const style = String(node.properties.style ?? '').trim();
      const sep = style && !style.endsWith(';') ? ';' : '';
      node.properties.style = `${style}${sep}--natural-w:${Math.ceil(w)}px`;
    };
    visit(tree);
  };
}
