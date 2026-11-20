<template>
  <section class="py-20 md:py-28">
    <UContainer>
      <h2 class="sr-only">Who Nebla is for</h2>
      <div class="grid overflow-hidden rounded-2xl border border-default lg:grid-cols-2">
        <div class="p-8 md:p-12">
          <h3 class="text-2xl font-bold tracking-[-0.02em] text-highlighted">For your homelab</h3>
          <p class="mt-3 max-w-[44ch] leading-relaxed text-toned">
            One box or a small cluster. Get a tidy console for the VMs you spin up every week, with one-click OS images, an API for your scripts, every feature and no node limit.
          </p>
          <ULink to="/homelab" class="mt-6 inline-block font-semibold text-highlighted underline decoration-accented underline-offset-4 hover:decoration-current">Nebla for homelabs</ULink>
        </div>
        <div class="bg-ink-950 p-8 text-ink-50 md:p-12 dark:bg-ink-900">
          <h3 class="text-2xl font-bold tracking-[-0.02em]">For hosting resellers</h3>
          <p class="mt-3 max-w-[44ch] leading-relaxed opacity-80">
            Projects, quotas and tenant isolation are built in, so each customer sees only their own servers. A commercial module adds billing, self-signup and your own branding.
          </p>
          <ULink to="/resellers" class="mt-6 inline-block font-semibold text-ink-50 underline decoration-current/40 underline-offset-4 hover:decoration-current">Nebla for resellers</ULink>
        </div>
      </div>
    </UContainer>
  </section>
</template>
