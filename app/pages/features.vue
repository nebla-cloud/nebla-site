<script setup lang="ts">
usePageSeo('Features | Nebla', 'Everything Nebla does on top of Proxmox VE: servers, OS images, SSH keys and cloud-init, IP pools with tenant isolation, projects and quotas, a REST API and a CLI.')

const imageLines = [
  { kind: 'cmd', text: 'nebla image list' },
  { kind: 'out', text: 'NAME            OS        LOCATIONS' },
  { kind: 'out', text: 'debian-13       debian    home, rack-2' },
  { kind: 'out', text: 'ubuntu-24.04    ubuntu    home, rack-2' },
  { kind: 'out', text: 'rocky-10        rocky     home' },
  { kind: 'out', text: 'fedora-42       fedora    home' }
] as const

const keyLines = [
  { kind: 'cmd', text: 'nebla ssh-key create --name laptop --public-key-from-file ~/.ssh/id_ed25519.pub' },
  { kind: 'out', text: 'SSH key laptop created' },
  { kind: 'cmd', text: 'nebla server create --name app1 --type small-2 --image ubuntu-24.04 \\\n    --ssh-key laptop --user-data-from-file cloud-init.yaml' },
  { kind: 'out', text: 'Server app1 is running at 203.0.113.21' }
] as const

const more = [
  { title: 'Server types', body: 'Admins define plans as vCPU, memory and disk, and can limit a plan to some locations. Users pick a plan, never a raw Proxmox setting.' },
  { title: 'Locations and many clusters', body: 'Each location is a Proxmox cluster or a standalone node. Nebla places each new server on the node with the most free capacity that has the image.' },
  { title: 'IP pools', body: 'Pools per location, with bridge, optional VLAN tag, CIDR, gateway and DNS. Each server gets a static IPv4 and an optional IPv6 through cloud-init, and they are freed on delete.' },
  { title: 'Tenant isolation', body: 'Every server\'s network card runs the Proxmox firewall with IP and MAC filtering, so one tenant cannot claim another tenant\'s address.' },
  { title: 'Projects, members and quotas', body: 'Members get owner, admin, member or read-only roles. Admins set per-project limits on servers, vCPU, memory, disk and IPs.' },
  { title: 'API tokens', body: 'Tokens belong to a project and are read-only or read-write, so a script only reaches the servers it should.' },
  { title: 'Actions', body: 'Every change returns an action with its status and progress. The panel shows it live and the CLI can wait for it to finish.' },
  { title: 'Stays in sync', body: 'A reconciler reads VM state from Proxmox, so changes made in the Proxmox UI still show up correctly in Nebla.' },
  { title: 'Accounts and sign-in', body: 'Local accounts with TOTP two-factor sign-in. The admin creates users or sends invite links. Open sign-up is off until the admin turns it on.' },
  { title: 'Admin area', body: 'Connect Proxmox clusters, then manage server types, images, IP pools, users and quotas from one place.' }
]

const next = ['Volumes, snapshots and backups', 'Private networks and firewalls', 'The reseller module', 'Load balancers and managed certificates']
</script>

<template>
  <div>
    <PageIntro title="What Nebla does" lede="Nebla turns Proxmox VE into a self-service cloud: projects, servers, images, SSH keys and API tokens, with a panel and a CLI on the same API." />

    <UContainer class="divide-y divide-default">
      <FeatureRow title="Servers, from create to delete">
        <p>Create a server in one page: location, image, type, IPs, SSH keys, optional cloud-init user data and a name.</p>
        <p>After that you can rename it, power it on, off, reboot, reset or shut it down, rebuild it from another image, change its type, and delete it.</p>
        <p>The web console opens in the browser. Nebla proxies it, so users never need Proxmox credentials or network access to the host.</p>
        <template #visual>
          <MockServerDetail />
        </template>
      </FeatureRow>

      <FeatureRow title="OS images in one click" flip>
        <p>Nebla ships a catalog of official cloud images for Debian, Ubuntu, Rocky Linux, AlmaLinux and Fedora. An admin enables an image for a location and Nebla downloads it through the Proxmox API and builds the template.</p>
        <p>This needs Proxmox VE 8.4 or later. You can also register your own cloud-init templates, which works on every supported version.</p>
        <template #visual>
          <TerminalSession :lines="[...imageLines]" />
        </template>
      </FeatureRow>

      <FeatureRow title="SSH keys and cloud-init">
        <p>Store SSH keys per project and pick them when you create a server. Nebla injects them with cloud-init along with the hostname and network settings.</p>
        <p>Add your own cloud-init user data to install packages or run setup scripts on first boot.</p>
        <template #visual>
          <TerminalSession :lines="[...keyLines]" />
        </template>
      </FeatureRow>
    </UContainer>

    <section class="border-y border-default bg-muted/60 py-20">
      <UContainer>
        <h2 class="text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.12] font-bold tracking-[-0.025em] text-highlighted">Built for more than one user</h2>
        <dl class="mt-10 grid grid-cols-[minmax(0,1fr)] gap-x-16 gap-y-8 md:grid-cols-2">
          <div v-for="m in more" :key="m.title" class="border-t border-default pt-4">
            <dt class="font-bold text-highlighted">{{ m.title }}</dt>
            <dd class="mt-1 max-w-[52ch] leading-relaxed text-toned">{{ m.body }}</dd>
          </div>
        </dl>
      </UContainer>
    </section>

    <UContainer class="grid grid-cols-[minmax(0,1fr)] gap-12 py-20 lg:grid-cols-2">
      <div>
        <h2 class="text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.12] font-bold tracking-[-0.025em] text-highlighted">An API first, then a panel and a CLI</h2>
        <p class="mt-4 max-w-[52ch] leading-relaxed text-toned">
          Nebla has a REST API at <code class="font-mono text-[0.92em]">/v1</code>, described by an OpenAPI spec. The CLI is generated from that spec, so it covers what the panel covers. It keeps contexts for each panel you use and prints tables, JSON or YAML.
        </p>
      </div>
      <div>
        <h2 class="text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.12] font-bold tracking-[-0.025em] text-highlighted">Coming next</h2>
        <ul class="mt-4 space-y-2 text-toned">
          <li v-for="n in next" :key="n" class="flex gap-3"><span aria-hidden="true" class="mt-2.5 size-1.5 shrink-0 rounded-full bg-accented" />{{ n }}</li>
        </ul>
      </div>
    </UContainer>
  </div>
</template>
