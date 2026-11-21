<script setup lang="ts">
defineProps<{ groups: { label: string, pages: { path: string, title: string }[] }[] }>()
const route = useRoute()
const current = computed(() => route.path.replace(/\/$/, '') || '/')
</script>

<template>
  <nav aria-label="Docs" class="space-y-7 text-sm">
    <div v-for="g in groups" :key="g.label">
      <p class="mb-2 font-semibold text-highlighted">{{ g.label }}</p>
      <ul class="space-y-0.5 border-l border-default">
        <li v-for="p in g.pages" :key="p.path">
          <NuxtLink
            :to="p.path"
            :aria-current="current === p.path ? 'page' : undefined"
            class="-ml-px block border-l py-1.5 pl-4 transition-colors"
            :class="current === p.path ? 'border-(--ui-text-highlighted) font-medium text-highlighted' : 'border-transparent text-toned hover:border-accented hover:text-highlighted'"
          >
            {{ p.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
