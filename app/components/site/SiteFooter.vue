<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <footer class="border-t border-default mt-24">
    <UContainer class="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
      <div class="max-w-xs">
        <NeblaLogo variant="lockup" class="h-6 w-auto" />
        <p class="mt-3 text-sm text-muted">
          An open-source cloud console for Proxmox VE. AGPL-3.0, free forever.
        </p>
      </div>
      <nav class="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3" aria-label="Footer">
        <ULink v-for="item in site.nav" :key="item.to" :to="item.to" class="text-muted hover:text-highlighted">
          {{ item.label }}
        </ULink>
        <ULink to="/open-source" class="text-muted hover:text-highlighted">Open source</ULink>
        <ULink :to="site.repo" target="_blank" class="text-muted hover:text-highlighted">GitHub</ULink>
        <ULink to="/privacy" class="text-muted hover:text-highlighted">Privacy</ULink>
      </nav>
    </UContainer>
    <UContainer class="pb-10 text-xs text-dimmed">
      {{ site.copyright }}. Proxmox is a trademark of its respective owner; Nebla is an independent project.
    </UContainer>
  </footer>
</template>
