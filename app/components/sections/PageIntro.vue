<script setup lang="ts">
defineProps<{ title: string, lede: string, glow?: boolean }>()
</script>

<template>
  <section :class="glow ? 'aurora-glow' : ''">
    <UContainer class="pt-16 pb-12 md:pt-24 md:pb-16">
      <h1 class="max-w-[20ch] text-[clamp(2.4rem,5.2vw,4rem)] leading-[1.04] font-extrabold tracking-[-0.035em] text-highlighted">
        {{ title }}
      </h1>
      <p class="mt-6 max-w-[56ch] text-lg leading-relaxed text-toned">
        {{ lede }}
      </p>
      <slot />
    </UContainer>
  </section>
</template>
