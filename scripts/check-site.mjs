import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'node-html-parser'
import { ROUTES } from './routes.mjs'

const ORIGIN = 'https://nebla.io'

const external = (url) => /^(https?:)?\/\//.test(url) && !url.startsWith(ORIGIN)

export function checkPages(pages) {
  const errs = []
  const titles = new Map()
  for (const { route, html } of pages) {
    const doc = parse(html)
    const need = (ok, what) => { if (!ok) errs.push(`${route}: missing ${what}`) }
    need(doc.querySelector('h1'), '<h1>')
    const title = doc.querySelector('title')?.text.trim()
    need(title, '<title>')
    need(doc.querySelector('meta[name="description"]')?.getAttribute('content'), 'meta description')
    need(doc.querySelector('meta[property="og:image"]')?.getAttribute('content'), 'og:image')
    need(doc.querySelector('link[rel="canonical"]')?.getAttribute('href'), 'canonical link')
    if (title) {
      if (titles.has(title)) errs.push(`${route}: duplicate title "${title}" (also ${titles.get(title)})`)
      titles.set(title, route)
    }
    for (const s of doc.querySelectorAll('script[src]')) {
      if (external(s.getAttribute('src'))) errs.push(`${route}: external script ${s.getAttribute('src')}`)
    }
    for (const l of doc.querySelectorAll('link[rel="stylesheet"], link[rel="preload"], link[rel="modulepreload"]')) {
      if (external(l.getAttribute('href'))) errs.push(`${route}: external asset ${l.getAttribute('href')}`)
    }
  }
  return errs
}

export function checkOutput(dir, routes = ROUTES) {
  const errs = []
  const pages = []
  for (const route of routes) {
    const file = join(dir, route, 'index.html')
    if (!existsSync(file)) { errs.push(`${route}: not generated (${file})`); continue }
    pages.push({ route, html: readFileSync(file, 'utf8') })
  }
  const robots = join(dir, 'robots.txt')
  if (!existsSync(robots)) errs.push('robots.txt: not generated')
  else if (!readFileSync(robots, 'utf8').includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) errs.push('robots.txt: no Sitemap line')
  const sitemap = join(dir, 'sitemap.xml')
  if (!existsSync(sitemap)) errs.push('sitemap.xml: not generated')
  else {
    const xml = readFileSync(sitemap, 'utf8')
    for (const route of routes) {
      if (!xml.includes(`<loc>${ORIGIN}${route === '/' ? '/' : route}</loc>`)) errs.push(`sitemap.xml missing ${route}`)
    }
  }
  return [...errs, ...checkPages(pages)]
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const routes = process.argv.slice(2)
  const errs = checkOutput('.output/public', routes.length ? routes : ROUTES)
  errs.forEach(e => console.error(e))
  console.log(errs.length ? `check-site: ${errs.length} problem(s)` : 'check-site: ok')
  process.exit(errs.length ? 1 : 0)
}
