import { REDIRECTS } from '~~/scripts/routes.mjs'

export const site = {
  name: 'Nebla',
  url: 'https://nebla.dev',
  repo: 'https://github.com/nebla-cloud/nebla',
  image: 'ghcr.io/nebla-cloud/nebla',
  brew: 'brew install nebla-cloud/tap/nebla',
  // Permanent invite (never expires) to #welcome; nebla.dev/discord redirects to it.
  discord: REDIRECTS['/discord'],
  copyright: '© 2026 Hexeption and the Nebla contributors',
  nav: [
    { label: 'Features', to: '/features' },
    { label: 'Homelab', to: '/homelab' },
    { label: 'Resellers', to: '/resellers' },
    { label: 'Install', to: '/install' },
    { label: 'Docs', to: '/docs' }
  ]
} as const
