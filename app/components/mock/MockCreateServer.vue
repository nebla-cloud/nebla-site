<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const images = ['Debian 13', 'Ubuntu 24.04', 'Rocky Linux 10', 'AlmaLinux 10']
const types = [
  { name: 'small-2', spec: '2 vCPU, 4 GB, 40 GB' },
  { name: 'medium-4', spec: '4 vCPU, 8 GB, 80 GB' },
  { name: 'large-8', spec: '8 vCPU, 16 GB, 160 GB' }
]
</script>

<template>
  <MockWindow title="panel.example.com / Home lab / Servers / New">
    <p class="sr-only">Mockup of the Nebla create-server page: pick a location, image and server type, add an SSH key, name it and create it.</p>
    <div aria-hidden="true" class="space-y-5 p-5">
      <div class="flex items-baseline justify-between">
        <span class="text-base font-bold text-highlighted">Create server</span>
        <span class="text-xs text-muted">Project: Home lab</span>
      </div>
      <section v-if="!compact">
        <div class="mb-2 text-xs text-muted">Location</div>
        <div class="flex flex-wrap gap-2">
          <span class="rounded-md border-2 border-inverted px-3 py-1.5 font-medium text-highlighted">home</span>
          <span class="rounded-md border border-default px-3 py-1.5 text-toned">rack-2</span>
        </div>
      </section>
      <section>
        <div class="mb-2 text-xs text-muted">Image</div>
        <div class="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
          <span v-for="(img, i) in images" :key="img" class="rounded-md px-3 py-2" :class="i === 0 ? 'border-2 border-inverted font-medium text-highlighted' : 'border border-default text-toned'">{{ img }}</span>
        </div>
      </section>
      <section>
        <div class="mb-2 text-xs text-muted">Type</div>
        <div class="divide-y divide-default rounded-md border border-default">
          <div v-for="(t, i) in types" :key="t.name" class="flex items-center justify-between px-3 py-2" :class="i === 1 ? 'bg-elevated' : ''">
            <span class="flex items-center gap-2">
              <i class="size-3.5 rounded-full border" :class="i === 1 ? 'border-4 border-inverted' : 'border-accented'" />
              <span class="font-medium text-highlighted">{{ t.name }}</span>
            </span>
            <span class="text-muted">{{ t.spec }}</span>
          </div>
        </div>
      </section>
      <section v-if="!compact" class="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
        <div>
          <div class="mb-2 text-xs text-muted">SSH key</div>
          <span class="inline-flex rounded-md border border-default px-3 py-1.5 text-toned">laptop-ed25519</span>
        </div>
        <div>
          <div class="mb-2 text-xs text-muted">Name</div>
          <span class="block rounded-md border border-default px-3 py-1.5 font-medium text-highlighted">web2</span>
        </div>
      </section>
      <div class="flex items-center justify-between gap-3 pt-1">
        <span class="text-xs text-muted">IPv4 from pool 203.0.113.0/24</span>
        <span class="rounded-md bg-inverted px-4 py-2 font-semibold text-inverted">Create server</span>
      </div>
    </div>
  </MockWindow>
</template>
