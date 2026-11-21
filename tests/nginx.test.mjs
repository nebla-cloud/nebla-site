import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { REDIRECTS } from '../scripts/routes.mjs'

const conf = readFileSync(new URL('../deploy/nginx.conf', import.meta.url), 'utf8')

test('nginx returns a 302 for every short link', () => {
  for (const [from, to] of Object.entries(REDIRECTS)) {
    const re = new RegExp(`location ~ \\^${from.replace('/', '\\/')}\\/\\?\\$ \\{\\s*return 302 ${to.replace(/[.]/g, '\\.')};`)
    assert.match(conf, re, `${from} -> ${to}`)
  }
})
