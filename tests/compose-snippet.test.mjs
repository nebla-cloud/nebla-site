import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'

const CORE = '../nebla/deploy'
const skip = existsSync(`${CORE}/compose.yaml`) ? false : 'core repo not checked out next to the site'

const blocks = (md, lang) => [...md.matchAll(new RegExp('```' + lang + '\\n([\\s\\S]*?)```', 'g'))].map(m => m[1])

test('install page compose matches the repo compose apart from the image', { skip }, () => {
  const md = readFileSync('content/install.md', 'utf8')
  const page = parse(blocks(md, 'yaml')[0])
  const repo = parse(readFileSync(`${CORE}/compose.yaml`, 'utf8'))

  assert.deepEqual(Object.keys(page.services).sort(), Object.keys(repo.services).sort())
  for (const [name, svc] of Object.entries(repo.services)) {
    const p = page.services[name]
    assert.deepEqual(Object.keys(p.environment ?? {}).sort(), Object.keys(svc.environment ?? {}).sort(), `${name} env`)
    assert.deepEqual(p.healthcheck, svc.healthcheck, `${name} healthcheck`)
    assert.deepEqual(p.volumes, svc.volumes, `${name} volumes`)
    assert.equal(p.stop_grace_period, svc.stop_grace_period, `${name} stop_grace_period`)
  }
  assert.equal(page.services.panel.image, 'ghcr.io/nebla-cloud/nebla:latest')
  assert.equal(page.services.panel.build, undefined)
  assert.deepEqual(page.volumes, repo.volumes)
})

test('every variable in the page .env exists in .env.example', { skip }, () => {
  const md = readFileSync('content/install.md', 'utf8')
  const env = blocks(md, 'ini')[0]
  assert.ok(env, 'install.md has an ini block for .env')
  const known = new Set(readFileSync(`${CORE}/.env.example`, 'utf8').split('\n').map(l => l.replace(/^#\s*/, '').split('=')[0].trim()).filter(Boolean))
  for (const line of env.split('\n').filter(l => /^[A-Z_]+=/.test(l))) {
    assert.ok(known.has(line.split('=')[0]), line)
  }
})
