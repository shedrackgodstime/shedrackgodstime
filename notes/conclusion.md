# Project Blueprint: The Technical Precision Portfolio
**Owner:** Shedrack Godstime (Kristency)
**Objective:** Establish a professional, technical presence that emphasizes cybersecurity expertise through a minimalist, data-driven architecture.

---

## 1. The Visual Identity: "Digital Blueprint"
This site will move away from the "Bento-box/Glassmorphism" trend and move toward **Technical Precision**.

*   **Theme:** High-contrast Light Mode by default, with a "Dim/Midnight" toggle.
*   **Color Palette:**
    *   **Background:** `#FEFEFE` (Pristine White) or `#0F172A` (Slate Dark).
    *   **Primary Text:** `#111827` (Deep Gray/Black).
    *   **Accent:** `#2563EB` (Precision Blue) — used sparingly for status indicators and active states.
*   **Typography:**
    *   **Headings:** *Inter* (Semi-bold) for a clean, professional look.
    *   **Labels/Metadata:** *JetBrains Mono* for that "source code" technical feel.
*   **UI Elements:** 1px solid borders, 0px border-radius (sharp corners), and plenty of white space. No heavy shadows.

---

## 2. Page Architectures

### Home (`/`) - The Gateway
*   **Hero Section:** A massive, typography-first greeting. Not just "Hi", but a statement of intent.
*   **Visual:** An abstract, high-quality representation of a network or a signal—something that says "Systems & Security" without being a cliché padlock icon.
*   **Strategic Split:** The page will have a dedicated `home.md`. We will extract your GitHub README's "Technical Snapshot" but present it in a two-column web layout (Text on left, high-quality visual on right).

### About (`/about`) - The Snapshot
*   **Layout:** Single-column, max-width prose.
*   **Focus:** A technical narrative. What you build, why you build it, and your background at Auchi Poly.
*   **No Fluff:** No "90% Skills" bars. Just raw text and tech stacks.

### Projects (`/projects`) - The Lab
*   **Format:** A clean list of cards. Each card shows: `[Year] | Title`.
*   **Interaction:** Clicking expands into the full `project.md` content.
*   **Tags:** Discrete, monospaced tags at the bottom of each card.

### Writeups (`/writeups`) - The Intelligence
*   **Format:** Minimalist text-list. Title and Date only.
*   **Reading Experience:** Optimized for long-form technical reading. High readability typography, code syntax highlighting using a custom theme (likely something like *Tokyo Night* or *One Dark*).

### Contact (`/contact`) - The Direct Line
*   **Layout:** Ultra-minimal. Centered email and GitHub link. No form—just direct transparency.

---

## 3. Data Strategy: "Markdown First"
*   **Source of Truth:** All content lives in `.md` files.
*   **Format:** Strict YAML frontmatter for metadata (Title, Date, Image, Tags).
*   **Scaling:** We start with local mock files to perfect the CSS, then transition to GitHub API fetching once the UI is "pixel-perfect."

---

## 4. Technical Stack Performance
*   **Framework:** Qwik City (for near-zero JavaScript overhead).
*   **Styling:** Tailwind CSS v4 (variable-driven for easy global theme changes).
*   **Hosting:** Cloudflare Pages (for global edge-network performance).

---

## Conclusion
This portfolio is not a resume—it is a **Technical Journal**. It should feel like a piece of high-end documentation or a terminal for a sophisticated security system. By stripping away the "hacker-green" and the generic shadows, we create a site that commands respect through clarity and precision.
