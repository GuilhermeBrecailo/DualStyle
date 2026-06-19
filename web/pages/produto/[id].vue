<script setup lang="ts">
import type { Product } from '~/types/product'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { getById } = useProducts()

const product = ref<Product | null>(null)
const loading = ref(true)
const notFound = ref(false)

function getCollection(description?: string | null): string {
  if (!description) return 'Duo Style • Street Wear'
  const withPrefix = description.match(/^Coleção\s+([^·]+)/)
  if (withPrefix) return `Coleção ${withPrefix[1].trim()}`
  const withoutPrefix = description.match(/^([^·]+)·/)
  return withoutPrefix ? withoutPrefix[1].trim() : 'Duo Style • Street Wear'
}

onMounted(async () => {
  try {
    product.value = await getById(route.params.id as string)
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-dvh bg-brand-black">
    <!-- Back -->
    <NuxtLink
      to="/"
      class="fixed top-5 left-5 z-50 flex items-center gap-2 text-[10px] text-gray-500 hover:text-white uppercase tracking-widest group transition-colors duration-200"
      data-cursor-hover
    >
      <span class="inline-block group-hover:-translate-x-1 transition-transform duration-200">←</span>
      Voltar
    </NuxtLink>

    <!-- Product layout -->
    <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2 min-h-dvh">
      <!-- Image — sticky on desktop -->
      <div class="relative h-[90vw] max-h-[90vh] lg:h-dvh lg:sticky lg:top-0 overflow-hidden">
        <img
          :src="product.image_url"
          :alt="product.title"
          class="w-full h-full object-cover object-top"
          width="800"
          height="1067"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      <!-- Info -->
      <div class="flex flex-col justify-center px-8 py-16 lg:px-16 xl:px-24 min-h-[50vh] lg:min-h-dvh">
        <p class="text-[9px] text-brand-yellow uppercase tracking-[0.5em] mb-6">
          {{ getCollection(product.description) }}
        </p>

        <h1 class="font-display text-[clamp(2.5rem,7vw,5rem)] text-white leading-[0.9] tracking-display mb-6">
          {{ product.title }}
        </h1>

        <div class="w-10 h-px bg-brand-yellow/30 mb-8" />

        <p v-if="product.description" class="text-sm text-gray-500 leading-relaxed mb-3 max-w-md">
          {{ product.description }}
        </p>

        <div class="flex flex-col gap-3 mt-10">
          <a
            :href="product.shopee_link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-3 bg-brand-yellow text-brand-black font-bold text-[11px] uppercase tracking-widest px-10 py-5 self-start hover:opacity-90 active:scale-[0.97] transition-all duration-200"
            data-cursor-hover
          >
            Comprar na Shopee
            <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
            </svg>
          </a>

          <p class="text-[9px] text-gray-700 uppercase tracking-widest mt-2">
            Disponível na loja oficial da Shopee
          </p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="grid grid-cols-1 lg:grid-cols-2 min-h-dvh">
      <div class="h-[90vw] lg:h-dvh bg-[#111] animate-pulse" />
      <div class="p-16 space-y-6">
        <div class="h-3 w-24 bg-[#111] animate-pulse rounded" />
        <div class="h-14 w-3/4 bg-[#111] animate-pulse rounded" />
        <div class="h-px w-10 bg-[#111]" />
        <div class="h-4 w-full bg-[#0f0f0f] animate-pulse rounded" />
        <div class="h-4 w-2/3 bg-[#0f0f0f] animate-pulse rounded" />
        <div class="h-14 w-44 bg-[#111] animate-pulse mt-10 rounded" />
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="flex flex-col items-center justify-center min-h-dvh gap-6">
      <span class="font-display text-[8rem] text-white/[0.03] leading-none">DS</span>
      <p class="text-[11px] text-gray-600 uppercase tracking-widest">Produto não encontrado</p>
      <NuxtLink
        to="/"
        class="text-[10px] text-brand-yellow uppercase tracking-widest border border-brand-yellow/30 px-6 py-3 hover:bg-brand-yellow/5 transition-colors"
        data-cursor-hover
      >
        Voltar à coleção
      </NuxtLink>
    </div>
  </div>
</template>
