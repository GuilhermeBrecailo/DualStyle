<script setup lang="ts">
import type { ProductFormData } from '~/types/product'

definePageMeta({ middleware: 'auth', layout: 'admin', title: 'Novo produto' })

const { create } = useAdminProducts()
const router = useRouter()

const loading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit(data: ProductFormData) {
  error.value = null
  loading.value = true
  try {
    await create(data)
    await router.push('/admin/produtos')
  } catch {
    error.value = 'Erro ao criar produto.'
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
      <h2 class="text-white font-semibold">Novo produto</h2>
    </div>

    <p v-if="error" class="mb-4 text-red-400 text-xs">{{ error }}</p>

    <AdminProductForm
      :loading="loading"
      @submit="handleSubmit"
      @cancel="router.push('/admin/produtos')"
    />
  </div>
</template>
