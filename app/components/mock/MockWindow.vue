<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-default bg-default shadow-[0_1px_0_var(--ui-border),0_24px_60px_-28px_rgb(21_24_29/0.35)] text-[13px] text-default">
    <div v-if="title" class="flex items-center gap-2 border-b border-default px-4 py-2.5 text-xs text-muted">
      <span class="flex gap-1.5" aria-hidden="true"><i class="size-2.5 rounded-full bg-accented" /><i class="size-2.5 rounded-full bg-accented" /><i class="size-2.5 rounded-full bg-accented" /></span>
      <span class="ml-2 truncate">{{ title }}</span>
    </div>
    <slot />
  </div>
</template>
