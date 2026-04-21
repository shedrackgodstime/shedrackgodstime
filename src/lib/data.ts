// Shared data — single source of truth for all project and writeup content.
// When we migrate to Markdown/GitHub API, this file gets replaced by the fetcher.

export interface Project {
  slug: string;
  year: string;
  title: string;
  description: string;
  tags: string[];
  status: "Active" | "Completed";
  category: string;
  repo?: string;
  sections: {
    problem: string;
    architecture: string;
    security: string;
    reflection: string;
  };
}

export interface Writeup {
  slug: string;
  date: string;
  title: string;
  category: "Incident Analysis" | "Architecture" | "Research";
  readTime: string;
  excerpt: string;
  body: string;
}

export const projects: Project[] = [
  {
    slug: "nodechat",
    year: "2025",
    title: "NodeChat",
    description: "Fully decentralized, end-to-end encrypted P2P messaging app built in Rust.",
    tags: ["Rust", "iroh", "QUIC", "E2EE", "ECDH", "ChaCha20-Poly1305"],
    status: "Active",
    category: "P2P",
    repo: "https://github.com/shedrackgodstime/nodechat",
    sections: {
      problem: "Modern messaging apps rely on central servers that act as single points of failure and surveillance. When the server is down, you can't communicate. When the company changes its policies, your privacy is at risk. The goal was to build a messaging system where two peers communicate directly — no central server in the path of the message.",
      architecture: "NodeChat uses the iroh transport layer (built on QUIC) for direct peer-to-peer connections. Peers discover each other via a lightweight DHT relay when they're on separate networks. Once connected, all communication is encrypted at the session layer. The app ships as three Rust binaries: a peer manager, a server node, and a client.",
      security: "Key exchange uses ECDH (Elliptic Curve Diffie-Hellman) to establish a shared secret per session. All messages are then encrypted with ChaCha20-Poly1305, which provides authenticated encryption. Each session uses unique ephemeral keys, so compromise of one session does not expose past or future messages — perfect forward secrecy.",
      reflection: "I would have spent more time on the relay fallback path. Direct QUIC connections work well on the same network, but NAT traversal failures on hostile networks still cause silent drops instead of graceful fallback. That's the next thing to fix.",
    },
  },
  {
    slug: "irosh",
    year: "2025",
    title: "Irosh",
    description: "P2P SSH orchestration tool that eliminates the need for central relay servers.",
    tags: ["Rust", "SSH", "P2P", "iroh", "QUIC"],
    status: "Active",
    category: "Systems",
    repo: "https://github.com/shedrackgodstime/irosh",
    sections: {
      problem: "Managing SSH access across machines behind NAT typically requires a VPN, a jump server, or a relay service. All of these introduce a third party into what should be a direct connection between two machines you control.",
      architecture: "Irosh ships three binaries: irosh (manager), irosh-server, and irosh-client. The server binary runs on the target machine and registers its iroh NodeID. The client looks up a peer by alias and establishes a direct QUIC tunnel via iroh, then forwards the SSH session over that tunnel — no open ports, no relay, no VPN.",
      security: "The transport layer is secured by iroh's QUIC implementation, which includes TLS 1.3 by default. Peer identity is bound to the iroh NodeID — a public key fingerprint — meaning you can verify exactly which machine you're connecting to before the session begins.",
      reflection: "The current peer registry is stored locally on each machine. A future version should support a distributed peer registry synced via CRDTs so peer aliases stay consistent across multiple client machines without a central sync server.",
    },
  },
  {
    slug: "artmis",
    year: "2024",
    title: "ARTMIS",
    description: "Hybrid P2P mesh network using DHT-first node discovery on the mainline BitTorrent network.",
    tags: ["Rust", "DHT", "Gossip Protocol", "QUIC", "iroh"],
    status: "Completed",
    category: "P2P",
    repo: "https://github.com/shedrackgodstime/artmis",
    sections: {
      problem: "The original ARTMIS design had all nodes polling an HTTP server for peer discovery. As the network grew, this flooded the server with requests every few seconds. The server became both a bottleneck and a single point of failure — a central dependency in what was supposed to be a distributed system.",
      architecture: "The solution replaced the HTTP polling loop with DHT-first discovery using the mainline BitTorrent DHT. Nodes announce themselves with a derived InfoHash and discover peers by querying the DHT — zero central server required. Once peers discover each other, they handshake using a NodeID bridge scheme and join a gossip layer for real-time state propagation.",
      security: "All peer-to-peer communication uses QUIC via iroh. The NodeID handshake verifies peer identity before any gossip traffic is accepted, preventing spoofed nodes from injecting false state into the mesh.",
      reflection: "The DHT lookup latency on cold start is still higher than I'd like — around 2–4 seconds before the first peer is found. I would redesign the bootstrap sequence to cache previous peer lists locally so cold starts on known networks are instant.",
    },
  },
  {
    slug: "ogbon",
    year: "2024",
    title: "ỌGBỌN",
    description: "Forex trading intelligence system using local LLM inference for structured market reasoning.",
    tags: ["Python", "Ollama", "phi4-mini", "ML", "SHAP"],
    status: "Completed",
    category: "Research",
    repo: "https://github.com/shedrackgodstime/ogbon",
    sections: {
      problem: "Most retail trading tools either give you raw data you have to interpret yourself, or they give you black-box signals you have to trust blindly. The goal was a system that reasons about live market conditions and explains its reasoning using the same vocabulary a human analyst would use.",
      architecture: "A frozen XGBoost model processes technical indicators and produces SHAP feature importance values as a JSON payload. That JSON is passed to a phi4-mini model running locally via Ollama on a headless Debian server. The LLM uses the SHAP values as structured context to generate a natural-language analysis of the current market position.",
      security: "Running the inference locally means no API keys, no data leaving the machine, and no dependency on third-party model providers. The frozen ML model revision means the trading logic is locked and auditable — the LLM is only used for the explanation layer, not the decision layer.",
      reflection: "phi4-mini is fast but occasionally produces confident-sounding analyses that contradict the SHAP values. A future version should include a validation layer that cross-checks the LLM output against the structured data before surfacing it to the user.",
    },
  },
  {
    slug: "rexolution-vogue",
    year: "2024",
    title: "Rexolution Vogue",
    description: "Luxury streetwear e-commerce site built with QwikCity and Tailwind v4.",
    tags: ["QwikCity", "Tailwind", "TypeScript", "E-Commerce"],
    status: "Completed",
    category: "Web",
    repo: "https://github.com/shedrackgodstime/rexolution-vogue",
    sections: {
      problem: "The client needed a premium online storefront that felt as high-end as the physical products. Most off-the-shelf e-commerce templates look generic. The goal was a custom-built experience with fast load times and a distinct visual identity.",
      architecture: "Built on QwikCity for its partial hydration model — only the interactive components (cart, filters) ship JavaScript to the browser. The rest is pure HTML served from the edge via Cloudflare Pages. Tailwind v4 handles styling with a custom design token system.",
      security: "No customer data is stored on the site's own infrastructure — payment and checkout are delegated to a third-party provider with proper PCI compliance. The site itself only holds static content and session tokens scoped to the current browsing session.",
      reflection: "I underestimated how much time custom animation work takes. A future version would establish the motion design system in Figma first before touching code.",
    },
  },
  {
    slug: "syvex",
    year: "2023",
    title: "Syvex",
    description: "Fintech demo application with clean transaction UX, deployed on Vercel.",
    tags: ["QwikCity", "Vercel", "TypeScript", "Fintech"],
    status: "Completed",
    category: "Web",
    repo: "https://github.com/shedrackgodstime/syvex",
    sections: {
      problem: "Fintech UIs have a reputation for being either cluttered with data or oversimplified to the point of hiding important context. The goal was to find the right balance — showing users exactly what they need to make a decision without cognitive overload.",
      architecture: "QwikCity with SSR deployed to Vercel. Transaction data is served from mocked API endpoints at build time to demonstrate the UI patterns. The component architecture is designed so that swapping out the mock data layer for a real API requires changes only in the data-fetching layer.",
      security: "The demo app deliberately avoids storing any sensitive data. All transaction amounts are synthetic. The goal was to demonstrate UI patterns and UX flows, not production security hardening.",
      reflection: "Deploying on Vercel was straightforward, but I would have chosen Cloudflare Pages for a real production deployment to get the edge network benefits and Workers integration for backend logic.",
    },
  },
];

