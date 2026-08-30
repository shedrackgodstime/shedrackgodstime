/**
 * Theme toggle — post-hydration handler and localStorage helpers.
 *
 * The NO-FLASH BOOTSTRAP (toggling `.dark` on <html> before paint to avoid
 * a wrong-theme flash) MUST stay inline in the layout's <head>, because
 * it must run before module imports resolve. See Layout.astro.
 *
 * This module owns the TOGGLE HANDLER (the click behavior of the toggle
 * button) and the storage accessors used by both the bootstrap and the
 * handler. One source of truth for the localStorage key + values.
 */

const STORAGE_KEY = "theme";

export type Theme = "dark" | "light";

/** Read the stored theme. Returns null when the user has not chosen yet. */
export function getStoredTheme(): Theme | null {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "dark" || v === "light" ? v : null;
}

/** Persist a theme choice. */
export function setStoredTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Wire up every `.theme-toggle` element on the page.
 * Idempotent — safe to call from multiple <script> islands.
 */
export function initThemeToggle(): void {
  document.querySelectorAll<HTMLElement>(".theme-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      setStoredTheme(isDark ? "dark" : "light");
    });
  });
}
