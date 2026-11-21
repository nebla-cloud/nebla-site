<script setup lang="ts">
const route = useRoute()
const path = route.path.replace(/\/$/, '') || '/docs'
const { data: page } = await useAsyncData(`docs-${path}`, () => queryCollection('docs').path(path).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
usePageSeo(path === '/docs' ? 'Nebla docs' : `${page.value.title} | Nebla docs`, page.value.description)

const { pages, groups } = await useDocsNav()
const index = computed(() => pages.value.findIndex(p => p.path === path))
const prev = computed(() => pages.value[index.value - 1])
const next = computed(() => pages.value[index.value + 1])
const toc = computed(() => page.value?.body?.toc?.links ?? [])

const menuOpen = ref(false)
watch(() => route.path, () => { menuOpen.value = false })
</script>

<template>
  <UContainer v-if="page" class="pt-8 pb-8 lg:pt-12">
    <div class="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[13rem_minmax(0,1fr)_12rem]">
      <aside class="hidden lg:block">
        <div class="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pb-8">
          <DocsNav :groups="groups" />
        </div>
      </aside>

      <div class="min-w-0">
        <div class="lg:hidden">
          <UButton
            color="neutral"
            variant="outline"
            block
            class="justify-between"
            :trailing-icon="menuOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            :aria-expanded="menuOpen"
            aria-controls="docs-menu"
            @click="menuOpen = !menuOpen"
          >
            <span>Docs: <span class="font-normal">{{ page.title }}</span></span>
          </UButton>
          <div v-show="menuOpen" id="docs-menu" class="mt-3 rounded-lg border border-default p-5">
            <DocsNav :groups="groups" />
          </div>
        </div>

        <article class="prose-page prose-docs mt-8 max-w-[72ch] lg:mt-0">
          <p class="mb-2 text-sm font-medium text-muted">{{ page.group }}</p>
          <ContentRenderer :value="page" />
        </article>

        <nav aria-label="Previous and next page" class="mt-16 grid max-w-[72ch] gap-4 border-t border-default pt-8 sm:grid-cols-2">
          <NuxtLink v-if="prev" :to="prev.path" class="group rounded-lg border border-default p-4 hover:border-accented">
            <span class="flex items-center gap-1 text-sm text-muted"><UIcon name="i-lucide-chevron-left" class="size-4" />Previous</span>
            <span class="mt-1 block font-semibold text-highlighted">{{ prev.title }}</span>
          </NuxtLink>
          <span v-else class="hidden sm:block" />
          <NuxtLink v-if="next" :to="next.path" class="group rounded-lg border border-default p-4 text-right hover:border-accented">
            <span class="flex items-center justify-end gap-1 text-sm text-muted">Next<UIcon name="i-lucide-chevron-right" class="size-4" /></span>
            <span class="mt-1 block font-semibold text-highlighted">{{ next.title }}</span>
          </NuxtLink>
        </nav>
      </div>

      <aside v-if="toc.length" class="hidden xl:block">
        <div class="sticky top-24 text-sm">
          <p class="mb-3 font-semibold text-highlighted">On this page</p>
          <ul class="space-y-2">
            <li v-for="l in toc" :key="l.id">
              <a :href="`#${l.id}`" class="text-toned hover:text-highlighted">{{ l.text }}</a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </UContainer>
</template>
