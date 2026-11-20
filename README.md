<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/out/lockup-dark.svg">
    <img src="brand/out/lockup-light.svg" alt="Nebla" height="56">
  </picture>
</p>

# nebla-site

The source of [nebla.dev](https://nebla.dev), the website for Nebla, the open-source cloud console for Proxmox VE. The product itself lives in [nebla-cloud/nebla](https://github.com/nebla-cloud/nebla).

The site is static and built with Nuxt 4, Nuxt UI 4 and Nuxt Content. Long pages such as the install guide are markdown files in `content/`. The landing, features, homelab and resellers pages are Vue pages in `app/pages/`.

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

`tests/compose-snippet.test.mjs` compares the compose file on the install page with `deploy/compose.yaml` in the core repo. It expects a checkout at `../nebla` and skips without one.

## Brand

`brand/mark.json` defines the logo. `pnpm brand` regenerates every asset in `brand/out/` and the icons and Open Graph image in `public/`. `docs/design-plan.md` records the palette, type and layout rules.

## Deploy

`pnpm generate` produces plain static files in `.output/public`, which any static host can serve.

## Licence

The site's code and copy are licensed under [AGPL-3.0](LICENSE). The Nebla name and logo are not covered by that licence. Please don't use them for other projects or forks. The Onest typeface is licensed under the SIL Open Font License 1.1 through `@fontsource/onest`.
