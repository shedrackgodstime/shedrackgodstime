## Package Manager & Tooling

Always use **`bun`** (and **`bunx`**) instead of `npm`, `npx`, `yarn`, or `pnpm` for all tasks (installing packages, running scripts, builds, checks, and CLI commands).

- Run scripts: `bun run <script>` (e.g. `bun run dev`, `bun run build:offline`, `bun run check`)
- Run CLI binaries: `bunx <command>` (e.g. `bunx astro ...`)

## Development

When starting the dev server, use background mode:

```
OFFLINE=1 bunx astro dev --background
```

Manage the background server with `bunx astro dev stop`, `bunx astro dev status`, and `bunx astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
