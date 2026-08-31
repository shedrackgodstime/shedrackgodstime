/**
 * Site configuration — single source of truth.
 * Edit here, not across the codebase.
 */

export const SITE = {
  name: "Shedrack Godstime",
  handle: "kristency",
  url: "https://shedrackgodstime.pages.dev",
  title: "Shedrack Godstime — Cybersecurity, Systems & Networked Software",
  tagline: "Cybersecurity, systems, and networked software.",
  headerTagline: "Cybersecurity / Systems / Networks",
  footerTagline: "Cybersecurity, systems, and networked software.",
  jobTitle: "Security Practitioner & Systems Builder",
  description:
    "Shedrack Godstime is a cybersecurity practitioner and systems builder focused on understanding how systems work, how they fail, and how to secure them. Work spans security research, systems programming in Rust, Linux, and networking.",
  shortDescription:
    "Shedrack Godstime is a cybersecurity practitioner and systems builder exploring security, systems, networking, and the technology beneath them.",
  currentMode: "Active technical practice",
  location: "Abuja, Nigeria",
  locationTag: "ABUJA, NIGERIA · GLOBAL",
  timezone: "Nigeria (WAT)",
  email: "shedrackgodstime@outlook.com",
  ogImage: "/og-image.png",
  profileImage: "/profile-picture.webp",
  themeColor: "#2563eb",
  keywords:
    "Shedrack Godstime, kristency, cybersecurity, security research, systems programming, Rust, networking, Linux, network security, software security",
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
