// Retakes the panel screenshots in public/screens from the core repo's UI harness.
// Usage: node scripts/capture-panel.mjs [--core=../nebla] [--skip-build]
// The fake Proxmox only returns a five-point ramp for metrics, so the metrics API is
// answered here with a seeded, realistic hour of data per server.
import { execFileSync, spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright-core'

const args = process.argv.slice(2)
const core = resolve(args.find(a => a.startsWith('--core='))?.slice(7) ?? '../nebla')
const out = resolve('public/screens')
const SSH_KEY = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKhCY6tff8uCIx8bJ18sUvMxanQaGQMcbCJCwbZXX8o6 hexy@laptop'

if (!args.includes('--skip-build')) execFileSync('pnpm', ['build'], { cwd: join(core, 'web'), stdio: 'inherit' })

const dir = mkdtempSync(join(tmpdir(), 'nebla-shots-'))
const outFile = join(dir, 'out.json')
const stop = join(dir, 'stop')
const harness = spawn('go', ['test', '-count=1', '-tags', 'uiharness', '-run', 'TestUIHarness', './internal/uiharness', '-timeout', '0'], {
  cwd: core, env: { ...process.env, NEBLA_UI_HARNESS_OUT: outFile, NEBLA_UI_HARNESS_STOP: stop }, stdio: ['ignore', 'inherit', 'inherit'],
})
const shutdown = () => { if (existsSync(dir)) writeFileSync(stop, '') }
process.once('exit', shutdown)

const deadline = Date.now() + 300_000
while (!existsSync(outFile)) {
  if (harness.exitCode !== null) throw new Error(`harness exited with code ${harness.exitCode}`)
  if (Date.now() > deadline) throw new Error('harness did not start in time')
  await new Promise(r => setTimeout(r, 250))
}
const h = JSON.parse(readFileSync(outFile, 'utf8'))

// Small seeded PRNG so every run draws the same graphs.
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Per-server character: a web server with traffic, a busier database, a spiky CI runner.
const PROFILES = {
  'web-1': { cpu: 18, cpuWave: 8, burst: 0.04, net: 180_000, read: 20_000, write: 90_000 },
  'db-1': { cpu: 34, cpuWave: 10, burst: 0.03, net: 420_000, read: 900_000, write: 650_000 },
  'ci-runner': { cpu: 9, cpuWave: 3, burst: 0.12, net: 60_000, read: 150_000, write: 300_000 },
}
const STEP = { hour: 60, day: 1800, week: 10800, month: 43200 }

function metrics(id, name, timeframe) {
  const p = PROFILES[name] ?? PROFILES['web-1']
  const rand = rng(id * 7919 + timeframe.length)
  const step = STEP[timeframe] ?? 60
  const end = Math.floor(Date.now() / 1000 / step) * step
  const n = 70
  const series = { 'cpu': [], 'network.in': [], 'network.out': [], 'disk.read': [], 'disk.write': [] }
  // Smoothed noise plus a slow wave and the odd decaying burst reads like a real hour of load.
  const smooth = (a, k) => () => (a = a * k + rand() * (1 - k))
  const noise = smooth(0.5, 0.7)
  const traffic = smooth(0.5, 0.6)
  let burst = 0
  for (let i = 0; i < n; i++) {
    const t = end - (n - 1 - i) * step
    if (rand() < p.burst) burst = 0.8 + rand()
    burst *= 0.78
    const wave = Math.sin((i / n) * Math.PI * 2 + id) * 0.5 + 0.5
    const load = 0.75 + (noise() - 0.5) * 0.8 + burst + wave * 0.3
    const cpu = Math.min(97, Math.max(1, p.cpu * load + p.cpuWave * wave))
    const net = p.net * load * (0.85 + traffic() * 0.3)
    series['cpu'].push([t, +cpu.toFixed(2)])
    series['network.in'].push([t, Math.round(net)])
    series['network.out'].push([t, Math.round(net * (0.38 + traffic() * 0.08))])
    series['disk.read'].push([t, Math.round(p.read * (0.2 + burst * 2 + noise() * 0.4))])
    series['disk.write'].push([t, Math.round(p.write * load * (0.8 + traffic() * 0.3))])
  }
  return { start: new Date((end - (n - 1) * step) * 1000).toISOString(), end: new Date(end * 1000).toISOString(), step, time_series: series }
}

const browser = await chromium.launch({ channel: 'chrome' })
try {
  const ctx = await browser.newContext({ baseURL: h.url, viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.6, reducedMotion: 'reduce' })
  ctx.setDefaultTimeout(60_000)
  const names = new Map()
  await ctx.route(/\/v1\/servers\/(\d+)\/metrics/, async (route) => {
    const url = new URL(route.request().url())
    const id = +url.pathname.match(/servers\/(\d+)\/metrics/)[1]
    await route.fulfill({ json: { metrics: metrics(id, names.get(id), url.searchParams.get('timeframe') ?? 'hour') } })
  })
  const page = await ctx.newPage()
  const nav = page.getByRole('navigation')
  const step = title => page.locator('[data-step]').filter({ hasText: title })
  const choice = text => page.locator('label.nb-choice', { hasText: text })

  // First run: admin, location, images, types, IP pool, project, SSH key.
  await page.goto('/')
  await page.locator('input[name=name]').fill('Admin')
  await page.locator('input[name=email]').fill('admin@example.test')
  await page.locator('input[name=password]').fill('correct-horse-battery')
  await page.getByRole('button', { name: 'Create account' }).click()
  await step('Connect Proxmox').getByRole('link', { name: 'Connect' }).click()
  await page.getByRole('button', { name: 'Connect a location' }).click()
  await page.getByRole('button', { name: 'Connect manually' }).click()
  await page.locator('input[name=name]').fill('home')
  await page.locator('input[name=url]').fill(h.pve.url)
  await page.locator('input[name=token_id]').fill(h.pve.token_id)
  await page.locator('input[name=token_secret]').fill(h.pve.token_secret)
  await page.locator('input[name=ca_fingerprint]').fill(h.pve.ca_fingerprint)
  await page.locator('input[name=disk_storage]').fill('ceph')
  await page.locator('input[name=iso_storage]').fill('local')
  await page.locator('input[name=import_storage]').fill('imp')
  await page.getByRole('button', { name: 'Connect location' }).click()
  await page.waitForURL(/\/admin\/locations\/\d+$/)
  await nav.getByRole('link', { name: 'Get ready' }).click()
  await step('Turn on OS images').getByRole('link', { name: 'Choose images' }).click()
  for (const os of ['Debian 13', 'Ubuntu 24.04']) {
    await page.getByRole('button', { name: `Enable ${os} in home` }).click()
    await page.getByRole('button', { name: `${os} in home: Ready. Show details` }).waitFor()
  }
  await nav.getByRole('link', { name: 'Get ready' }).click()
  await step('Add server types').getByRole('link', { name: 'Add' }).click()
  for (const [name, cores, mem, disk] of [['small-2', 2, 4, 40], ['medium-4', 4, 8, 80], ['large-8', 8, 16, 160]]) {
    await page.getByRole('button', { name: 'New server type' }).first().click()
    const form = page.getByRole('dialog')
    await form.locator('input[name=name]').fill(name)
    await form.locator('input[name=cores]').fill(String(cores))
    await form.locator('input[name=memory_gb]').fill(String(mem))
    await form.locator('input[name=disk_gb]').fill(String(disk))
    await form.getByRole('button', { name: 'Create server type' }).click()
    await page.getByText(`${cores} vCPU, ${mem} GB, ${disk} GB`).waitFor()
  }
  await nav.getByRole('link', { name: 'Get ready' }).click()
  await step('Add an IP pool').getByRole('link', { name: 'Add' }).click()
  await page.getByRole('button', { name: 'New IP pool' }).first().click()
  const pool = page.getByRole('dialog')
  await pool.locator('select[name=location_id]').selectOption({ label: 'home' })
  await pool.locator('select[name=family]').selectOption('ipv4')
  await pool.locator('input[name=bridge]').fill('vmbr0')
  await pool.locator('input[name=cidr]').fill('203.0.113.0/24')
  await pool.locator('input[name=gateway]').fill('203.0.113.1')
  await pool.locator('input[name=range_start]').fill('203.0.113.10')
  await pool.locator('input[name=range_end]').fill('203.0.113.20')
  await pool.getByRole('button', { name: 'Create IP pool' }).click()
  await page.getByText('0 of 11 addresses in use').waitFor()
  await page.getByRole('link', { name: 'Go to projects' }).click()
  await page.locator('input[name=name]').fill('Home lab')
  await page.getByRole('button', { name: 'Create project' }).click()
  await page.waitForURL(/\/p\/\d+\/servers$/)
  await nav.getByRole('link', { name: 'SSH keys' }).click()
  await page.getByRole('button', { name: 'Add key' }).first().click()
  await page.getByRole('dialog').locator('textarea[name=public_key]').fill(SSH_KEY)
  await page.getByRole('dialog').getByRole('button', { name: 'Add key' }).click()
  await page.getByText('hexy@laptop', { exact: true }).waitFor()

  const openCreate = async () => {
    await page.goto(page.url().match(/^.*\/p\/\d+/)[0] + '/servers')
    await page.getByRole('link', { name: 'Create server' }).first().click()
    await page.getByRole('heading', { name: 'Create server' }).waitFor()
  }
  for (const [name, image, type] of [['web-1', 'Debian', 'medium-4'], ['db-1', 'Ubuntu', 'large-8'], ['ci-runner', 'Debian', 'small-2']]) {
    await openCreate()
    await choice(image).click()
    await choice(type).click()
    await page.locator('input[name=name]').fill(name)
    await page.getByRole('button', { name: 'Create server' }).click()
    await page.waitForURL(/\/p\/\d+\/servers\/\d+$/)
    names.set(+page.url().match(/servers\/(\d+)$/)[1], name)
    await page.locator('header').getByText('Running', { exact: true }).waitFor()
  }
  const projectPath = page.url().replace(/\/servers\/\d+$/, '')
  const serverPath = id => `${projectPath}/servers/${id}`
  const webId = [...names].find(([, n]) => n === 'web-1')[0]

  const settle = async () => {
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(600)
  }
  const shots = {
    'server-list': async () => {
      await page.goto(`${projectPath}/servers`)
      await page.getByText('ci-runner').waitFor()
    },
    'server-detail': async () => {
      await page.goto(serverPath(webId))
      await page.locator('header').getByText('Running', { exact: true }).waitFor()
    },
    'create-server': async () => {
      await openCreate()
      await choice('Debian').click()
      await choice('medium-4').click()
      await page.locator('input[name=name]').fill('web-2')
      await page.locator('input[name=name]').blur()
      await choice('hexy@laptop').click()
      await page.getByLabel('Summary').getByText('1 key').waitFor()
    },
  }
  // The site frames the content column (top bar and page) without the sidebar, downscaled to 1600px.
  // The viewport stays at the xl breakpoint (1280) or wider so the list keeps its CPU column.
  const sidebar = await page.getByRole('complementary', { name: 'Project menu' }).boundingBox()
  const left = Math.round(sidebar.x + sidebar.width) // the clip skips its 1px border
  const width = Math.max(1000, 1280 - left)
  await page.setViewportSize({ width: left + width, height: 1000 })
  for (const scheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: scheme })
    for (const [name, go] of Object.entries(shots)) {
      await go()
      await settle()
      const height = await page.locator('main').first().evaluate((main) => {
        // Content folded away inside a collapsed panel still has a box below it.
        const clipped = (el, r) => {
          for (let p = el.parentElement; p && p !== main; p = p.parentElement) {
            if (getComputedStyle(p).overflowY === 'visible') continue
            if (r.top >= p.getBoundingClientRect().bottom - 1) return true
          }
          return false
        }
        let bottom = 0
        // Leaves and bordered boxes; layout wrappers carry spacer padding.
        for (const el of main.querySelectorAll('*')) {
          const st = getComputedStyle(el)
          const drawn = !el.children.length || parseFloat(st.borderBottomWidth) > 0
          if (!drawn || st.visibility === 'hidden') continue
          const r = el.getBoundingClientRect()
          if (!r.width || !r.height || clipped(el, r)) continue
          bottom = Math.max(bottom, r.bottom + window.scrollY)
        }
        return Math.ceil(bottom + 24)
      })
      await page.screenshot({ path: join(dir, `${name}-${scheme}.png`), fullPage: true, clip: { x: left + 1, y: 0, width: width - 1, height } })
      execFileSync('cwebp', ['-quiet', '-q', '88', '-resize', '1600', '0', join(dir, `${name}-${scheme}.png`), '-o', join(out, `${name}-${scheme}.webp`)])
      console.log(`wrote public/screens/${name}-${scheme}.webp`)
    }
  }
} finally {
  await browser.close()
  shutdown()
  await new Promise(r => harness.exitCode !== null ? r() : harness.once('exit', r))
  rmSync(dir, { recursive: true, force: true })
}
