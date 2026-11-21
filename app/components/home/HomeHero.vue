<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <section>
    <UContainer class="grid grid-cols-[minmax(0,1fr)] items-center gap-12 pt-16 pb-20 md:pt-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 lg:pb-28">
      <div>
        <h1 class="text-[clamp(2.6rem,6vw,4.5rem)] leading-[1.02] font-extrabold tracking-[-0.035em] text-highlighted">
          Your Proxmox, as a cloud console.
        </h1>
        <p class="mt-6 max-w-[36ch] text-lg leading-relaxed text-toned">
          Create, resize and rebuild VMs from a clean panel or the <code class="font-mono text-[0.92em] text-highlighted">nebla</code> CLI. Nebla runs as one container next to Proxmox and installs nothing on the host.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <UButton to="/docs/install" size="xl" label="Install with Docker" />
          <UButton :to="site.repo" target="_blank" size="xl" color="neutral" variant="outline" icon="i-simple-icons-github" label="View on GitHub" />
        </div>
        <p class="mt-6 text-sm text-muted">
          Open source under AGPL-3.0, with unlimited nodes.
        </p>
      </div>
      <div class="hero-enter">
        <PanelShot shot="create-server" priority />
      </div>
    </UContainer>
  </section>
</template>
