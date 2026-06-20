<script setup lang="ts">
import type { Product, ProductFormData } from '~/types/product'

definePageMeta({ middleware: 'auth', layout: 'admin', title: 'Editar produto' })

const { update } = useAdminProducts()
const nuxtApp = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { show } = useToast()

const product = ref<Product | null>(null)
const loading = ref(false)
const fetching = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    product.value = await nuxtApp.$api<Product>(`/api/v1/admin/products/all`)
      .then((list: Product[]) => list.find(p => p.id === route.params.id) ?? null)
    if (!product.value) error.value = 'Produto não encontrado.'
  } catch {
    error.value = 'Erro ao carregar produto.'
  } finally {
    fetching.value = false
  }
})

async function handleSubmit(data: ProductFormData) {
  if (!product.value) return
  error.value = null
  loading.value = true
  try {
    await update(product.value.id, data)
    show('Produto atualizado!')
    await router.push('/admin/produtos')
  } catch {
    error.value = 'Erro ao atualizar produto.'
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg">
    <div class="flex items-center gap-3 mb-8">
      <button
        class="text-gray-600 hover:text-white transition-colors text-xs uppercase tracking-widest"
        @click="router.back()"
      >
        ← Voltar
      </button>
      <h2 class="text-white font-semibold">Editar produto</h2>
    </div>

    <div v-if="fetching" class="space-y-4">
      <div v-for="i in 4" :key="i" class="h-12 bg-[#111] animate-pulse" />
    </div>

    <p v-else-if="error" class="text-red-400 text-xs">{{ error }}</p>

    <AdminProductForm
      v-else-if="product"
      :initial="product"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="router.push('/admin/produtos')"
    />
  </div>
</template>
