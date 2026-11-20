<template>
  <div class="min-h-dvh flex flex-col overflow-x-clip">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
