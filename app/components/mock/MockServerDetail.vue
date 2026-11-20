<script setup lang="ts">
const cpu = [12, 18, 15, 22, 30, 26, 19, 24, 41, 35, 28, 22, 26, 31, 24, 20, 23, 27, 22, 18]
const points = cpu.map((v, i) => `${(i / (cpu.length - 1)) * 300},${60 - v}`).join(' ')
</script>

<template>
  <MockWindow title="panel.example.com / Home lab / Servers / web1">
    <p class="sr-only">Mockup of the Nebla server page for web1: running, Debian 13, small-2, with its IP addresses, a CPU graph and power actions.</p>
    <div aria-hidden="true" class="space-y-4 p-5">
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-lg font-bold text-highlighted">web1</span>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-0.5 text-xs font-medium text-success"><i class="size-1.5 rounded-full bg-success" />Running</span>
        <span class="ml-auto flex gap-1.5 text-xs">
          <span class="rounded-md border border-default px-2.5 py-1 text-toned">Console</span>
          <span class="rounded-md border border-default px-2.5 py-1 text-toned">Reboot</span>
          <span class="rounded-md border border-default px-2.5 py-1 text-toned">Power off</span>
        </span>
      </div>
      <dl class="grid grid-cols-2 gap-x-6 gap-y-2 @lg:grid-cols-4">
        <div><dt class="text-xs text-muted">Image</dt><dd class="font-medium text-highlighted">Debian 13</dd></div>
        <div><dt class="text-xs text-muted">Type</dt><dd class="font-medium text-highlighted">small-2</dd></div>
        <div><dt class="text-xs text-muted">IPv4</dt><dd class="font-medium text-highlighted tabular-nums">203.0.113.10</dd></div>
        <div><dt class="text-xs text-muted">IPv6</dt><dd class="font-medium text-highlighted">2001:db8::10</dd></div>
      </dl>
      <div class="rounded-lg border border-default p-3">
        <div class="mb-1 flex justify-between text-xs text-muted"><span>CPU, last hour</span><span>22%</span></div>
        <svg viewBox="0 0 300 60" class="h-14 w-full" preserveAspectRatio="none">
          <polyline :points="points" fill="none" stroke="currentColor" class="text-toned" stroke-width="1.5" vector-effect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  </MockWindow>
</template>
