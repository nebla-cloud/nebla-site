import { REDIRECTS } from '~~/scripts/routes.mjs'

export const site = {
  name: 'Nebla',
  url: 'https://nebla.dev',
  repo: 'https://github.com/nebla-cloud/nebla',
  roadmap: 'https://github.com/orgs/nebla-cloud/projects/1',
  image: 'ghcr.io/nebla-cloud/nebla',
  brew: 'brew install nebla-cloud/tap/nebla',
  // Permanent invite (never expires) to #welcome; nebla.dev/discord redirects to it.
  discord: REDIRECTS['/discord'],
  copyright: '© 2026 Hexeption and the Nebla contributors',
  nav: [
    { label: 'Features', to: '/features' },
    { label: 'Homelab', to: '/homelab' },
    { label: 'Resellers', to: '/resellers' },
    { label: 'Docs', to: '/docs' },
    { label: 'Roadmap', to: '/roadmap' }
  ],
  community: [
    { label: 'Discord', to: 'https://nebla.dev/discord', icon: 'i-simple-icons-discord' },
    { label: 'X', to: 'https://x.com/neblahq', icon: 'i-simple-icons-x' },
    { label: 'Bluesky', to: 'https://bsky.app/profile/nebla.dev', icon: 'i-simple-icons-bluesky' }
  ]
} as const