export const writeups: Writeup[] = [
  {
    slug: "payment-redirect-incident",
    date: "2026-04",
    title: "Payment Redirect Incident — A Compromised Checkout Page",
    category: "Incident Analysis",
    readTime: "8 min read",
    excerpt: "Breakdown of a compromised payment page that silently redirected to a fraudulent endpoint.",
    body: `A payment page on a small e-commerce site was silently redirecting customers to a fraudulent checkout endpoint. The original page looked identical — same styling, same form fields — but the form action had been changed to submit card data to an attacker-controlled server.

## How It Was Discovered

A customer noticed the URL in the browser address bar changed unexpectedly after clicking "Pay Now." The redirect happened so fast it was easy to miss, but the URL fragment was different from the store's actual domain.

## What the Attack Looked Like

The attacker had injected a small JavaScript snippet into the page that intercepted the form submit event, exfiltrated the card data to their server first, then redirected to the legitimate payment processor to avoid suspicion. The customer saw a successful payment confirmation. The attacker had a copy of the card data.

## Indicators

- The injected script was loaded from a CDN subdomain that looked legitimate at a glance but was attacker-controlled.
- The script was added to a third-party analytics tag that the store had installed months earlier. The analytics provider had been compromised.
- The redirect happened in under 200ms — fast enough to be invisible to most users.

## What Server Hardening Applies

A Content Security Policy (CSP) header with \`script-src 'self'\` would have blocked the injected external script entirely. Subresource Integrity (SRI) hashes on all third-party script tags would have caught the modification. Regular audits of third-party dependencies are non-negotiable for any page that handles payment data.`,
  },
  {
    slug: "artmis-architecture",
    date: "2025-11",
    title: "ARTMIS Architecture — From HTTP Polling to DHT Discovery",
    category: "Architecture",
    readTime: "12 min read",
    excerpt: "The full story of how ARTMIS moved from HTTP polling to DHT-first discovery on the mainline BitTorrent network.",
    body: `ARTMIS started with a simple discovery mechanism: every node polled an HTTP server every few seconds to register itself and get a list of active peers. It worked fine at small scale. At larger scale, it destroyed the server.

## The Original Problem

With 50 nodes polling every 5 seconds, the central server was receiving 600 requests per minute just for peer discovery — before any actual data traffic. The server CPU stayed above 80%. Any temporary server outage meant the entire network lost visibility. A system designed to be distributed had a central dependency that could bring it down.

## Why DHT

The mainline BitTorrent DHT is a globally distributed hash table with hundreds of millions of participating nodes. Any node can announce itself by publishing to an InfoHash derived from a known shared key. Any other node can find it by querying the DHT for that same InfoHash. No central server, no single point of failure.

## How the NodeID Handshake Bridge Works

Nodes don't connect directly via the DHT — they use it only for discovery. Once two nodes find each other's iroh NodeID through the DHT, they establish a direct QUIC connection using the iroh transport. The handshake exchanges a signed capability token that proves both sides have the correct shared key. Only after this handshake does the gossip layer begin.

## What the Gossip Layer Does

The gossip layer propagates network state — which nodes are alive, which have left, and what data each node holds. Each node maintains a partial view of the network (not a full list), and state changes propagate through epidemic broadcast. The convergence time depends on network size but is typically under 2 seconds for networks under 200 nodes.`,
  },
  {
    slug: "post-quantum-primer",
    date: "2025-08",
    title: "Post-Quantum Cryptography Primer",
    category: "Research",
    readTime: "10 min read",
    excerpt: "A plain technical overview of CRYSTALS-Kyber and CRYSTALS-Dilithium as near-term post-quantum baselines.",
    body: `Quantum computers capable of running Shor's algorithm at scale would break RSA, ECDH, and ECDSA — the cryptographic primitives that secure most internet traffic today. CRYSTALS-Kyber and CRYSTALS-Dilithium are the two NIST-standardized algorithms designed to replace them.

## CRYSTALS-Kyber (Key Encapsulation)

Kyber is a Key Encapsulation Mechanism (KEM) based on the hardness of the Module Learning With Errors (MLWE) problem. A classical computer — or quantum computer — cannot efficiently recover the secret from the public key or the ciphertext without solving MLWE, which has no known polynomial-time quantum algorithm.

In practice, Kyber replaces ECDH in key exchange. Instead of both parties computing a shared secret from their private keys, one party generates a random secret, encapsulates it with the recipient's public key, and sends the ciphertext. The recipient decapsulates with their private key to recover the secret. The shared secret is then used as a symmetric key.

## CRYSTALS-Dilithium (Digital Signatures)

Dilithium is a signature scheme built on the same MLWE hardness assumption. It replaces ECDSA for signing and verification. Key sizes and signature sizes are larger than ECDSA — a Dilithium3 signature is around 3.3KB compared to ~64 bytes for ECDSA — but verification is fast and the security assumption is well-studied.

## Why These Matter for Cybersecurity Practice

The threat is not just future quantum computers. "Harvest now, decrypt later" attacks are already happening — adversaries collect encrypted traffic today with the intent to decrypt it once quantum hardware is available. For any data that needs to remain confidential for 10+ years, the migration to post-quantum primitives should start now.

The practical starting point is hybrid key exchange: combining Kyber with X25519 so that a connection is secure against both classical and quantum attackers. This is already supported in TLS 1.3 experimental drafts and the Rust \`aws-lc-rs\` crate.`,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getWriteupBySlug(slug: string): Writeup | undefined {
  return writeups.find((w) => w.slug === slug);
}
