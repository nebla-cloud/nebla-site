import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkPages } from '../scripts/check-site.mjs'

const page = (route, o = {}) => ({
  route,
  html: `<!doctype html><html><head>
${o.title === null ? '' : `<title>${o.title ?? `Nebla ${route}`}</title>`}
${o.desc === null ? '' : '<meta name="description" content="d">'}
${o.og === null ? '' : '<meta property="og:image" content="https://nebla.io/og.png">'}
${o.canonical === null ? '' : `<link rel="canonical" href="https://nebla.io${route}">`}
${o.head ?? ''}
</head><body>${o.h1 === null ? '' : '<h1>Hi</h1>'}</body></html>`
})

test('complete pages pass', () => {
  assert.deepEqual(checkPages([page('/'), page('/features')]), [])
})

for (const [field, msg] of [['h1', /h1/], ['title', /title/], ['desc', /description/], ['og', /og:image/], ['canonical', /canonical/]]) {
  test(`missing ${field} fails`, () => {
    const errs = checkPages([page('/', { [field]: null })])
    assert.equal(errs.length, 1)
    assert.match(errs[0], msg)
  })
}

test('duplicate titles fail', () => {
  const errs = checkPages([page('/', { title: 'Same' }), page('/x', { title: 'Same' })])
  assert.match(errs.join('\n'), /duplicate title/)
})

test('third-party scripts and stylesheets fail', () => {
  const errs = checkPages([
    page('/', { head: '<script src="https://other.example/a.js"></script>' }),
    page('/b', { head: '<link rel="stylesheet" href="https://fonts.example/a.css">' })
  ])
  assert.equal(errs.length, 2)
  assert.match(errs.join('\n'), /external/)
})

test('same-origin and relative assets pass', () => {
  assert.deepEqual(checkPages([page('/', { head: '<script src="/_nuxt/a.js"></script><link rel="stylesheet" href="https://nebla.io/a.css">' })]), [])
})

test('output without robots.txt or sitemap.xml fails', async () => {
  const { mkdtempSync, mkdirSync, writeFileSync } = await import('node:fs')
  const { join } = await import('node:path')
  const { tmpdir } = await import('node:os')
  const { checkOutput } = await import('../scripts/check-site.mjs')
  const dir = mkdtempSync(join(tmpdir(), 'site-'))
  mkdirSync(join(dir, 'a'), { recursive: true })
  writeFileSync(join(dir, 'a', 'index.html'), page('/a').html)
  const errs = checkOutput(dir, ['/a'])
  assert.match(errs.join('\n'), /robots\.txt/)
  assert.match(errs.join('\n'), /sitemap\.xml/)
  writeFileSync(join(dir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://nebla.io/sitemap.xml\n')
  writeFileSync(join(dir, 'sitemap.xml'), '<urlset><url><loc>https://nebla.io/a</loc></url></urlset>')
  assert.deepEqual(checkOutput(dir, ['/a']), [])
})

test('a sitemap missing a route fails', async () => {
  const { mkdtempSync, mkdirSync, writeFileSync } = await import('node:fs')
  const { join } = await import('node:path')
  const { tmpdir } = await import('node:os')
  const { checkOutput } = await import('../scripts/check-site.mjs')
  const dir = mkdtempSync(join(tmpdir(), 'site-'))
  mkdirSync(join(dir, 'a'), { recursive: true })
  writeFileSync(join(dir, 'a', 'index.html'), page('/a').html)
  writeFileSync(join(dir, 'robots.txt'), 'Sitemap: https://nebla.io/sitemap.xml\n')
  writeFileSync(join(dir, 'sitemap.xml'), '<urlset></urlset>')
  assert.match(checkOutput(dir, ['/a']).join('\n'), /sitemap\.xml missing \/a/)
})

test('pages rendered with the default Nuxt UI palette fail', () => {
  const errs = checkPages([page('/', { head: '<style>:root{--ui-color-neutral-500: var(--color-slate-500, #62748e)}</style>' })])
  assert.match(errs.join('\n'), /palette/)
})

test('pages rendered with the ink palette pass', () => {
  assert.deepEqual(checkPages([page('/', { head: '<style>:root{--ui-color-neutral-500: var(--color-ink-500, )}</style>' })]), [])
})
