<script setup lang="ts">
const facts = [
  { title: 'AGPL-3.0', body: 'You can run and modify it, and changes to the core stay open.' },
  { title: 'Unlimited nodes', body: 'The free core has no cap on hosts or clusters.' },
  { title: 'Nothing held back', body: 'Every homelab feature is in the core. Only reseller tooling is paid.' }
]
</script>

<template>
  <section class="py-20 md:py-28">
    <UContainer>
      <p class="max-w-[24ch] text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-highlighted">
        The core is open source, and it stays that way.
      </p>
      <dl class="mt-12 grid gap-8 border-t border-default pt-8 sm:grid-cols-3">
        <div v-for="f in facts" :key="f.title">
          <dt class="font-bold text-highlighted">{{ f.title }}</dt>
          <dd class="mt-1 max-w-[32ch] leading-relaxed text-toned">{{ f.body }}</dd>
        </div>
      </dl>
      <ULink to="/open-source" class="mt-10 inline-block font-semibold text-highlighted underline decoration-accented underline-offset-4 hover:decoration-current">How the licence and the CLA work</ULink>
    </UContainer>
  </section>
</template>
