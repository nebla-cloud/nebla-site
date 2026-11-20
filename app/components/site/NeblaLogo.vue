<script setup lang="ts">
import lockup from '../../../brand/out/lockup-current.svg?raw'
import mark from '../../../brand/out/mark.svg?raw'

const props = withDefaults(defineProps<{ variant?: 'mark' | 'lockup', tone?: 'auto' | 'light' | 'dark' }>(), { variant: 'lockup', tone: 'auto' })

const id = useId()
const svg = computed(() => (props.variant === 'mark' ? mark : lockup)
  .replaceAll('nebla-arch', `nebla-arch-${id}`)
  .replace(/ width="[\d.]+" height="[\d.]+"/, ' class="h-full w-auto" aria-hidden="true" focusable="false"'))
const toneClass = computed(() => ({ auto: 'text-highlighted', light: 'text-ink-950', dark: 'text-[#F4F6F8]' })[props.tone])
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- build-time brand svg -->
  <span class="inline-flex" :class="toneClass" role="img" aria-label="Nebla" v-html="svg" />
</template>
