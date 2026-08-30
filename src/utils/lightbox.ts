/**
 * Photo gallery lightbox — open/close, prev/next, keyboard, swipe, backdrop.
 *
 * The lightbox markup is owned by the PhotoGallery component
 * (selectors below are its contract). This module owns the behavior.
 *
 * Selectors expected from the markup:
 *   - [data-gallery-open="<index>"]  thumb buttons
 *   - #photo-lightbox                overlay container
 *   - #lb-image, #lb-caption,
 *     #lb-counter, #lb-close,
 *     #lb-prev, #lb-next,
 *     #lb-image-wrap                 lightbox internals
 *
 * If a marker element is missing, initLightbox() is a no-op (safe to call
 * on pages that don't include a gallery).
 */

interface GalleryImg {
  src: string;
  alt: string;
  caption?: string;
}

const THUMB_SELECTOR = "[data-gallery-open]";
const LIGHTBOX_ID = "photo-lightbox";

export function initLightbox(): void {
  const lightbox = document.getElementById(LIGHTBOX_ID);
  if (!lightbox) return;

  const thumbs = document.querySelectorAll<HTMLElement>(THUMB_SELECTOR);
  const lbImage = document.getElementById("lb-image") as HTMLImageElement | null;
  const lbCaption = document.getElementById("lb-caption");
  const lbCounter = document.getElementById("lb-counter");
  const lbClose = document.getElementById("lb-close");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");
  const imageWrap = document.getElementById("lb-image-wrap");

  if (!lbImage || !lbCaption || !lbCounter || !imageWrap) return;

  const allImages: GalleryImg[] = Array.from(thumbs).map((btn) => {
    const img = btn.querySelector("img");
    return {
      src: img?.src ?? "",
      alt: img?.alt ?? "",
      caption: btn.querySelector("span")?.textContent?.trim() || undefined,
    };
  });

  if (allImages.length === 0) return;

  let current = 0;

  const show = (i: number): void => {
    current = (i + allImages.length) % allImages.length;
    const img = allImages[current];
    lbImage.src = img.src;
    lbImage.alt = img.alt;
    lbCaption.textContent = img.caption ?? "";
    lbCounter.textContent = `${current + 1} / ${allImages.length}`;
  };

  const open = (i: number): void => {
    show(i);
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
    document.body.style.overflow = "hidden";
  };

  const close = (): void => {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    document.body.style.overflow = "";
  };

  thumbs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const raw = btn.getAttribute("data-gallery-open");
      const i = raw ? Number(raw) : 0;
      open(Number.isFinite(i) ? i : 0);
    });
  });

  lbClose?.addEventListener("click", close);
  lbPrev?.addEventListener("click", () => show(current - 1));
  lbNext?.addEventListener("click", () => show(current + 1));

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // Touch / swipe navigation
  let touchStartX = 0;
  let touchDeltaX = 0;

  imageWrap.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    },
    { passive: true },
  );
  imageWrap.addEventListener(
    "touchmove",
    (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    },
    { passive: true },
  );
  imageWrap.addEventListener("touchend", () => {
    if (Math.abs(touchDeltaX) > 50) {
      if (touchDeltaX > 0) show(current - 1);
      else show(current + 1);
    }
    touchDeltaX = 0;
  });

  // Click backdrop to close
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
}
