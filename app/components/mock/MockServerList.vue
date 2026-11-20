<script setup lang="ts">
type Server = { name: string, image: string, type: string, ip: string, status: 'running' | 'stopped' }

withDefaults(defineProps<{ servers?: Server[] }>(), {
  servers: () => [
    { name: 'web1', image: 'debian-13', type: 'small-2', ip: '203.0.113.10', status: 'running' },
    { name: 'db1', image: 'ubuntu-24.04', type: 'medium-4', ip: '203.0.113.11', status: 'running' },
    { name: 'runner', image: 'rocky-10', type: 'small-2', ip: '203.0.113.14', status: 'running' },
    { name: 'test', image: 'debian-13', type: 'small-2', ip: '203.0.113.15', status: 'stopped' }
  ]
})
</script>

<template>
  <MockWindow title="panel.example.com / Home lab / Servers">
    <p class="sr-only">Mockup of the Nebla server list with each server's image, type, IP address and status.</p>
    <div aria-hidden="true" class="flex">
      <nav class="hidden w-36 shrink-0 space-y-0.5 border-r border-default bg-muted p-3 text-toned sm:block">
        <div class="px-2 pb-2 font-bold text-highlighted">Home lab</div>
        <div class="rounded-md bg-accented px-2 py-1.5 font-medium text-highlighted">Servers</div>
        <div class="px-2 py-1.5">SSH keys</div>
        <div class="px-2 py-1.5">Images</div>
        <div class="px-2 py-1.5">API tokens</div>
        <div class="px-2 py-1.5">Members</div>
      </nav>
      <div class="min-w-0 flex-1 p-4">
        <div class="mb-3 flex items-center justify-between">
          <span class="text-base font-bold text-highlighted">Servers</span>
          <span class="rounded-md bg-inverted px-3 py-1.5 text-xs font-semibold text-inverted">Add server</span>
        </div>
        <div v-for="s in servers" :key="s.name" class="grid grid-cols-[12px_1fr_auto] items-center gap-3 border-t border-default py-2.5 sm:grid-cols-[12px_1fr_1fr_80px_110px]">
          <i class="size-2 rounded-full" :class="s.status === 'running' ? 'bg-success' : 'bg-accented'" />
          <span class="font-semibold text-highlighted">{{ s.name }}</span>
          <span class="hidden text-muted sm:block">{{ s.image }}</span>
          <span class="hidden text-muted sm:block">{{ s.type }}</span>
          <span class="text-right text-muted tabular-nums">{{ s.status === 'running' ? s.ip : 'stopped' }}</span>
        </div>
      </div>
    </div>
  </MockWindow>
</template>
