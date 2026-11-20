import { ROUTES } from './scripts/routes.mjs'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/content', '@nuxt/fonts'],
  devtools: { enabled: false },
  components: [{ path: '~/components', pathPrefix: false }],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },
  colorMode: { preference: 'system', fallback: 'light' },
  ui: { fonts: false },
  fonts: {
    families: [{ name: 'Onest', provider: 'google', weights: [400, 500, 600, 700, 800] }]
  },
  content: { build: { markdown: { highlight: { theme: { default: 'min-light', dark: 'min-dark' }, langs: ['yaml', 'ini', 'sh', 'bash'] } } } },
  icon: { serverBundle: 'local', clientBundle: { scan: true } },
  nitro: { prerender: { routes: ROUTES, crawlLinks: true, failOnError: true } },
  compatibilityDate: '2026-11-01'
})
