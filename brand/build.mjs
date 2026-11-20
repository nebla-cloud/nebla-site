import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import opentype from 'opentype.js'
import { Resvg } from '@resvg/resvg-js'
import pngToIco from 'png-to-ico'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'brand/out')
const pub = join(root, 'public')
const m = JSON.parse(readFileSync(join(root, 'brand/mark.json'), 'utf8'))
const font = (w) => opentype.parse(new Uint8Array(readFileSync(join(root, `node_modules/@fontsource/onest/files/onest-latin-${w}-normal.woff`))).buffer)
const bold = font(700)
const regular = font(400)

// Content box of the arch inside its 64-unit grid, stroke included.
const half = m.stroke / 2
const box = { x: 16 - half, y: 15 - half, w: 32 + m.stroke, h: 37 + m.stroke }

const gradient = id => `<linearGradient id="${id}" x1="0" y1="64" x2="64" y2="0" gradientUnits="userSpaceOnUse">${m.gradient.map((c, i) => `<stop offset="${[0, 0.52, 1][i]}" stop-color="${c}"/>`).join('')}</linearGradient>`
const arch = paint => `<path d="${m.path}" fill="none" stroke="${paint}" stroke-width="${m.stroke}" stroke-linecap="round"/>`
const markInner = (tone, id) => tone === 'gradient' ? `<defs>${gradient(id)}</defs>${arch(`url(#${id})`)}` : arch(tone)

// Font contours arrive unclosed; close each so renderers fill them alike.
const closed = p => p.commands.map((c, i) => (c.type === 'M' && i ? 'Z' : '') + c.type + ['x1', 'y1', 'x2', 'y2', 'x', 'y'].filter(k => k in c).map(k => +c[k].toFixed(2)).join(' ')).join('') + (p.commands.length ? 'Z' : '')

const text = (f, s, size, tracking, x, baseline) => {
  let cx = x
  let d = ''
  for (const ch of s) {
    const g = f.charToGlyph(ch)
    d += closed(g.getPath(cx, baseline, size))
    cx += (g.advanceWidth / f.unitsPerEm) * size + tracking * size
  }
  return { d, width: cx - x - tracking * size }
}

const svg = (w, h, body, vb = `0 0 ${w} ${h}`) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}">${body}</svg>\n`
const markSvg = tone => svg(64, 64, markInner(tone, 'nebla-arch'))

const capHeight = bold.tables.os2.sCapHeight / bold.unitsPerEm

function lockup(wordColor, size = 100, x0 = 0, y0 = 0, id = 'nebla-arch') {
  const markH = capHeight * size * 1.5
  const markW = (box.w / box.h) * markH
  const baseline = y0 + markH / 2 + (capHeight * size) / 2
  const gap = markW * 0.2
  const word = text(bold, m.wordmark.text, size, m.wordmark.tracking, x0 + markW + gap, baseline)
  const body = `<svg x="${x0}" y="${y0}" width="${markW}" height="${markH}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}">${markInner('gradient', id)}</svg><path d="${word.d}" fill="${wordColor}"/>`
  return { body, width: markW + gap + word.width, height: markH }
}

function lockupSvg(wordColor) {
  const l = lockup(wordColor)
  return svg(Math.ceil(l.width), Math.ceil(l.height), l.body)
}

function card(w, h) {
  const l = lockup(m.ink, h * 0.16)
  const lx = (w - l.width) / 2
  const ly = h * 0.34
  const tSize = h * 0.05
  const probe = text(regular, m.tagline, tSize, 0, 0, 0)
  const tag = text(regular, m.tagline, tSize, 0, (w - probe.width) / 2, ly + l.height + h * 0.14)
  const glow = `<defs><filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${h * 0.09}"/></filter></defs>
<rect width="${w}" height="${h}" fill="${m.page}"/>
<g filter="url(#blur)"><ellipse cx="${w * 0.2}" cy="${h * 0.12}" rx="${w * 0.26}" ry="${h * 0.3}" fill="${m.glow[0]}"/><ellipse cx="${w * 0.52}" cy="${h * 0.02}" rx="${w * 0.24}" ry="${h * 0.26}" fill="${m.glow[1]}"/><ellipse cx="${w * 0.84}" cy="${h * 0.14}" rx="${w * 0.22}" ry="${h * 0.28}" fill="${m.glow[2]}"/></g>`
  const inner = lockup(m.ink, h * 0.16, lx, ly).body
  return svg(w, h, `${glow}${inner}<path d="${tag.d}" fill="#4E5763"/>`)
}

