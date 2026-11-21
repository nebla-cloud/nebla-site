import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { MOVED, REDIRECTS } from '../scripts/routes.mjs'

const conf = readFileSync(new URL('../deploy/nginx.conf', import.meta.url), 'utf8')
const rule = (from, code, to) => new RegExp(`location ~ \\^${from.replace('/', '\\/')}\\/\\?\\$ \\{\\s*return ${code} ${to.replace(/[.]/g, '\\.')};`)

test('nginx returns a 302 for every short link', () => {
  for (const [from, to] of Object.entries(REDIRECTS)) assert.match(conf, rule(from, 302, to), `${from} -> ${to}`)
})

test('nginx returns a 301 for every moved page', () => {
  for (const [from, to] of Object.entries(MOVED)) assert.match(conf, rule(from, 301, to), `${from} -> ${to}`)
})
