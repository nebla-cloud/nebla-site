<script setup lang="ts">
const lines = [
  { kind: 'cmd', text: 'nebla server create --name web1 \\\n    --type small-2 --image debian-13 --ssh-key laptop' },
  { kind: 'out', text: 'Waiting for create_server (812) ... done' },
  { kind: 'out', text: 'Server 42 created' },
  { kind: 'out', text: 'IPv4: 203.0.113.10' },
  { kind: 'cmd', text: 'nebla server list' },
  { kind: 'out', text: 'ID   NAME   STATUS    IPV4           IPV6   TYPE      IMAGE       LOCATION   AGE' },
  { kind: 'out', text: '42   web1   running   203.0.113.10   -      small-2   debian-13   home       1m' }
] as const
</script>

<template>
  <section class="border-y border-default bg-muted/60 py-20 md:py-28">
    <UContainer>
      <div class="max-w-[60ch]">
        <h2 class="text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.1] font-bold tracking-[-0.025em] text-highlighted">
          Click it or type it
        </h2>
        <p class="mt-4 text-lg leading-relaxed text-toned">
          The panel and the CLI sit on the same REST API. Anything you do in the browser you can script, and every change comes back as an action you can wait on.
        </p>
      </div>
      <div class="mt-12 grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-2">
        <TerminalSession :lines="[...lines]" label="Your terminal" />
        <PanelShot shot="server-detail" />
      </div>
    </UContainer>
  </section>
</template>
