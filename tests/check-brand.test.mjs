import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { bannedTerms, scanPaths } from '../scripts/check-brand.mjs'

const tmp = (name, body) => {
  const dir = mkdtempSync(join(tmpdir(), 'brand-'))
  const file = join(dir, name)
  writeFileSync(file, body)
  return file
}

test('every banned term is caught, case-insensitively', () => {
  const terms = bannedTerms()
  assert.ok(terms.length >= 6)
  for (const term of terms) {
    const hits = scanPaths([tmp('copy.md', `Nebla vs ${term.toUpperCase()}`)])
    assert.equal(hits.length, 1, term)
    assert.match(hits[0], /copy\.md:1: /)
  }
})

test('an arrow appended to link text is caught in vue and md', () => {
  assert.equal(scanPaths([tmp('a.vue', '<a>Ready →</a>')]).length, 1)
  assert.equal(scanPaths([tmp('a.md', '[Docs →](/docs)')]).length, 1)
})

test('a brand-red hex is caught', () => {
  assert.equal(scanPaths([tmp('a.css', '.x { color: #D50C2D }')]).length, 1)
})

test('a personal mailbox address is caught', () => {
  assert.equal(scanPaths([tmp('a.md', 'mail someone@gmail.com')]).length, 1)
})

test('clean copy passes', () => {
  assert.deepEqual(scanPaths([tmp('a.vue', '<h1>Your Proxmox, as a cloud console.</h1>')]), [])
})

test('directories are scanned recursively', () => {
  const file = tmp('deep.md', 'fine')
  assert.deepEqual(scanPaths([join(file, '..')]), [])
})

test('the retired aurora glow is caught', () => {
  assert.equal(scanPaths([tmp('a.vue', '<section class="aurora-glow">')]).length, 1)
  assert.equal(scanPaths([tmp('a.css', ':root { --glow-a: #B9F1DC; }')]).length, 1)
})
