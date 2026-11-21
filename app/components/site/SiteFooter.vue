<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <footer class="border-t border-default mt-24">
    <UContainer class="flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
      <div class="max-w-xs">
        <NeblaLogo variant="lockup" class="h-6 w-auto" />
        <p class="mt-3 text-sm text-muted">
          An open-source cloud console for Proxmox VE. AGPL-3.0, free forever.
        </p>
        <div class="mt-5 flex items-center gap-1">
          <UButton
            v-for="c in site.community"
            :key="c.label"
            :to="c.to"
            target="_blank"
            :icon="c.icon"
            color="neutral"
            variant="ghost"
            :aria-label="`Nebla on ${c.label}`"
          />
          <UButton :to="site.repo" target="_blank" icon="i-simple-icons-github" color="neutral" variant="ghost" aria-label="Nebla on GitHub" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-x-12 gap-y-8 text-sm sm:grid-cols-3">
        <nav aria-label="Product" class="flex flex-col gap-2">
          <p class="font-semibold text-highlighted">Product</p>
          <ULink v-for="item in site.nav" :key="item.to" :to="item.to" class="text-muted hover:text-highlighted">
            {{ item.label }}
          </ULink>
        </nav>
        <nav aria-label="Get started" class="flex flex-col gap-2">
          <p class="font-semibold text-highlighted">Get started</p>
          <ULink to="/docs/install" class="text-muted hover:text-highlighted">Install</ULink>
          <ULink to="/docs/proxmox" class="text-muted hover:text-highlighted">Connect Proxmox</ULink>
          <ULink to="/docs/cli" class="text-muted hover:text-highlighted">CLI</ULink>
          <ULink to="/docs/api" class="text-muted hover:text-highlighted">API</ULink>
        </nav>
        <nav aria-label="Project" class="flex flex-col gap-2">
          <p class="font-semibold text-highlighted">Community</p>
          <ULink v-for="c in site.community" :key="c.label" :to="c.to" target="_blank" class="text-muted hover:text-highlighted">
            {{ c.label }}
          </ULink>
          <ULink :to="site.repo" target="_blank" class="text-muted hover:text-highlighted">GitHub</ULink>
          <ULink to="/open-source" class="text-muted hover:text-highlighted">Open source</ULink>
          <ULink to="/privacy" class="text-muted hover:text-highlighted">Privacy</ULink>
        </nav>
      </div>
    </UContainer>
    <UContainer class="pb-10 text-xs text-muted">
      {{ site.copyright }}. Proxmox is a trademark of its respective owner; Nebla is an independent project.
    </UContainer>
  </footer>
</template>
