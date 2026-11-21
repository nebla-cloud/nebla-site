<script setup lang="ts">
import { site } from '~/data/site'

const open = ref(false)
const route = useRoute()
watch(() => route.path, () => { open.value = false })
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-default/60 bg-default/80 backdrop-blur">
    <UContainer class="flex h-16 items-center gap-6">
      <NuxtLink to="/" class="shrink-0" aria-label="Nebla home">
        <NeblaLogo variant="lockup" class="h-7 w-auto" />
      </NuxtLink>
      <nav class="hidden md:flex items-center gap-1 text-sm" aria-label="Main">
        <ULink
          v-for="item in site.nav"
          :key="item.to"
          :to="item.to"
          class="rounded-md px-3 py-2 text-toned hover:text-highlighted"
          active-class="text-highlighted font-medium"
        >
          {{ item.label }}
        </ULink>
      </nav>
      <div class="ml-auto flex items-center gap-1">
        <UButton
          v-for="c in site.community"
          :key="c.label"
          :to="c.to"
          target="_blank"
          :icon="c.icon"
          color="neutral"
          variant="ghost"
          :aria-label="`Nebla on ${c.label}`"
          :class="c.label === 'Discord' ? '' : 'hidden lg:inline-flex'"
        />
        <UButton :to="site.repo" target="_blank" icon="i-simple-icons-github" color="neutral" variant="ghost" aria-label="Nebla on GitHub" />
        <UColorModeButton color="neutral" variant="ghost" />
        <UButton class="md:hidden" icon="i-lucide-menu" color="neutral" variant="ghost" :aria-expanded="open" aria-label="Menu" @click="open = !open" />
      </div>
    </UContainer>
    <nav v-if="open" class="md:hidden border-t border-default" aria-label="Mobile">
      <UContainer class="flex flex-col py-2">
        <ULink v-for="item in site.nav" :key="item.to" :to="item.to" class="py-3 text-toned" active-class="text-highlighted font-medium">
          {{ item.label }}
        </ULink>
        <div class="mt-2 flex flex-wrap gap-x-6 gap-y-2 border-t border-default pt-4 pb-2 text-sm">
          <ULink v-for="c in site.community" :key="c.label" :to="c.to" target="_blank" class="inline-flex items-center gap-2 text-toned hover:text-highlighted">
            <UIcon :name="c.icon" class="size-4" />{{ c.label }}
          </ULink>
        </div>
      </UContainer>
    </nav>
  </header>
</template>
