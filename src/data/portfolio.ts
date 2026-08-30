/**
 * Portfolio content data — focus areas, technical domains, credentials, etc.
 * Site identity and socials live in config.ts.
 */

export interface FocusItem {
  title: string;
  description: string;
}

export interface TechnicalArea {
  number: string;
  name: string;
  description: string;
}

export interface Credential {
  label: string;
  detail: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  field: string;
  details?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export const focusItems: FocusItem[] = [
  {
    title: "Security engineering",
    description: "Web security, network defense, offensive labs, and practical hardening.",
  },
  {
    title: "Rust systems tools",
    description: "Building small, focused tools where performance, reliability, and control matter.",
  },
  {
    title: "Networking and protocols",
    description: "Studying how systems communicate, traverse boundaries, and fail under constraints.",
  },
  {
    title: "Linux internals",
    description: "Exploring the operating system layer that supports security work and infrastructure.",
  },
  {
    title: "Hardware edge",
    description: "Researching LoRa, ESP32, drones, satellites, radio links, and embedded security.",
  },
];

export const technicalAreas: TechnicalArea[] = [
  {
    number: "01",
    name: "Security",
    description: "Web application security, network security, offensive labs, hardening, and threat-aware engineering.",
  },
  {
    number: "02",
    name: "Systems",
    description: "Rust, Linux, CLI tools, low-level software, operating system behavior, and practical reliability.",
  },
  {
    number: "03",
    name: "Networks",
    description: "Protocols, NAT traversal, packet analysis, distributed systems, remote access, and infrastructure.",
  },
  {
    number: "04",
    name: "Hardware Edge",
    description: "LoRa, ESP32, drones, satellites, radio systems, embedded concepts, and security implications.",
  },
];

export const credentials: Credential[] = [
  {
    label: "Experience",
    detail: "IT Trainee, Networking and Systems at Setraco Nigeria Limited.",
  },
  {
    label: "Education",
    detail: "HND Cybersecurity and ND Computer Science, Federal Polytechnic Auchi.",
  },
  {
    label: "Practice",
    detail: "Independent cybersecurity labs, open source work, systems tooling, and technical research.",
  },
];

export const experienceTimeline: ExperienceItem[] = [
  {
    role: "IT Trainee — Networking & Systems",
    organization: "Setraco Nigeria Limited",
    location: "Nigeria",
    period: "Professional Training",
    description:
      "Hands-on technical experience in enterprise networking, system administration, network troubleshooting, and security monitoring across corporate infrastructure.",
    highlights: [
      "Assisted with local network diagnostics, router/switch configuration, and IP address management.",
      "Supported workstation setup, Linux/Windows system troubleshooting, and user security permissions.",
      "Observed network traffic patterns and contributed to internal technical documentation.",
    ],
  },
  {
    role: "Independent Security & Systems Researcher",
    organization: "Open Source & Security Labs",
    location: "Remote / Nigeria",
    period: "Ongoing",
    description:
      "Developing systems programming tools in Rust, conducting protocol explorations, and documenting technical findings in the public Workbench.",
    highlights: [
      "Architected irosh (peer-to-peer encrypted remote management in Rust).",
      "Conducted offensive security lab exercises, vulnerability assessments, and web application audits.",
      "Researched hardware edge protocols (LoRa, ESP32, radio frequency communications).",
    ],
  },
];

export const educationTimeline: EducationItem[] = [
  {
    degree: "Higher National Diploma (HND)",
    field: "Cybersecurity",
    institution: "Federal Polytechnic Auchi",
    location: "Auchi, Edo State, Nigeria",
    period: "Higher Education",
    details:
      "Specialized study in network security, cryptography, defensive posture, digital forensics, and ethical hacking.",
  },
  {
    degree: "National Diploma (ND)",
    field: "Computer Science",
    institution: "Federal Polytechnic Auchi",
    location: "Auchi, Edo State, Nigeria",
    period: "Foundational Education",
    details:
      "Foundational computer science curriculum: data structures, algorithms, operating systems, networking fundamentals, and software development.",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Security & Hardening",
    skills: [
      "Web Security Audit",
      "Network Hardening",
      "Offensive Labs",
      "Vulnerability Analysis",
      "Threat Modeling",
      "Wireshark / Packet Analysis",
    ],
  },
  {
    category: "Systems & Programming",
    skills: [
      "Rust",
      "Linux Internals",
      "Bash / Shell Scripting",
      "Python",
      "TypeScript / Node.js",
      "Git Version Control",
    ],
  },
  {
    category: "Networking & Protocols",
    skills: [
      "TCP/IP",
      "NAT Traversal (STUN/TURN)",
      "SSH / P2P Protocols",
      "DNS & Routing",
      "Firewall Configuration",
      "Subnetting",
    ],
  },
  {
    category: "Hardware Edge & Embedded",
    skills: [
      "ESP32 Microcontrollers",
      "LoRa Radio Communication",
      "Embedded C/Rust Basics",
      "Telemetry",
      "Satellite & Drone Security Research",
    ],
  },
];
