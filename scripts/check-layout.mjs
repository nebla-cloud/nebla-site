import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'
import { ROUTES } from './routes.mjs'

const WIDTHS = [320, 390, 768, 1024, 1440]
const args = process.argv.slice(2)
const dark = args.includes('--dark')
const base = args.find(a => a.startsWith('--base='))?.slice(7) ?? 'http://localhost:3000'
const routes = args.filter(a => a.startsWith('/'))

mkdirSync('shots', { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const errs = []
for (const route of routes.length ? routes : ROUTES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: dark ? 'dark' : 'light', reducedMotion: 'reduce' })
    const res = await page.goto(base + route, { waitUntil: 'networkidle' })
    if (!res?.ok()) errs.push(`${route}@${width}: HTTP ${res?.status()}`)
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    if (over > 0) errs.push(`${route}@${width}: horizontal overflow ${over}px`)
    const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')
    await page.screenshot({ path: `shots/${name}-${width}${dark ? '-dark' : ''}.png`, fullPage: true })
    await page.close()
  }
}
await browser.close()
errs.forEach(e => console.error(e))
console.log(errs.length ? `check-layout: ${errs.length} problem(s)` : `check-layout: ok${dark ? ' (dark)' : ''}`)
process.exit(errs.length ? 1 : 0)