// Profile banner: glow across the full canvas, lockup and tagline centred in
// the safe area (YouTube crops to a central strip on most devices).
function banner(w, h, safeH = h) {
  const top = (h - safeH) / 2
  const l = lockup(m.ink, safeH * 0.2)
  const lx = (w - l.width) / 2
  const tSize = safeH * 0.065
  const gap = safeH * 0.1
  const ly = top + (safeH - (l.height + gap + tSize)) / 2
  const probe = text(regular, m.tagline, tSize, 0, 0, 0)
  const tag = text(regular, m.tagline, tSize, 0, (w - probe.width) / 2, ly + l.height + gap + tSize * 0.75)
  const glow = `<defs><filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${h * 0.12}"/></filter></defs>
<rect width="${w}" height="${h}" fill="${m.page}"/>
<g filter="url(#blur)"><ellipse cx="${w * 0.12}" cy="${h * 0.2}" rx="${w * 0.2}" ry="${h * 0.45}" fill="${m.glow[0]}"/><ellipse cx="${w * 0.5}" cy="${h * 0.05}" rx="${w * 0.2}" ry="${h * 0.35}" fill="${m.glow[1]}"/><ellipse cx="${w * 0.88}" cy="${h * 0.25}" rx="${w * 0.2}" ry="${h * 0.45}" fill="${m.glow[2]}"/></g>`
  return svg(w, h, `${glow}${lockup(m.ink, safeH * 0.2, lx, ly).body}<path d="${tag.d}" fill="#4E5763"/>`)
}

function tile(size, padRatio = 0.16) {
  const pad = size * padRatio
  return svg(size, size, `<rect width="${size}" height="${size}" fill="${m.page}"/><svg x="${pad}" y="${pad}" width="${size - 2 * pad}" height="${size - 2 * pad}" viewBox="0 0 64 64">${markInner('gradient', 'nebla-arch')}</svg>`)
}

const png = (s, width) => new Resvg(s, { fitTo: { mode: 'width', value: width }, font: { loadSystemFonts: false } }).render().asPng()

mkdirSync(out, { recursive: true })
mkdirSync(pub, { recursive: true })
const write = (f, d) => writeFileSync(f, d)

write(join(out, 'mark.svg'), markSvg('gradient'))
write(join(out, 'mark-ink.svg'), markSvg(m.ink))
write(join(out, 'mark-white.svg'), markSvg(m.white))
write(join(out, 'lockup-light.svg'), lockupSvg(m.ink))
write(join(out, 'lockup-dark.svg'), lockupSvg(m.white))
write(join(out, 'lockup-current.svg'), lockupSvg('currentColor'))
write(join(out, 'social-preview.png'), png(card(1280, 640), 1280))
const og = png(card(1200, 630), 1200)
write(join(out, 'og.png'), og)
write(join(pub, 'og.png'), og)
write(join(pub, 'favicon.svg'), markSvg('gradient'))
write(join(pub, 'apple-touch-icon.png'), png(tile(180), 180))
write(join(pub, 'icon-512.png'), png(tile(512), 512))
write(join(pub, 'favicon.ico'), await pngToIco([16, 32, 48].map(s => png(markSvg('gradient'), s))))
const social = join(out, 'social')
mkdirSync(social, { recursive: true })
// Avatars are cropped to a circle, so the arch gets extra padding.
write(join(social, 'avatar-1000.png'), png(tile(1000, 0.22), 1000))
write(join(social, 'banner-1500x500.png'), png(banner(1500, 500), 1500))
write(join(social, 'banner-3000x1000.png'), png(banner(3000, 1000), 3000))
write(join(social, 'banner-youtube-2560x1440.png'), png(banner(2560, 1440, 423), 2560))
console.log('brand: assets written to brand/out and public/')
