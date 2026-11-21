<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/out/lockup-dark.svg">
    <img src="brand/out/lockup-light.svg" alt="Nebla" height="56">
  </picture>
</p>

# nebla-site

The source of [nebla.dev](https://nebla.dev), the website for Nebla, the open-source cloud console for Proxmox VE. The product itself lives in [nebla-cloud/nebla](https://github.com/nebla-cloud/nebla).

The site is static and built with Nuxt 4, Nuxt UI 4 and Nuxt Content. The landing, features, homelab, resellers and roadmap pages are Vue pages in `app/pages/`. Plain pages such as the privacy notice are markdown files in `content/`.

## Docs

The docs at `/docs` are markdown files in `content/docs/`, named `NN.slug.md`. The number sets the sidebar order and is dropped from the URL, and `00.index.md` is `/docs`. Each file's front matter has a `title`, a `description` and a `group` (`Get started`, `Use Nebla` or `Reference`). When you add, rename or reorder a page, update `DOCS` in `scripts/routes.mjs`; `tests/docs-routes.test.mjs` fails until the two match.

The docs describe the product on the core repo's `main`. Check facts against its code and `docs/` folder, and link to the repo for deep references.

## Roadmap

`/roadmap` renders `app/data/roadmap.json`, a copy of the public [roadmap board](https://github.com/orgs/nebla-cloud/projects/1). `.github/workflows/roadmap.yml` refreshes it once a day and commits any change, which redeploys the site. To refresh it by hand, run `node scripts/sync-roadmap.mjs`; it uses `GITHUB_TOKEN` or your `gh` login. The workflow reads the board with the `ROADMAP_TOKEN` repository secret, a fine-grained token on the nebla-cloud organization with read-only access to Projects. The job's own token can't read the board's items, so without the secret the workflow skips the sync with a warning.

## Develop

You need Node 24 and pnpm 10.

```sh
pnpm install
pnpm dev          # http://localhost:3000
```

## Checks

```sh
pnpm lint && pnpm typecheck
pnpm test             # guard scripts, brand build and the install page's compose file
pnpm generate         # static output in .output/public
pnpm check:brand      # copy and asset rules
pnpm check:site       # titles, descriptions, OG tags, canonicals, sitemap, no third-party requests
pnpm preview &        # serve .output/public on :3000
pnpm check:layout     # every page at 320–1440px, no clipping; add --dark for dark mode
```

`check:layout` drives your installed Google Chrome and writes screenshots to `shots/`.

`tests/compose-snippet.test.mjs` compares the compose file on the install page (`content/docs/01.install.md`) with `deploy/compose.yaml` in the core repo, including the pinned image tag. It expects a checkout at `../nebla` and skips without one.

## Brand

`brand/mark.json` defines the logo. `pnpm brand` regenerates every asset in `brand/out/` and the icons and Open Graph image in `public/`. `docs/design-plan.md` records the palette, type and layout rules.

## Deploy

`pnpm generate` produces plain static files in `.output/public`, which any static host can serve.

nebla.dev runs on Coolify from the `Dockerfile`: it builds the site, runs `check:site`, and serves the result with nginx (`deploy/nginx.conf`). nginx also answers the short links in `scripts/routes.mjs` (`/discord`) with a 302, and the moved pages there (`/install`) with a 301. `tests/nginx.test.mjs` fails if they drift apart.

## Panel screenshots

`public/screens/` holds real screenshots of the panel in light and dark, taken from the core repo's UI harness (`internal/uiharness`) on demo data, and `PanelShot` shows them in a window frame. Retake them whenever the panel's look changes.

## Licence

The site's code and copy are licensed under [AGPL-3.0](LICENSE). The Nebla name and logo are not covered by that licence. Please don't use them for other projects or forks. The Onest typeface is licensed under the SIL Open Font License 1.1 through `@fontsource/onest`.
