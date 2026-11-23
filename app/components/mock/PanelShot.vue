<script setup lang="ts">
// Real screenshots of the panel (light and dark), captured from the UI harness on demo data.
// Regenerate them with `pnpm capture:panel` when the panel's look changes, and update the heights here.
const SHOTS = {
  'create-server': { title: 'panel.example.com / Home lab / Servers / New', width: 1600, height: 1431, alt: 'The Nebla create-server page: location, image, type, networking, SSH key and firewalls chosen step by step, with a summary and project quota beside them.' },
  'server-detail': { title: 'panel.example.com / Home lab / Servers / web-1', width: 1600, height: 1139, alt: 'The Nebla server page for web-1: running Debian 13 on medium-4, with CPU, network and disk graphs, its addresses, a floating IP and recent activity.' },
  'server-list': { title: 'panel.example.com / Home lab / Servers', width: 1600, height: 979, alt: 'The Nebla server list for the Home lab project: six servers, five running and one off, with their labels, image, type, IPv4 address, location and CPU sparkline.' }
} as const

const props = withDefaults(defineProps<{ shot: keyof typeof SHOTS, priority?: boolean }>(), { priority: false })
const s = computed(() => SHOTS[props.shot])
</script>

<template>
  <MockWindow :title="s.title">
    <img :src="`/screens/${shot}-light.webp`" :alt="s.alt" :width="s.width" :height="s.height" :loading="priority ? 'eager' : 'lazy'" :fetchpriority="priority ? 'high' : 'auto'" decoding="async" class="block h-auto w-full dark:hidden">
    <img :src="`/screens/${shot}-dark.webp`" :alt="s.alt" :width="s.width" :height="s.height" :loading="priority ? 'eager' : 'lazy'" decoding="async" class="hidden h-auto w-full dark:block">
  </MockWindow>
</template>
