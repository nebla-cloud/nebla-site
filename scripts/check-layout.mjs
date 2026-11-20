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
    const clipped = await page.evaluate(() => {
      const scrollable = el => { for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if ((o === 'auto' || o === 'scroll') && p !== document.documentElement) return true } return false }
      return [...document.querySelectorAll('body *')].filter((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.right > window.innerWidth + 1 && !scrollable(el) && getComputedStyle(el).visibility !== 'hidden' && !el.closest('.sr-only')
      }).slice(0, 3).map(el => `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join('.')}`)
    })
    const lowContrast = await page.evaluate(() => {
      const ctx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true })
      const rgb = (c) => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1); const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data; return { r, g, b, a: a / 255 } }
      const lum = ({ r, g, b }) => [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0)
      const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.a > 0.5) return c } return rgb(getComputedStyle(document.body).backgroundColor) }
      const out = []
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest('.sr-only, svg')) continue
        const text = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('')
        if (!text) continue
        const st = getComputedStyle(el)
        const r = el.getBoundingClientRect()
        if (r.width === 0 || st.visibility === 'hidden' || +st.opacity === 0) continue
        const fg = rgb(st.color)
        const bg = bgOf(el)
        const mix = { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a) }
        const [l1, l2] = [lum(mix), lum(bg)].sort((a, b) => b - a)
        const ratio = (l1 + 0.05) / (l2 + 0.05)
        const size = parseFloat(st.fontSize)
        const large = size >= 24 || (size >= 18.66 && +st.fontWeight >= 700)
        if (ratio < (large ? 3 : 4.5)) out.push(`"${text.slice(0, 24)}" ${ratio.toFixed(2)}:1`)
      }
      return [...new Set(out)].slice(0, 4)
    })
    if (lowContrast.length) errs.push(`${route}@${width}: low contrast: ${lowContrast.join(', ')}`)
    if (clipped.length) errs.push(`${route}@${width}: content past the right edge: ${clipped.join(', ')}`)
    const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')
    await page.screenshot({ path: `shots/${name}-${width}${dark ? '-dark' : ''}.png`, fullPage: true })
    await page.close()
  }
}
await browser.close()
errs.forEach(e => console.error(e))
console.log(errs.length ? `check-layout: ${errs.length} problem(s)` : `check-layout: ok${dark ? ' (dark)' : ''}`)
process.exit(errs.length ? 1 : 0)
