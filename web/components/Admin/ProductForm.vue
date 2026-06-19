<script setup lang="ts">
import type { Product, ProductFormData } from '~/types/product'

const props = defineProps<{ initial?: Product | null; loading?: boolean }>()

const emit = defineEmits<{
  submit: [data: ProductFormData]
  cancel: []
}>()

const form = reactive<ProductFormData>({
  title: props.initial?.title ?? '',
  description: props.initial?.description ?? '',
  image_url: props.initial?.image_url ?? '',
  shopee_link: props.initial?.shopee_link ?? '',
})

const errors = reactive({ title: '', image_url: '', shopee_link: '' })

function isValidUrl(v: string) {
  try { new URL(v); return true } catch { return false }
}

function validate(): boolean {
  errors.title = form.title.trim() ? '' : 'Obrigatório'
  errors.image_url = !form.image_url.trim() ? 'Obrigatório' : !isValidUrl(form.image_url) ? 'URL inválida' : ''
  errors.shopee_link = !form.shopee_link.trim() ? 'Obrigatório' : !isValidUrl(form.shopee_link) ? 'URL inválida' : ''
  return !errors.title && !errors.image_url && !errors.shopee_link
}

function handleSubmit() {
  if (validate()) emit('submit', { ...form })
}

const inputClass = 'w-full bg-[#0a0a0a] border border-white/[0.08] text-white text-sm px-4 py-3 placeholder:text-gray-800 focus:outline-none focus:border-brand-yellow/40 transition-colors duration-200'
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 gap-5">
      <!-- Title -->
      <div class="space-y-1.5">
        <label class="block text-[10px] text-gray-600 uppercase tracking-widest">
          Título <span class="text-brand-yellow">*</span>
        </label>
        <input v-model="form.title" type="text" maxlength="100" :class="inputClass" placeholder="Ex: HODL TEE" />
        <p v-if="errors.title" class="text-[11px] text-red-400">{{ errors.title }}</p>
      </div>

      <!-- Description -->
      <div class="space-y-1.5">
        <label class="block text-[10px] text-gray-600 uppercase tracking-widest">Descrição</label>
        <textarea
          v-model="form.description"
          rows="2"
          :class="inputClass"
          class="resize-none"
          placeholder="Descrição opcional do produto..."
        />
      </div>

      <!-- Image URL -->
      <div class="space-y-1.5">
        <label class="block text-[10px] text-gray-600 uppercase tracking-widest">
          URL da imagem <span class="text-brand-yellow">*</span>
        </label>
        <input v-model="form.image_url" type="url" :class="inputClass" placeholder="https://..." />
        <p v-if="errors.image_url" class="text-[11px] text-red-400">{{ errors.image_url }}</p>
        <div v-if="form.image_url && !errors.image_url" class="w-14 h-14 border border-white/[0.08] overflow-hidden">
          <img :src="form.image_url" alt="Preview" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Shopee link -->
      <div class="space-y-1.5">
        <label class="block text-[10px] text-gray-600 uppercase tracking-widest">
          Link Shopee <span class="text-brand-yellow">*</span>
        </label>
        <input v-model="form.shopee_link" type="url" :class="inputClass" placeholder="https://shopee.com.br/..." />
        <p v-if="errors.shopee_link" class="text-[11px] text-red-400">{{ errors.shopee_link }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3 pt-2">
      <button
        type="button"
        class="px-5 py-2.5 text-[10px] uppercase tracking-widest border border-white/[0.08] text-gray-600 hover:text-white hover:border-white/20 transition-all duration-200 cursor-pointer"
        @click="emit('cancel')"
      >
        Cancelar
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-8 py-2.5 text-[10px] uppercase tracking-widest bg-brand-yellow text-brand-black font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 cursor-pointer"
      >
        {{ loading ? 'Salvando...' : initial ? 'Atualizar' : 'Criar produto' }}
      </button>
    </div>
  </form>
</template>
