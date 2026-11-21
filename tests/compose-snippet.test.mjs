import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'

const CORE = process.env.NEBLA_DEPLOY_DIR ?? '../nebla/deploy'
const skip = existsSync(`${CORE}/compose.yaml`) ? false : 'core repo not checked out next to the site'

const PAGE = 'content/docs/01.install.md'

const blocks = (md, lang) => [...md.matchAll(new RegExp('```' + lang + '\\n([\\s\\S]*?)```', 'g'))].map(m => m[1])

test('install page compose matches the repo compose apart from the image', { skip }, () => {
  const md = readFileSync(PAGE, 'utf8')
  const page = parse(blocks(md, 'yaml')[0])
  const repo = parse(readFileSync(`${CORE}/compose.yaml`, 'utf8'))

  // The repo reads ${NEBLA_IMAGE:-<pinned tag>}; the page shows the pinned tag itself.
  const pinned = repo.services.panel.image.match(/^\$\{NEBLA_IMAGE:-(.+)\}$/)?.[1] ?? repo.services.panel.image
  assert.equal(page.services.panel.image, pinned)
  assert.equal(page.services.panel.build, undefined)
  const without = (obj, ...keys) => Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))
  assert.deepEqual(without(page.services.panel, 'image'), without(repo.services.panel, 'image', 'build'), 'panel service')
  assert.deepEqual(without(page.services, 'panel'), without(repo.services, 'panel'), 'other services')
  assert.equal(page.name, repo.name)
  assert.deepEqual(page.volumes, repo.volumes)
})

test('every variable in the page .env exists in .env.example', { skip }, () => {
  const md = readFileSync(PAGE, 'utf8')
  const env = blocks(md, 'dotenv').join('\n')
  assert.ok(env, 'the install page has a dotenv block for .env')
  const known = new Set(readFileSync(`${CORE}/.env.example`, 'utf8').split('\n').map(l => l.replace(/^#\s*/, '').split('=')[0].trim()).filter(Boolean))
  for (const line of env.split('\n').filter(l => /^[A-Z_]+=/.test(l))) {
    assert.ok(known.has(line.split('=')[0]), line)
  }
})
