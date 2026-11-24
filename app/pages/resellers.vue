<script setup lang="ts">
usePageSeo('Nebla for resellers', 'Sell VMs from your own Proxmox clusters. Nebla\'s open core has projects, quotas and tenant isolation, and a commercial module will add billing, self-signup and white-label branding.')

const today = [
  { title: 'Projects and members', body: 'Each customer gets projects with their own members and roles. They see their own servers and nothing else.' },
  { title: 'Quotas', body: 'Cap servers, vCPU, memory, disk, IPs, volumes and backups per project, with defaults for new projects and a limit on how many projects one user can own.' },
  { title: 'Isolation between tenants', body: 'The Proxmox firewall filters each server by its own IPs and MAC address. The console proxy checks project membership on every connection.' },
  { title: 'Invites and sign-up control', body: 'Create accounts for customers, or let project owners invite people by link or email. Open sign-up stays off unless you turn it on.' },
  { title: 'Scoped API tokens', body: 'Customers automate their own project with read-only or read-write tokens, with rate limits per token.' },
  { title: 'Many clusters, one panel', body: 'Add each Proxmox cluster or standalone node as a location. Customers pick a location and Nebla handles placement.' }
]

const module = [
  { title: 'Billing integration', body: 'Events for servers created, deleted and resized, plus hourly usage, sent to your billing system.' },
  { title: 'Customer self-signup', body: 'A sign-up flow that replaces the built-in invite-only model.' },
  { title: 'White-label branding', body: 'Your logo, colours, product name and domain on the panel.' },
  { title: 'Usage metering', body: 'Per-project records of what ran and for how long.' },
  { title: 'Resellers and sub-customers', body: 'A hierarchy for resellers who manage their own customers.' }
]
</script>

<template>
  <div>
    <PageIntro title="Sell VMs from your own Proxmox clusters" lede="Nebla's open core is multi-tenant from the start, so you can put customers on your hardware today. A commercial module for billing and branding is in development." />

    <UContainer class="pb-20">
      <h2 class="text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.12] font-bold tracking-[-0.025em] text-highlighted">In the open core today</h2>
      <dl class="mt-10 grid grid-cols-[minmax(0,1fr)] gap-x-16 gap-y-8 md:grid-cols-2">
        <div v-for="t in today" :key="t.title" class="border-t border-default pt-4">
          <dt class="font-bold text-highlighted">{{ t.title }}</dt>
          <dd class="mt-1 max-w-[52ch] leading-relaxed text-toned">{{ t.body }}</dd>
        </div>
      </dl>
    </UContainer>

    <section class="bg-ink-950 py-20 text-ink-50 dark:bg-ink-900 dark:ring-1 dark:ring-ink-800">
      <UContainer class="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <h2 class="text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.12] font-bold tracking-[-0.025em]">The reseller module</h2>
          <p class="mt-4 max-w-[44ch] leading-relaxed opacity-80">
            A commercial add-on for hosting businesses. It is a separate build on top of the open core, activated with a licence key, so the core stays complete for everyone else.
          </p>
          <p class="mt-4 max-w-[44ch] leading-relaxed opacity-80">
            It is still in development and planned for v1.0. The roadmap shows where it stands.
          </p>
          <ULink to="/roadmap" class="mt-6 inline-block font-semibold text-ink-50 underline decoration-current/40 underline-offset-4 hover:decoration-current">See the roadmap</ULink>
        </div>
        <ul class="divide-y divide-current/15">
          <li v-for="m in module" :key="m.title" class="py-4 first:pt-0">
            <h3 class="font-bold">{{ m.title }}</h3>
            <p class="mt-1 leading-relaxed opacity-80">{{ m.body }}</p>
          </li>
        </ul>
      </UContainer>
    </section>
  </div>
</template>
