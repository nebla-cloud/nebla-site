// Copies the public "Nebla roadmap" project board on GitHub into app/data/roadmap.json, which /roadmap renders.
// The site build never calls GitHub: .github/workflows/roadmap.yml runs this on a schedule and commits any change.
//
//   GITHUB_TOKEN=... node scripts/sync-roadmap.mjs      (falls back to `gh auth token`)
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const BOARD = { org: 'nebla-cloud', number: 1 }
const OUT = new URL('../app/data/roadmap.json', import.meta.url)

const QUERY = `query($org: String!, $number: Int!, $after: String) {
  organization(login: $org) {
    projectV2(number: $number) {
      url
      fields(first: 50) { nodes { ... on ProjectV2SingleSelectField { name options { name } } } }
      items(first: 100, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes {
          isArchived
          content {
            __typename
            ... on DraftIssue { title body }
            ... on Issue { title body url repository { isPrivate } }
            ... on PullRequest { title body url repository { isPrivate } }
          }
          fieldValues(first: 30) {
            nodes { ... on ProjectV2ItemFieldSingleSelectValue { name field { ... on ProjectV2SingleSelectField { name } } } }
          }
        }
      }
    }
  }
}`

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim()
  } catch {
    throw new Error('set GITHUB_TOKEN or sign in with gh')
  }
}

async function graphql(variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { 'authorization': `bearer ${token()}`, 'content-type': 'application/json', 'user-agent': 'nebla-site-roadmap-sync' },
    body: JSON.stringify({ query: QUERY, variables })
  })
  const json = await res.json()
  if (!res.ok || json.errors) throw new Error(`GitHub: ${res.status} ${JSON.stringify(json.errors ?? json)}`)
  const project = json.data?.organization?.projectV2
  if (!project) throw new Error('roadmap board not found, or the token cannot read it')
  return project
}

// Turns the board's raw items into the page's data: only fields the page shows, nothing from private repositories.
export function normalize(project, items) {
  const options = name => project.fields.nodes.find(f => f?.name === name)?.options.map(o => o.name) ?? []
  const releases = options('Release')
  const statuses = options('Status')
  const rows = items
    .filter(i => !i.isArchived && i.content && !i.content.repository?.isPrivate && i.content.__typename !== 'Redacted')
    .map((i) => {
      const field = name => i.fieldValues.nodes.find(v => v?.field?.name === name)?.name ?? null
      return {
        title: i.content.title.trim(),
        body: (i.content.body ?? '').trim(),
        url: i.content.url ?? null,
        status: field('Status') ?? 'Planned',
        release: field('Release') ?? 'Later',
        area: field('Area'),
        size: field('Size')
      }
    })
  // Unknown values sort last.
  const rank = (list, v) => list.includes(v) ? list.indexOf(v) : list.length
  // Releases in board order. Within one, shipped work first and planned work last (the board lists Planned first),
  // then board order.
  const order = rows.map((r, i) => ({ r, i })).sort((a, b) =>
    rank(releases, a.r.release) - rank(releases, b.r.release)
    || rank(statuses, b.r.status) - rank(statuses, a.r.status)
    || a.i - b.i)
  return { board: project.url, releases, statuses, items: order.map(o => o.r) }
}

export async function fetchRoadmap() {
  const items = []
  let after = null
  let project
  do {
    project = await graphql({ ...BOARD, after })
    items.push(...project.items.nodes)
    after = project.items.pageInfo.hasNextPage ? project.items.pageInfo.endCursor : null
  } while (after)
  return normalize(project, items)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const data = await fetchRoadmap()
  if (!data.items.length) throw new Error('the board returned no items; refusing to empty the roadmap')
  const next = JSON.stringify(data, null, 2) + '\n'
  const prev = (() => { try { return readFileSync(OUT, 'utf8') } catch { return '' } })()
  if (prev === next) console.log(`roadmap: unchanged (${data.items.length} items)`)
  else {
    writeFileSync(OUT, next)
    console.log(`roadmap: wrote ${data.items.length} items`)
  }
}
