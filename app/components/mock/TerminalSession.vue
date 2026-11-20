<script setup lang="ts">
defineProps<{ lines: { kind: 'cmd' | 'out', text: string }[], label?: string }>()
</script>

<template>
  <figure class="overflow-hidden rounded-xl bg-ink-950 text-[13px] leading-relaxed text-ink-100 shadow-[0_24px_60px_-28px_rgb(21_24_29/0.5)] ring-1 ring-ink-800">
    <figcaption class="border-b border-ink-800 px-4 py-2.5 text-xs text-ink-400">{{ label ?? 'Terminal' }}</figcaption>
    <pre class="overflow-x-auto p-4 font-mono"><code><template v-for="(l, i) in lines" :key="i"><span v-if="l.kind === 'cmd'"><span class="select-none text-ink-500">$ </span>{{ l.text }}</span><span v-else class="text-ink-400">{{ l.text }}</span>
</template></code></pre>
  </figure>
</template>
