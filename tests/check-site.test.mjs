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
