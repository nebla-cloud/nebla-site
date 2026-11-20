<script setup lang="ts">
defineProps<{ title: string, flip?: boolean }>()
</script>

<template>
  <div class="grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16">
    <div :class="flip ? 'lg:order-2' : ''">
      <h2 class="text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.12] font-bold tracking-[-0.025em] text-highlighted">{{ title }}</h2>
      <div class="mt-4 max-w-[52ch] space-y-3 leading-relaxed text-toned">
        <slot />
      </div>
    </div>
    <div class="min-w-0">
      <slot name="visual" />
    </div>
  </div>
</template>
