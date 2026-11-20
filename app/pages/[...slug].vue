<script setup lang="ts">
const route = useRoute()
const path = route.path.replace(/\/$/, '') || '/'
const { data: page } = await useAsyncData(`page-${path}`, () => queryCollection('pages').path(path).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
usePageSeo(page.value.title, page.value.description)
</script>

<template>
  <div v-if="page">
    <UContainer class="pt-16 pb-24 md:pt-24">
      <article class="prose-page max-w-[68ch]">
        <ContentRenderer :value="page" />
      </article>
    </UContainer>
  </div>
</template>
