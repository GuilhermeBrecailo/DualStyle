<script setup lang="ts">
import type { Product } from '~/types/product'

const { getAll } = useProducts()

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const activeCollection = ref('')

onMounted(async () => {
  try {
    products.value = await getAll()
  } catch {
    error.value = 'Erro ao carregar produtos.'
  } finally {
    loading.value = false
  }
})

function getCollection(description?: string | null): string {
  if (!description) return 'Outros'
  const withPrefix = description.match(/^Coleção\s+([^·]+)/)
  if (withPrefix) return withPrefix[1].trim()
  const withoutPrefix = description.match(/^([^·]+)·/)
  return withoutPrefix ? withoutPrefix[1].trim() : 'Outros'
}

const collections = computed(() => {
  const set = new Set(products.value.map(p => getCollection(p.description)))
  return [...set]
})

const filtered = computed(() => {
  if (!activeCollection.value) return products.value
  return products.value.filter(p => getCollection(p.description) === activeCollection.value)
})
</script>

<template>
  <div>
    <LandingHeroSection />

    <!-- Countdown drop banner -->
    <LandingCountdownBanner />

    <!-- Coleção -->
    <section id="colecao" class="pt-16 pb-4 px-4 md:px-6 max-w-[1600px] mx-auto">

      <!-- Section header editorial -->
      <div class="flex items-end justify-between mb-8 pb-5 border-b border-white/[0.06]" data-reveal>
        <div>
          <p class="text-[9px] text-gray-600 uppercase tracking-[0.4em] mb-3">Nova Coleção 2026</p>
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] text-white leading-none tracking-display">
            NOSSA<br /><span class="text-brand-yellow">COLEÇÃO</span>
          </h2>
        </div>
        <div class="hidden md:flex flex-col items-end gap-1 pb-2">
          <span class="font-display text-[10px] text-gray-700 tracking-widest">
            {{ products.length.toString().padStart(2, '0') }} PEÇAS
          </span>
          <div class="w-8 h-px bg-brand-yellow/30" />
        </div>
      </div>

      <!-- Collection filter tabs -->
      <div v-if="!loading && collections.length > 1" class="flex items-center gap-2 flex-wrap mb-8" data-reveal>
        <button
          class="text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-200"
          :class="activeCollection === ''
            ? 'border-brand-yellow text-brand-yellow bg-brand-yellow/5'
            : 'border-white/[0.08] text-gray-500 hover:border-white/20 hover:text-gray-300'"
          data-cursor-hover
          @click="activeCollection = ''"
        >
          Todos ({{ products.length }})
        </button>
        <button
          v-for="col in collections"
          :key="col"
          class="text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-200"
          :class="activeCollection === col
            ? 'border-brand-yellow text-brand-yellow bg-brand-yellow/5'
            : 'border-white/[0.08] text-gray-500 hover:border-white/20 hover:text-gray-300'"
          data-cursor-hover
          @click="activeCollection = col"
        >
          {{ col }} ({{ products.filter(p => getCollection(p.description) === col).length }})
        </button>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-2">
        <div class="grid grid-cols-2 gap-2">
          <div class="aspect-[3/4] bg-[#111] animate-pulse" />
          <div class="aspect-[3/4] bg-[#111] animate-pulse" />
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="i in 3" :key="i" class="aspect-[3/4] bg-[#0f0f0f] animate-pulse" />
        </div>
      </div>

      <p v-else-if="error" class="text-red-400 text-sm">{{ error }}</p>
      <LandingProductGrid v-else-if="filtered.length" :products="filtered" />
      <LandingEmptyState v-else-if="!loading && !filtered.length && activeCollection" />
      <LandingEmptyState v-else />
    </section>

    <!-- Banner CTA full width -->
    <div class="mt-16 relative overflow-hidden border-y border-white/[0.06]" data-reveal>
      <div class="relative h-64 md:h-80 flex items-center overflow-hidden">
        <img
          src="/products/p1.jpg"
          alt="Duo Style"
          class="absolute inset-0 w-full h-full object-cover object-top opacity-25"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent" />
        <div class="relative px-8 md:px-16">
          <p class="text-[9px] text-brand-yellow uppercase tracking-[0.4em] mb-3">Disponível na Shopee</p>
          <h3 class="font-display text-[clamp(2.5rem,7vw,5rem)] text-white leading-none tracking-display">
            COMPRE<br />AGORA
          </h3>
          <a
            href="https://shopee.com.br/duostyle"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 inline-flex items-center gap-3 bg-brand-yellow text-brand-black text-[10px] font-semibold uppercase tracking-widest px-8 py-3.5 hover:opacity-90 active:scale-[0.97] transition-all duration-200"
            data-cursor-hover
          >
            Acessar loja ↗
          </a>
        </div>
      </div>
    </div>

    <!-- Instagram section -->
    <LandingInstagramSection />
  </div>
</template>
