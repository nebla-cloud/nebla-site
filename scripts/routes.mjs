// Docs pages, in sidebar order. tests/docs-routes.test.mjs keeps this in step with content/docs/.
export const DOCS = [
  '/docs',
  '/docs/install',
  '/docs/proxmox',
  '/docs/admin',
  '/docs/projects',
  '/docs/servers',
  '/docs/volumes',
  '/docs/firewalls',
  '/docs/cli',
  '/docs/api',
  '/docs/troubleshooting'
]

export const ROUTES = ['/', '/features', '/homelab', '/resellers', '/roadmap', '/open-source', '/privacy', ...DOCS]

// Short links: prerendered as redirect pages, kept out of the sitemap and page checks. nginx answers them with a 302.
// /discord: permanent Discord invite (never expires), lands in #welcome.
export const REDIRECTS = { '/discord': 'https://discord.gg/YjTQKHn8Hs' }

// Pages that moved: nginx answers them with a 301 to the new path.
export const MOVED = { '/install': '/docs/install' }
