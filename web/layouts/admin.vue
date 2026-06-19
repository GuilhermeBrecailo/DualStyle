<script setup lang="ts">
const { logout } = useAdminAuth()
const route = useRoute()

const navLinks = [{ label: 'Produtos', path: '/admin/produtos', icon: '▤' }]
</script>

<template>
  <div class="min-h-dvh bg-brand-black flex">
    <!-- Sidebar -->
    <aside class="w-52 shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0a0a0a]">
      <div class="px-5 py-5 border-b border-white/[0.06]">
        <span class="font-display text-lg text-brand-yellow tracking-display">DUALSTYLE</span>
        <span class="block text-[9px] text-gray-700 uppercase tracking-widest mt-0.5">Admin Panel</span>
      </div>

      <nav class="flex-1 py-3 px-2">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-2.5 px-3 py-2.5 text-xs tracking-wide transition-all duration-200 group"
          :class="route.path.startsWith(link.path)
            ? 'text-brand-yellow bg-brand-yellow/5 border-l-2 border-brand-yellow pl-[10px]'
            : 'text-gray-600 hover:text-gray-300 border-l-2 border-transparent'"
        >
          <span class="text-base leading-none opacity-60">{{ link.icon }}</span>
          <span class="uppercase tracking-widest font-medium">{{ link.label }}</span>
        </NuxtLink>
      </nav>

      <div class="px-4 pb-5 pt-3 border-t border-white/[0.06]">
        <button
          class="w-full text-[10px] text-gray-700 hover:text-red-400 transition-colors duration-200 uppercase tracking-widest py-2 text-left flex items-center gap-2 cursor-pointer"
          @click="logout"
        >
          <span>→</span> Sair
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-12 border-b border-white/[0.06] flex items-center justify-between px-6 bg-[#080808]">
        <span class="text-[11px] text-gray-700 uppercase tracking-widest">
          {{ route.meta.title || 'Admin' }}
        </span>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-[10px] text-gray-600 hover:text-brand-yellow transition-colors duration-200 uppercase tracking-widest"
        >
          Ver no site ↗
        </a>
      </header>

      <main class="flex-1 p-8 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
