/**
 * Diagram interaction — zoom, expand/collapse, keyboard, double-click.
 *
 * Operates on every <figure class="diagram" data-...> on the page. The
 * markup is produced at build time by the remark/rehype pipeline
 * (remark-mermaid-figure → rehype-mermaid → rehype-diagram-size), so
 * this module owns only the runtime behavior.
 *
 * Selectors / attributes expected from the markup:
 *   - figure.diagram                              each diagram
 *   - .diagram-controls, .diagram-zoom,
 *     .diagram-expand, .diagram-zoom-label        controls
 *   - .diagram-viewport > svg                     the SVG itself
 *   - svg[viewBox]                                with w/h to fit on expand
 *
 * State (per-figure zoom level) is held in a WeakMap, so re-rendering
 * the page never leaks memory.
 */

const ZOOM_STEP = 1.25;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;

const SELECTORS = {
  figure: "figure.diagram",
  zoomBtn: ".diagram-zoom",
  expandBtn: ".diagram-expand",
  zoomLabel: ".diagram-zoom-label",
  viewportSvg: ".diagram-viewport > svg",
  expandedClass: "diagram-expanded",
  lockClass: "diagram-lock",
} as const;

const zoomLevels = new WeakMap<Element, number>();

function fitZoom(svg: SVGSVGElement, zoom: number): number {
  const viewBox = (svg.getAttribute("viewBox") ?? "").split(/\s+/).map(Number);
  const vw = viewBox[2];
  const vh = viewBox[3];
  if (!vw || !vh) return zoom;
  const padX = 32;
  const padY = 80;
  const fit = Math.min(
    1,
    (window.innerWidth - padX) / vw,
    (window.innerHeight - padY) / vh,
  );
  svg.style.width = `${Math.round(vw * fit * zoom)}px`;
  svg.setAttribute("data-zoomed", "");
  return zoom;
}

function applyZoom(fig: Element, zoom: number): void {
  const svg = fig.querySelector<SVGSVGElement>(SELECTORS.viewportSvg);
  if (!svg) return;
  const effective = fitZoom(svg, zoom);
  const label = fig.querySelector(SELECTORS.zoomLabel);
  if (label) label.textContent = `${Math.round(effective * 100)}%`;
}

function clearZoom(fig: Element): void {
  const svg = fig.querySelector<SVGSVGElement>(SELECTORS.viewportSvg);
  if (!svg) return;
  svg.style.width = "";
  svg.removeAttribute("data-zoomed");
  zoomLevels.delete(fig);
}

function setExpanded(fig: Element, on: boolean): void {
  fig.classList.toggle(SELECTORS.expandedClass, on);
  const btn = fig.querySelector<HTMLElement>(SELECTORS.expandBtn);
  if (btn) {
    btn.setAttribute("aria-expanded", String(on));
    btn.setAttribute("aria-label", on ? "Collapse diagram" : "Expand diagram");
  }
  if (on) {
    fig.setAttribute("role", "dialog");
    fig.setAttribute("aria-modal", "true");
    btn?.focus();
  } else {
    fig.removeAttribute("role");
    fig.removeAttribute("aria-modal");
    clearZoom(fig);
    btn?.focus();
  }
  document.documentElement.classList.toggle(SELECTORS.lockClass, on);
}

export function initDiagrams(): void {
  const figures = document.querySelectorAll<HTMLElement>(SELECTORS.figure);
  if (figures.length === 0) return;

  // Click delegation: zoom in/out, expand, click-outside-when-expanded.
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const zoomBtn = target.closest<HTMLElement>(SELECTORS.zoomBtn);
    if (zoomBtn) {
      const fig = zoomBtn.closest<HTMLElement>(SELECTORS.figure);
      if (!fig) return;
      const current = zoomLevels.get(fig) ?? 1;
      const next = Math.min(
        ZOOM_MAX,
        Math.max(
          ZOOM_MIN,
          current * (zoomBtn.dataset.zoom === "in" ? ZOOM_STEP : 1 / ZOOM_STEP),
        ),
      );
      zoomLevels.set(fig, next);
      applyZoom(fig, next);
      return;
    }

    const expandBtn = target.closest<HTMLElement>(SELECTORS.expandBtn);
    if (expandBtn) {
      const fig = expandBtn.closest<HTMLElement>(SELECTORS.figure);
      if (fig) {
        const on = !fig.classList.contains(SELECTORS.expandedClass);
        setExpanded(fig, on);
        if (on) applyZoom(fig, 1);
      }
      return;
    }

    const open = target.closest<HTMLElement>(
      `figure.diagram.${SELECTORS.expandedClass}`,
    );
    if (open && !target.closest("svg") && !target.closest("details")) {
      setExpanded(open, false);
    }
  });

  // Escape closes any expanded diagram.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const open = document.querySelector<HTMLElement>(
      `figure.diagram.${SELECTORS.expandedClass}`,
    );
    if (open) setExpanded(open, false);
  });

  // Double-click on a diagram SVG toggles 100% ↔ 200%.
  document.addEventListener("dblclick", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const svg = target.closest<SVGSVGElement>(
      `figure.diagram.${SELECTORS.expandedClass} svg`,
    );
    if (!svg) return;
    const fig = svg.closest<HTMLElement>(SELECTORS.figure);
    if (!fig) return;
    const next = zoomLevels.get(fig) === 1 ? 2 : 1;
    zoomLevels.set(fig, next);
    if (next === 1) {
      svg.style.width = "";
      svg.removeAttribute("data-zoomed");
      const label = fig.querySelector(SELECTORS.zoomLabel);
      if (label) label.textContent = "100%";
    } else {
      applyZoom(fig, next);
    }
  });
}
