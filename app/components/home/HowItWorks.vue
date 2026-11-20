<script setup lang="ts">
const steps = [
  { title: 'Start the container', body: 'docker compose brings up Nebla and its Postgres database on any machine that can reach Proxmox, such as a small VM or a mini PC.', code: 'docker compose up -d' },
  { title: 'Connect Proxmox', body: 'Create an API token with Nebla\'s role and paste it into the admin area. Nebla works through the Proxmox API and never logs in over SSH or installs an agent.', code: 'pveum user token add nebla@pve panel --privsep 0' },
  { title: 'Create servers', body: 'Pick an image and a type, add your SSH key, and the server boots with cloud-init, a static IP and your key in place.', code: 'nebla server create --name web1' }
]
</script>

<template>
  <section class="py-20 md:py-28">
    <UContainer>
      <h2 class="max-w-[22ch] text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.1] font-bold tracking-[-0.025em] text-highlighted">
        From an empty VM to your first server in three steps
      </h2>
      <ol class="relative mt-14 grid grid-cols-[minmax(0,1fr)] gap-12 md:grid-cols-3 md:gap-10">
        <li v-for="(s, i) in steps" :key="s.title" class="relative pl-14 md:pl-0 md:pt-16">
          <span class="absolute top-0 left-0 grid size-10 place-items-center rounded-full border border-accented bg-default font-bold text-highlighted">{{ i + 1 }}</span>
          <span v-if="i < steps.length - 1" aria-hidden="true" class="absolute top-10 bottom-[-3rem] left-5 w-px bg-(--ui-border-accented) md:top-5 md:right-[-1.5rem] md:bottom-auto md:left-14 md:h-px md:w-auto" />
          <h3 class="text-xl font-bold tracking-[-0.01em] text-highlighted">{{ s.title }}</h3>
          <p class="mt-2 max-w-[38ch] leading-relaxed text-toned">{{ s.body }}</p>
          <code class="mt-4 inline-block max-w-full break-all rounded-md bg-elevated px-2.5 py-1 font-mono text-[13px] text-toned">{{ s.code }}</code>
        </li>
      </ol>
    </UContainer>
  </section>
</template>
