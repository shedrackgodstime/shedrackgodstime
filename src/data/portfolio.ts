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
    description:
      "Cybersecurity research, security testing, network security, and understanding how systems fail.",
  },
  {
    number: "02",
    name: "Systems",
    description:
      "Rust, Linux, systems programming, CLI tools, and exploring software closer to the machine.",
  },
  {
    number: "03",
    name: "Networks",
    description:
      "Protocols, network analysis, distributed systems, remote access, and the infrastructure connecting them.",
  },
  {
    number: "04",
    name: "Hardware",
    description:
      "Embedded systems, electronics, radio communication, and the security problems that emerge at the edge.",
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

export interface TechnicalInterest {
  number: string;
  name: string;
  description: string;
}

export const technicalInterests: TechnicalInterest[] = [
  {
    number: "01",
    name: "Cybersecurity",
    description:
      "Security research, offensive security, vulnerability analysis, digital forensics, and network security.",
  },
  {
    number: "02",
    name: "Systems",
    description:
      "Rust, Linux, operating systems, systems programming, and low-level software.",
  },
  {
    number: "03",
    name: "Networks",
    description:
      "TCP/IP, protocols, network analysis, routing, DNS, and network infrastructure.",
  },
  {
    number: "04",
    name: "Hardware",
    description:
      "Embedded systems, microcontrollers, radio communication, electronics, and hardware security.",
  },
];

export const experienceTimeline: ExperienceItem[] = [
  {
    role: "IT Trainee — Networking & Systems",
    organization: "Setraco Nigeria Limited",
    location: "Nigeria",
    period: "Professional Training",
    description:
      "Worked on enterprise networking and IT infrastructure: network diagnostics, IP address management, router and switch configuration, and Windows/Linux system troubleshooting. Observed network operations and documented technical issues.",
    highlights: [
      "Assisted with local network diagnostics, router/switch configuration, and IP address management.",
      "Supported workstation setup, Linux/Windows system troubleshooting, and user security permissions.",
      "Observed network traffic patterns and contributed to internal technical documentation.",
    ],
  },
  {
    role: "Independent Technical Practice",
    organization: "Security · Systems · Networking · Open Source",
    location: "Remote / Nigeria",
    period: "Ongoing",
    description:
      "Independently building software and conducting security and systems investigations outside formal employment. Work includes Rust systems tooling, network and protocol exploration, security labs, and hardware research.",
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
      "Specialized study in network security, cryptography, defensive posture, digital forensics, ethical hacking, and cyber resilience.",
  },
  {
    degree: "National Diploma (ND)",
    field: "Computer Science",
    institution: "Federal Polytechnic Auchi",
    location: "Auchi, Edo State, Nigeria",
    period: "Foundational Education",
    details:
      "Foundational computer science curriculum: programming, algorithms, data structures, operating systems, databases, and networking fundamentals.",
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
