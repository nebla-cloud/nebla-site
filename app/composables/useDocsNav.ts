export const DOCS_GROUPS = ['Get started', 'Use Nebla', 'Reference'] as const

// Every docs page in sidebar order, grouped for the sidebar.
export async function useDocsNav() {
  const { data } = await useAsyncData('docs-nav', () =>
    queryCollection('docs').select('path', 'title', 'group', 'stem').order('stem', 'ASC').all()
  )
  const pages = computed(() => data.value ?? [])
  const groups = computed(() => DOCS_GROUPS.map(g => ({ label: g, pages: pages.value.filter(p => p.group === g) })))
  return { pages, groups }
}
