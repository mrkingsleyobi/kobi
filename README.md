# kingsleyobi.com

Kingsley Obi's personal site and blog — VitePress static site, Vue 3 +
TypeScript theme, TailwindCSS. Focused on agentic AI systems, cybersecurity,
and technology/philosophy writing.

**Live:** https://kingsleyobi.com

## Stack

- **Framework:** VitePress (Vue 3 + TypeScript)
- **Styling:** TailwindCSS
- **Package manager:** bun (never npm/yarn/pnpm)
- **Images:** Cloudflare Images, with local storage as fallback
- **Deploy:** Cloudflare Pages, via GitHub Actions on push to `main`

## Development

```bash
bun install
bun run dev      # vitepress dev cms — keep running during development
bun run build    # vitepress build cms + sitemap generation
```

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml` (build → Cloudflare
Pages). CI (`.github/workflows/ci.yml`) runs on every push and PR.

A successful Actions run is not proof the live page renders — see
`AGENTS.md` § Deployment Process for the required post-deploy verification
step.

## For AI agents working in this repo

Full guidance — directory structure, blog post workflow, image pipeline,
Cloudflare/wrangler troubleshooting, redesign component reference — lives in
[`AGENTS.md`](./AGENTS.md) (imported by `CLAUDE.md`). Read it before making
changes here.

## History

The site underwent a full redesign (Miessler-style theme) completed and
merged 2026-09-28. The PRD that drove it is archived at
`MEMORY/WORK/20260928-miessler-redesign/PRD.md`.
