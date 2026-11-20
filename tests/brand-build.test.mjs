import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'

const mark = JSON.parse(readFileSync('brand/mark.json', 'utf8'))
const SVGS = ['mark', 'mark-ink', 'mark-white', 'lockup-light', 'lockup-dark'].map(n => `brand/out/${n}.svg`)
const PNGS = { 'brand/out/social-preview.png': [1280, 640], 'brand/out/og.png': [1200, 630], 'public/og.png': [1200, 630], 'public/apple-touch-icon.png': [180, 180], 'public/icon-512.png': [512, 512] }

const pngSize = (file) => {
  const b = readFileSync(file)
  assert.equal(b.toString('ascii', 1, 4), 'PNG', file)
  return [b.readUInt32BE(16), b.readUInt32BE(20)]
}

before(() => { execFileSync('node', ['brand/build.mjs'], { stdio: 'pipe' }) })

test('every asset is generated', () => {
  for (const f of [...SVGS, ...Object.keys(PNGS), 'public/favicon.svg', 'public/favicon.ico']) assert.ok(existsSync(f), f)
})

test('PNGs have exact sizes', () => {
  for (const [f, size] of Object.entries(PNGS)) assert.deepEqual(pngSize(f), size, f)
})

test('favicon.ico holds 16, 32 and 48 px images', () => {
  const b = readFileSync('public/favicon.ico')
  const count = b.readUInt16LE(4)
  const sizes = Array.from({ length: count }, (_, i) => b[6 + i * 16] || 256).sort((a, c) => a - c)
  assert.deepEqual(sizes, [16, 32, 48])
})

test('SVGs are outlined and have a viewBox', () => {
  for (const f of [...SVGS, 'public/favicon.svg']) {
    const s = readFileSync(f, 'utf8')
    assert.doesNotMatch(s, /<text/, f)
    assert.match(s, /viewBox="/, f)
  }
})

test('the gradient mark uses the three brand stops', () => {
  const s = readFileSync('brand/out/mark.svg', 'utf8')
  for (const hex of mark.gradient) assert.match(s, new RegExp(hex, 'i'))
})

test('the dark lockup never uses ink', () => {
  assert.doesNotMatch(readFileSync('brand/out/lockup-dark.svg', 'utf8'), new RegExp(mark.ink, 'i'))
})

test('single-colour marks use one colour only', () => {
  assert.doesNotMatch(readFileSync('brand/out/mark-ink.svg', 'utf8'), /Gradient/)
  assert.match(readFileSync('brand/out/mark-white.svg', 'utf8'), new RegExp(mark.white, 'i'))
})
