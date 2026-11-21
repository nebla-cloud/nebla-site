<script setup lang="ts">
import roadmap from '~/data/roadmap.json'
import { site } from '~/data/site'

usePageSeo('Roadmap | Nebla', 'What has shipped in Nebla, what is being built and what comes next, synced from the public roadmap board on GitHub.')

type Item = (typeof roadmap.items)[number]

const STATUS: Record<string, { icon: string, label: string }> = {
  'Shipped': { icon: 'i-lucide-check', label: 'Shipped' },
  'In progress': { icon: 'i-lucide-loader-circle', label: 'In progress' },
  'In design': { icon: 'i-lucide-pencil-ruler', label: 'In design' },
  'Planned': { icon: 'i-lucide-circle-dashed', label: 'Planned' }
}
const status = (s: string) => STATUS[s] ?? { icon: 'i-lucide-circle-dashed', label: s }

const releases = roadmap.releases
  .map((name) => {
    const items = roadmap.items.filter(i => i.release === name)
    const shipped = items.filter(i => i.status === 'Shipped').length
    const started = items.some(i => i.status === 'Shipped' || i.status === 'In progress')
    const state = name === 'Later' ? 'No version yet' : shipped === items.length ? 'Done' : started ? 'In progress' : 'Planned'
    return { name, items, shipped, state }
  })
  .filter(r => r.items.length)
// What is being built and what comes next lead; finished releases follow, newest first.
const open = releases.filter(r => r.state !== 'Done')
const done = releases.filter(r => r.state === 'Done').reverse()
const ordered = [...open, ...done]

// The board's text uses `backticks` for commands; show those as code.
const parts = (text: string) => text.split(/(`[^`]+`)/).filter(Boolean).map(p => p.startsWith('`') ? { code: true, text: p.slice(1, -1) } : { code: false, text: p })
const meta = (i: Item) => [i.area, i.size && `size ${i.size}`].filter(Boolean).join(' · ')
</script>

<template>
  <div>
    <PageIntro title="Roadmap" lede="What has shipped, what is being built and what comes next. This page follows the roadmap board on GitHub and updates once a day. Plans can change.">
      <div class="mt-8 flex flex-wrap gap-3">
        <UButton :to="roadmap.board" target="_blank" size="lg" color="neutral" variant="outline" icon="i-simple-icons-github" label="Roadmap board on GitHub" />
        <UButton :to="site.community[0].to" target="_blank" size="lg" color="neutral" variant="ghost" icon="i-simple-icons-discord" label="Suggest something on Discord" />
      </div>
      <nav aria-label="Releases" class="mt-10 flex flex-wrap gap-2 text-sm">
        <a v-for="r in ordered" :key="r.name" :href="`#release-${r.name}`" class="rounded-full border border-default px-3 py-1 text-toned hover:border-accented hover:text-highlighted">
          {{ r.name }}<span class="sr-only">, {{ r.state }}</span>
        </a>
      </nav>
      <ul class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-toned" aria-label="Status key">
        <li v-for="(s, key) in STATUS" :key="key" class="inline-flex items-center gap-1.5">
          <UIcon :name="s.icon" class="size-4" />{{ s.label }}
        </li>
      </ul>
    </PageIntro>

    <UContainer class="pb-8">
      <section
        v-for="r in ordered"
        :key="r.name"
        :aria-labelledby="`release-${r.name}`"
        class="grid grid-cols-[minmax(0,1fr)] gap-6 border-t border-default py-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16"
      >
        <div>
          <div class="lg:sticky lg:top-24">
            <h2 :id="`release-${r.name}`" class="scroll-mt-24 text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.12] font-bold tracking-[-0.025em] text-highlighted">
              {{ r.name }}
            </h2>
            <span v-if="r.state === 'In progress'" aria-hidden="true" class="roadmap-accent mt-3 block h-0.5 w-12 rounded-full" />
            <p class="mt-3 font-medium text-highlighted">{{ r.state }}</p>
            <p class="mt-1 text-sm text-toned">{{ r.shipped }} of {{ r.items.length }} shipped</p>
          </div>
        </div>
        <ul class="divide-y divide-default">
          <li v-for="i in r.items" :key="i.title" class="grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-2 py-5 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div class="min-w-0">
              <h3 class="font-bold text-highlighted">
                <ULink v-if="i.url" :to="i.url" target="_blank" class="underline decoration-accented underline-offset-4 hover:decoration-current">{{ i.title }}</ULink>
                <template v-else>{{ i.title }}</template>
              </h3>
              <p v-if="i.body" class="mt-1 max-w-[64ch] leading-relaxed text-toned">
                <template v-for="(p, n) in parts(i.body)" :key="n">
                  <code v-if="p.code" class="font-mono text-[0.92em] text-highlighted">{{ p.text }}</code>
                  <template v-else>{{ p.text }}</template>
                </template>
              </p>
              <p v-if="meta(i)" class="mt-2 text-sm text-toned">{{ meta(i) }}</p>
            </div>
            <p class="inline-flex h-fit items-center gap-1.5 self-start justify-self-start rounded-full border border-default px-2.5 py-0.5 text-sm whitespace-nowrap text-highlighted sm:justify-self-end">
              <UIcon :name="status(i.status).icon" class="size-4" />{{ status(i.status).label }}
            </p>
          </li>
        </ul>
      </section>
    </UContainer>
  </div>
</template>

<style scoped>
.roadmap-accent {
  background: linear-gradient(90deg, var(--color-mint-deep), var(--color-sky-deep), var(--color-rose-deep));
}
</style>
