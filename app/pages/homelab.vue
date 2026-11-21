<script setup lang="ts">
usePageSeo('Nebla for homelabs', 'Run your own cloud console on the Proxmox box at home. One container, nothing installed on the host, one-click OS images, a CLI for your scripts, and no node limit.')

const lines = [
  { kind: 'cmd', text: 'nebla context create home' },
  { kind: 'out', text: 'Endpoint: https://nebla.home.arpa' },
  { kind: 'out', text: 'Token: ********' },
  { kind: 'cmd', text: 'nebla server create --name pihole \\\n    --type small-2 --image debian-13 --ssh-key laptop' },
  { kind: 'out', text: 'Server pihole is running at 192.0.2.40' },
  { kind: 'cmd', text: 'nebla server ssh pihole' }
] as const
</script>

<template>
  <div>
    <PageIntro title="A cloud console for the Proxmox box under your desk" lede="You already run Proxmox. Nebla gives you the part that makes a public cloud pleasant to use: pick an image, pick a size, get a server with your SSH key in it.">
      <UButton to="/install" size="xl" class="mt-8" label="Install Nebla" />
    </PageIntro>

    <UContainer class="divide-y divide-default">
      <FeatureRow title="Nothing new on the host">
        <p>Nebla runs as one container plus Postgres, on any machine that can reach Proxmox. A small VM on the same host works fine.</p>
        <p>It connects with an API token and a role you create once. Proxmox VE 8 and 9 are supported, and your existing VMs are left alone.</p>
        <template #visual>
          <PanelShot shot="create-server" />
        </template>
      </FeatureRow>

      <FeatureRow title="No VMIDs, storages or bridges" flip>
        <p>When you only want a Debian box for an afternoon, Nebla picks the node, the VMID, the disk storage and the IP for you. You choose an image and a size.</p>
        <p>Official images for Debian, Ubuntu, Rocky Linux, AlmaLinux and Fedora are one click away on Proxmox VE 8.4 or later.</p>
        <template #visual>
          <PanelShot shot="server-list" />
        </template>
      </FeatureRow>

      <FeatureRow title="Script it">
        <p>Every button in the panel has a CLI command and an API endpoint behind it. Make a read-write token for your automation and a read-only one for your dashboard.</p>
        <p>Install the CLI with <code class="font-mono text-[0.92em]">brew install nebla-cloud/tap/nebla</code> or grab a binary from GitHub Releases.</p>
        <template #visual>
          <TerminalSession :lines="[...lines]" />
        </template>
      </FeatureRow>
    </UContainer>

    <UContainer class="py-16">
      <p class="max-w-[30ch] text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-highlighted">
        Free and open source, with no limit on nodes.
      </p>
      <p class="mt-4 max-w-[56ch] leading-relaxed text-toned">
        Nebla's core is AGPL-3.0. Homelab users get the whole thing. The only paid part is a module for people who sell servers to customers.
      </p>
      <ULink to="/open-source" class="mt-6 inline-block font-semibold text-highlighted underline decoration-accented underline-offset-4 hover:decoration-current">About the licence</ULink>
    </UContainer>
  </div>
</template>
