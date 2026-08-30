/**
 * Site configuration — single source of truth.
 * Edit here, not across the codebase.
 */

export const SITE = {
  name: "Shedrack Godstime",
  url: "https://shedrackgodstime.pages.dev",
  tagline:
    "A security practitioner learning through research and hands-on building.",
  headerTagline: "Cybersecurity / Systems / Networks",
  footerTagline: "Cybersecurity, systems, and networked software.",
  description:
    "Cybersecurity-focused technical builder working across systems, networking, and security research.",
  email: "shedrackgodstime@outlook.com",
  ogImage: "/og-image.png",
  profileImage: "/profile-photo.jpg",
  themeColor: "#2563eb",
  keywords:
    "Shedrack Godstime, cybersecurity, systems programmer, Rust, P2P networking, security research",
};

export const SEO = {
  googleSiteVerificationId: "MCYahlX8zWyoTSNc5W0MX8RO_0NqfU3AACy5FVP27Q0",
  bingSiteVerificationId: "13758D37B114666762C912F7D1F4B2DD",
};

export interface SocialLink {
  label: string;
  href: string;
  username: string;
}

export const SOCIALS: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/shedrackgodstime",
    username: "@shedrackgodstime",
  },
  {
    label: "X",
    href: "https://x.com/kristency_",
    username: "@kristency_",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shedrackgodstime",
    username: "in/shedrackgodstime",
  },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/placeholder",
    username: "@placeholder",
  },
  {
    label: "Mastodon",
    href: "https://mastodon.social/@placeholder",
    username: "@placeholder",
  },
  {
    label: "Email",
    href: "mailto:shedrackgodstime@outlook.com",
    username: "shedrackgodstime@outlook.com",
  },
];

export interface NavItem {
  path: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/workbench", label: "Workbench" },
  { path: "/contact", label: "Contact" },
];

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export const GALLERY: GalleryImage[] = [
  {
    src: "/profile-picture.webp",
    alt: "Shedrack Godstime — portrait photo",
    caption: "Portrait",
  },
];

/** GitHub workbench repository. */
export const REPO = "shedrackgodstime/workbench";

/** Branch to fetch content from. */
export const DEFAULT_BRANCH = "main";
