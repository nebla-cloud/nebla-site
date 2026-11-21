import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { DOCS } from '../scripts/routes.mjs'

// content/docs/NN.slug.md becomes /docs/slug, and 00.index.md becomes /docs.
test('DOCS lists every docs page in file order', () => {
  const files = readdirSync(new URL('../content/docs', import.meta.url)).filter(f => f.endsWith('.md')).sort()
  const paths = files.map((f) => {
    const slug = f.replace(/^\d+\./, '').replace(/\.md$/, '')
    return slug === 'index' ? '/docs' : `/docs/${slug}`
  })
  assert.deepEqual(paths, DOCS)
})
