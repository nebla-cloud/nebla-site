import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Encoded so the repo never spells out other brands.
const ENCODED = 'aGV0em5lcixoY2xvdWQsZGlnaXRhbG9jZWFuLGxpbm9kZSx2dWx0cixjb252b3ksdmlydGZ1c2lvbix2aXJ0dWFsaXpvcg=='
const SKIP_DIRS = new Set(['node_modules', '.nuxt', '.output', '.git', 'shots', 'out', 'fonts'])
const TEXT_EXT = new Set(['.vue', '.md', '.ts', '.mjs', '.js', '.css', '.html', '.yml', '.yaml', '.json', '.svg', '.txt'])
const DEFAULT_PATHS = ['app', 'content', 'public', 'README.md', '.github']

export const bannedTerms = () => Buffer.from(ENCODED, 'base64').toString('utf8').split(',')

function rules() {
  return [
    ...bannedTerms().map(t => ({ name: 'banned term', re: new RegExp(`\\b${t}\\b`, 'i') })),
    { name: 'arrow in link text', re: /\S\s*→/, ext: ['.vue', '.md'] },
    { name: 'brand-red hex', re: /#d50c2d\b/i },
    { name: 'personal mailbox', re: /@(gmail|googlemail|outlook|hotmail|icloud)\.com/i }
  ]
}

function files(path) {
  const st = statSync(path, { throwIfNoEntry: false })
  if (!st) return []
  if (st.isFile()) return [path]
  return readdirSync(path).filter(n => !SKIP_DIRS.has(n)).flatMap(n => files(join(path, n)))
}

export function scanPaths(paths) {
  const hits = []
  const rs = rules()
  for (const file of paths.flatMap(files)) {
    if (!TEXT_EXT.has(extname(file)) || file.endsWith('check-brand.mjs')) continue
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      for (const r of rs) {
        if (r.ext && !r.ext.includes(extname(file))) continue
        if (r.re.test(line)) hits.push(`${file}:${i + 1}: ${r.name}`)
      }
    })
  }
  return hits
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const hits = scanPaths(args.length ? args : DEFAULT_PATHS)
  hits.forEach(h => console.error(h))
  console.log(hits.length ? `check-brand: ${hits.length} problem(s)` : 'check-brand: ok')
  process.exit(hits.length ? 1 : 0)
}
