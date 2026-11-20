export const site = {
  name: 'Nebla',
  url: 'https://nebla.io',
  repo: 'https://github.com/nebla-cloud/nebla',
  image: 'ghcr.io/nebla-cloud/nebla',
  brew: 'brew install nebla-cloud/tap/nebla',
  copyright: '© 2026 Hexeption and the Nebla contributors',
  nav: [
    { label: 'Features', to: '/features' },
    { label: 'Homelab', to: '/homelab' },
    { label: 'Resellers', to: '/resellers' },
    { label: 'Install', to: '/install' },
    { label: 'Docs', to: '/docs' }
  ]
} as const
