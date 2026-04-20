# 👋 Hi, I'm Shedrack Godstime (Kristency)

🔐 **Security-Focused Developer | Cybersecurity Enthusiast**  
I build secure applications and tools with **Rust, Python, and JavaScript/TypeScript**.  
Passionate about **network security, penetration testing, and secure coding practices**.  

---

## 🛠️ Skills
- **Cybersecurity:** Penetration Testing, Vulnerability Assessment, Network Security  
- **Development:** Rust, Python, Node.js, React, Next.js  
- **Tools:** Nmap, Wireshark, Linux CLI  

---

## 🌐 Connect with Me
<p align="left">
  <a href="https://github.com/shedrackgodstime"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/></a>
  <a href="https://www.linkedin.com/in/shedrackgodstime"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a>
  <a href="https://x.com/krixtency"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"/></a>
  <a href="https://www.instagram.com/krixtency"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white"/></a>
  <a href="https://wa.me/2348052952123"><img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white"/></a>
  <a href="mailto:shedrackgodstime@outlook.com"><img src="https://img.shields.io/badge/Email-0078D4?style=for-the-badge&logo=microsoft-outlook&logoColor=white"/></a>
</p>

---
⭐️ *Building a safer digital world through code and security.*

## Cloudflare Pages

Cloudflare's [wrangler](https://github.com/cloudflare/wrangler) CLI can be used to preview a production build locally. To start a local server, run:

```
bun serve
```

Then visit [http://localhost:8787/](http://localhost:8787/)

### Deployments

[Cloudflare Pages](https://pages.cloudflare.com/) are deployable through their [Git provider integrations](https://developers.cloudflare.com/pages/platform/git-integration/).

If you don't already have an account, then [create a Cloudflare account here](https://dash.cloudflare.com/sign-up/pages). Next go to your dashboard and follow the [Cloudflare Pages deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

Within the projects "Settings" for "Build and deployments", the "Build command" should be `bun build`, and the "Build output directory" should be set to `dist`.

### Function Invocation Routes

Cloudflare Page's [function-invocation-routes config](https://developers.cloudflare.com/pages/platform/functions/routing/#functions-invocation-routes) can be used to include, or exclude, certain paths to be used by the worker functions. Having a `_routes.json` file gives developers more granular control over when your Function is invoked.
This is useful to determine if a page response should be Server-Side Rendered (SSR) or if the response should use a static-site generated (SSG) `index.html` file.

By default, the Cloudflare pages adaptor _does not_ include a `public/_routes.json` config, but rather it is auto-generated from the build by the Cloudflare adaptor. An example of an auto-generate `dist/_routes.json` would be:

```
{
  "include": [
    "/*"
  ],
  "exclude": [
    "/_headers",
    "/_redirects",
    "/build/*",
    "/favicon.ico",
    "/manifest.json",
    "/service-worker.js",
    "/about"
  ],
  "version": 1
}
```

In the above example, it's saying _all_ pages should be SSR'd. However, the root static files such as `/favicon.ico` and any static assets in `/build/*` should be excluded from the Functions, and instead treated as a static file.

In most cases the generated `dist/_routes.json` file is ideal. However, if you need more granular control over each path, you can instead provide you're own `public/_routes.json` file. When the project provides its own `public/_routes.json` file, then the Cloudflare adaptor will not auto-generate the routes config and instead use the committed one within the `public` directory.
