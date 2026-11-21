<script setup lang="ts">
usePageSeo('Features | Nebla', 'Everything Nebla does on top of Proxmox VE: servers, OS images, volumes, firewalls, SSH keys and cloud-init, IP pools with tenant isolation, projects and quotas, a REST API and a CLI.')

const imageLines = [
  { kind: 'cmd', text: 'nebla image list' },
  { kind: 'out', text: 'ID   NAME           OS       VERSION   DESCRIPTION' },
  { kind: 'out', text: '1    debian-13      debian   13        Debian 13 generic cloud image' },
  { kind: 'out', text: '2    ubuntu-24.04   ubuntu   24.04     Ubuntu 24.04 server cloud image' },
  { kind: 'out', text: '3    rocky-10       rocky    10        Rocky Linux 10 generic cloud image' },
  { kind: 'out', text: '4    fedora-45      fedora   45        Fedora 45 cloud base image' }
] as const

const keyLines = [
  { kind: 'cmd', text: 'nebla ssh-key create --name laptop --public-key-from-file ~/.ssh/id_ed25519.pub' },
  { kind: 'out', text: 'SSH key 3 created' },
  { kind: 'cmd', text: 'nebla server create --name app1 --type small-2 --image ubuntu-24.04 \\\n    --ssh-key laptop --user-data-from-file cloud-init.yaml' },
  { kind: 'out', text: 'Waiting for create_server (815) ... done' },
  { kind: 'out', text: 'Server 43 created' },
  { kind: 'out', text: 'IPv4: 203.0.113.21' }
] as const

const more = [
  { title: 'One-line Proxmox setup', body: 'Run one command from the panel on a Proxmox node. It creates the role, user and API token Nebla needs and reports the node\'s certificate back, so nothing is copied by hand.' },
  { title: 'Server types', body: 'Admins define sizes as vCPU, memory and disk, start from templates, and can limit a size to some locations. Users pick a size, never a raw Proxmox setting.' },
  { title: 'Locations and many clusters', body: 'Each location is a Proxmox cluster or a standalone node. Nebla places each new server on the online node with the most free memory that has the image.' },
  { title: 'IP pools', body: 'Pools per location, with bridge, optional VLAN tag, CIDR, gateway and DNS. Each server gets a static IPv4 and an optional IPv6 through cloud-init, and they are freed on delete.' },
  { title: 'Volumes', body: 'Extra disks you attach to a server. A volume keeps its data when you detach it, rebuild the server or delete it, and can move to another server in the same location.' },
  { title: 'Firewalls', body: 'Inbound and outbound rules you apply to servers directly or by label, so new servers with the right label are covered as soon as they boot.' },
  { title: 'Tenant isolation', body: 'Every server\'s network card runs the Proxmox firewall with IP and MAC filtering, so one tenant cannot claim another tenant\'s address.' },
  { title: 'Projects, members and quotas', body: 'Members get owner, admin, member or read-only roles. Admins set per-project limits on servers, vCPU, memory, disk, IPs and volumes.' },
  { title: 'API tokens', body: 'Tokens belong to a project and are read-only or read-write, so a script only reaches the servers it should.' },
  { title: 'Actions', body: 'Every change returns an action with its status and progress. The panel shows it live and the CLI can wait for it to finish.' },
  { title: 'Stays in sync', body: 'A reconciler reads VM state from Proxmox, so changes made in the Proxmox UI still show up correctly in Nebla.' },
  { title: 'Accounts and sign-in', body: 'Local accounts that sign in with a passkey, or a password with optional TOTP two-factor. Admins create accounts and project owners send invite links. Open sign-up is off until an admin turns it on.' },
  { title: 'Admin area', body: 'A Get Nebla ready checklist walks you through the first setup. Then manage locations, OS images, server types, IP pools, users, projects and quotas from one place.' }
]

const next = ['Snapshots and backups', 'Private networks and floating IPs', 'The reseller module', 'Load balancers and managed certificates']
</script>

<template>
  <div>
    <PageIntro title="What Nebla does" lede="Nebla turns Proxmox VE into a self-service cloud: projects, servers, images, SSH keys and API tokens, with a panel and a CLI on the same API." />

    <UContainer class="divide-y divide-default">
      <FeatureRow title="Servers, from create to delete">
        <p>Create a server in one page: location, image, type, IPs, SSH keys, optional cloud-init user data and a name.</p>
        <p>After that you can rename it, power it on, off, reboot, reset or shut it down, rebuild it from another image, change its type, watch its CPU, disk and network graphs, and delete it.</p>
        <p>The web console opens in the browser. Nebla proxies it, so users never need Proxmox credentials or network access to the host.</p>
        <template #visual>
          <PanelShot shot="server-detail" />
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
          Nebla has a REST API at <code class="font-mono text-[0.92em]">/v1</code>, described by an OpenAPI spec. The panel uses it, and so does the CLI, which covers servers, volumes, firewalls, SSH keys and images. The CLI keeps contexts for each panel you use and prints tables, JSON or YAML.
        </p>
        <ULink to="/docs/api" class="mt-6 inline-block font-semibold text-highlighted underline decoration-accented underline-offset-4 hover:decoration-current">Read the API docs</ULink>
      </div>
      <div>
        <h2 class="text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.12] font-bold tracking-[-0.025em] text-highlighted">Coming next</h2>
        <ul class="mt-4 space-y-2 text-toned">
          <li v-for="n in next" :key="n" class="flex gap-3"><span aria-hidden="true" class="mt-2.5 size-1.5 shrink-0 rounded-full bg-accented" />{{ n }}</li>
        </ul>
        <ULink to="/roadmap" class="mt-6 inline-block font-semibold text-highlighted underline decoration-accented underline-offset-4 hover:decoration-current">See the roadmap</ULink>
      </div>
    </UContainer>
  </div>
</template>
