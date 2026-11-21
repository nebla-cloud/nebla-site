import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { normalize } from '../scripts/sync-roadmap.mjs'

const project = {
  url: 'https://github.com/orgs/nebla-cloud/projects/1',
  fields: { nodes: [
    {},
    { name: 'Status', options: [{ name: 'Planned' }, { name: 'In design' }, { name: 'In progress' }, { name: 'Shipped' }] },
    { name: 'Release', options: [{ name: 'v0.1' }, { name: 'v0.2' }, { name: 'Later' }] }
  ] }
}
const item = (title, status, release, extra = {}) => ({
  isArchived: false,
  content: { __typename: 'DraftIssue', title, body: ` ${title} body `, ...extra },
  fieldValues: { nodes: [{}, { name: status, field: { name: 'Status' } }, { name: release, field: { name: 'Release' } }, { name: 'Compute', field: { name: 'Area' } }] }
})

test('orders by release, then shipped before planned, then board order', () => {
  const data = normalize(project, [
    item('later', 'Planned', 'Later'),
    item('planned', 'Planned', 'v0.2'),
    item('building', 'In progress', 'v0.2'),
    item('shipped', 'Shipped', 'v0.1'),
    item('designing', 'In design', 'v0.2')
  ])
  assert.deepEqual(data.items.map(i => i.title), ['shipped', 'building', 'designing', 'planned', 'later'])
  assert.deepEqual(data.items[0], { title: 'shipped', body: 'shipped body', url: null, status: 'Shipped', release: 'v0.1', area: 'Compute', size: null })
})

test('drops archived items and anything from a private repository', () => {
  const archived = { ...item('archived', 'Planned', 'v0.1'), isArchived: true }
  const priv = item('private', 'Planned', 'v0.1', { __typename: 'Issue', url: 'https://github.com/x/y/issues/1', repository: { isPrivate: true } })
  const pub = item('public', 'Planned', 'v0.1', { __typename: 'Issue', url: 'https://github.com/x/z/issues/2', repository: { isPrivate: false } })
  const data = normalize(project, [archived, priv, pub, { isArchived: false, content: null, fieldValues: { nodes: [] } }])
  assert.deepEqual(data.items.map(i => [i.title, i.url]), [['public', 'https://github.com/x/z/issues/2']])
})

test('the committed roadmap uses only the board\'s releases and statuses', () => {
  const data = JSON.parse(readFileSync(new URL('../app/data/roadmap.json', import.meta.url), 'utf8'))
  assert.ok(data.items.length > 0)
  for (const i of data.items) {
    assert.ok(data.releases.includes(i.release), i.title)
    assert.ok(data.statuses.includes(i.status), i.title)
    assert.ok(i.title)
  }
})
