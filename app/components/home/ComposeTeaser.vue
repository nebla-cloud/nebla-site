<script setup lang="ts">
const lines = [
  { kind: 'cmd', text: 'mkdir nebla && cd nebla' },
  { kind: 'out', text: '# add compose.yaml and .env from the install guide' },
  { kind: 'cmd', text: 'docker compose up -d' },
  { kind: 'out', text: '✔ Container nebla-postgres-1  Healthy' },
  { kind: 'out', text: '✔ Container nebla-panel-1     Started' },
  { kind: 'cmd', text: 'open http://localhost:8080' }
] as const
</script>

<template>
  <section class="pb-8">
    <UContainer>
      <div class="grid grid-cols-[minmax(0,1fr)] items-center gap-10 rounded-2xl border border-default p-6 sm:p-8 md:p-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]">
      <div>
        <h2 class="text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.1] font-bold tracking-[-0.025em] text-highlighted">
          Try it on your own hardware
        </h2>
        <p class="mt-4 max-w-[40ch] text-lg leading-relaxed text-toned">
          Nebla needs Docker, a Proxmox VE 8 or 9 host, and a few minutes. The install guide covers Compose, the first admin account and connecting Proxmox.
        </p>
        <UButton to="/docs/install" size="lg" class="mt-6" label="Read the install guide" />
      </div>
      <TerminalSession :lines="[...lines]" label="Any Linux box with Docker" />
      </div>
    </UContainer>
  </section>
</template>
