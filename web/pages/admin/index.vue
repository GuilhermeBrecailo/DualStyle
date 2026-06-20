<script setup lang="ts">
import type { Product } from '~/types/product'

definePageMeta({ middleware: 'auth', layout: 'admin', title: 'Dashboard' })

const { getAll } = useAdminProducts()
const products = ref<Product[]>([])
const loading = ref(true)

onMounted(async () => {
  try { products.value = await getAll() }
  finally { loading.value = false }
})

const total = computed(() => products.value.length)
const ativos = computed(() => products.value.filter(p => p.active).length)
const inativos = computed(() => products.value.filter(p => !p.active).length)
const destaques = computed(() => products.value.filter(p => p.featured).length)
const semPreco = computed(() => products.value.filter(p => !p.price).length)
const semTamanho = computed(() => products.value.filter(p => !p.sizes?.length).length)
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-white font-semibold mb-1">Dashboard</h2>
      <p class="text-[10px] text-gray-700 uppercase tracking-widest">Visão geral da loja</p>
    </div>

    <!-- Stats -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="h-20 bg-[#111] animate-pulse" />
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="border border-white/[0.06] bg-[#0a0a0a] p-5">
        <p class="text-[9px] text-gray-700 uppercase tracking-widest mb-2">Total</p>
        <p class="text-3xl font-display text-white">{{ total }}</p>
        <p class="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">produtos</p>
      </div>
      <div class="border border-white/[0.06] bg-[#0a0a0a] p-5">
        <p class="text-[9px] text-gray-700 uppercase tracking-widest mb-2">Ativos</p>
        <p class="text-3xl font-display text-green-500">{{ ativos }}</p>
        <p class="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">visíveis no site</p>
      </div>
      <div class="border border-white/[0.06] bg-[#0a0a0a] p-5">
        <p class="text-[9px] text-gray-700 uppercase tracking-widest mb-2">Ocultos</p>
        <p class="text-3xl font-display text-gray-500">{{ inativos }}</p>
        <p class="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">não publicados</p>
      </div>
      <div class="border border-white/[0.06] bg-[#0a0a0a] p-5">
        <p class="text-[9px] text-gray-700 uppercase tracking-widest mb-2">Destaques</p>
        <p class="text-3xl font-display text-brand-yellow">{{ destaques }}</p>
        <p class="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">em evidência</p>
      </div>
    </div>

    <!-- Alertas -->
    <div v-if="!loading && (semPreco > 0 || semTamanho > 0)" class="space-y-2">
      <p class="text-[9px] text-gray-700 uppercase tracking-widest mb-3">Atenção</p>
      <div v-if="semPreco > 0" class="flex items-center gap-3 border border-yellow-800/40 bg-yellow-900/10 px-4 py-3">
        <span class="text-brand-yellow text-sm">⚠</span>
        <p class="text-xs text-yellow-600">
          <span class="font-semibold text-brand-yellow">{{ semPreco }}</span> produto{{ semPreco > 1 ? 's' : '' }} sem preço cadastrado
        </p>
        <NuxtLink to="/admin/produtos" class="ml-auto text-[10px] text-brand-yellow/60 hover:text-brand-yellow uppercase tracking-widest transition-colors">
          Corrigir →
        </NuxtLink>
      </div>
      <div v-if="semTamanho > 0" class="flex items-center gap-3 border border-yellow-800/40 bg-yellow-900/10 px-4 py-3">
        <span class="text-brand-yellow text-sm">⚠</span>
        <p class="text-xs text-yellow-600">
          <span class="font-semibold text-brand-yellow">{{ semTamanho }}</span> produto{{ semTamanho > 1 ? 's' : '' }} sem tamanhos cadastrados
        </p>
        <NuxtLink to="/admin/produtos" class="ml-auto text-[10px] text-brand-yellow/60 hover:text-brand-yellow uppercase tracking-widest transition-colors">
          Corrigir →
        </NuxtLink>
      </div>
    </div>

    <!-- Atalhos -->
    <div>
      <p class="text-[9px] text-gray-700 uppercase tracking-widest mb-3">Atalhos</p>
      <div class="flex gap-3">
        <NuxtLink
          to="/admin/produtos/novo"
          class="inline-flex items-center gap-2 bg-brand-yellow text-brand-black text-xs font-bold uppercase tracking-widest px-6 py-2.5 hover:opacity-90 transition-opacity"
        >
          + Novo produto
        </NuxtLink>
        <NuxtLink
          to="/admin/produtos"
          class="inline-flex items-center gap-2 border border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20 text-xs uppercase tracking-widest px-6 py-2.5 transition-all duration-200"
        >
          Ver todos →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
