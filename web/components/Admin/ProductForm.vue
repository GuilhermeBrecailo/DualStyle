<script setup lang="ts">
import type { Product, ProductFormData } from '~/types/product'

const SIZES = ['P', 'M', 'G', 'GG', 'XGG']

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
  price: props.initial?.price ?? null,
  sizes: props.initial?.sizes ?? [],
  featured: props.initial?.featured ?? false,
})

const errors = reactive({ title: '', image_url: '', shopee_link: '' })
const priceInput = ref(props.initial?.price ? String(props.initial.price) : '')

watch(priceInput, (val) => {
  const n = parseFloat(val.replace(',', '.'))
  form.price = isNaN(n) ? null : n
})

function toggleSize(size: string) {
  const idx = form.sizes.indexOf(size)
  if (idx === -1) form.sizes.push(size)
  else form.sizes.splice(idx, 1)
}

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
  <form class="space-y-5" @submit.prevent="handleSubmit">

    <!-- Título -->
    <div class="space-y-1.5">
      <label class="block text-[10px] text-gray-600 uppercase tracking-widest">
        Título <span class="text-brand-yellow">*</span>
      </label>
      <input v-model="form.title" type="text" maxlength="100" :class="inputClass" placeholder="Ex: CAMISETA PIKACHU DROP" />
      <p v-if="errors.title" class="text-[11px] text-red-400">{{ errors.title }}</p>
    </div>

    <!-- Descrição -->
    <div class="space-y-1.5">
      <label class="block text-[10px] text-gray-600 uppercase tracking-widest">Descrição</label>
      <textarea v-model="form.description" rows="2" :class="inputClass" class="resize-none" placeholder="Descrição opcional..." />
    </div>

    <!-- Preço + Destaque numa linha -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <label class="block text-[10px] text-gray-600 uppercase tracking-widest">Preço (R$)</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">R$</span>
          <input
            v-model="priceInput"
            type="text"
            inputmode="decimal"
            placeholder="0,00"
            class="w-full bg-[#0a0a0a] border border-white/[0.08] text-white text-sm pl-9 pr-4 py-3 placeholder:text-gray-800 focus:outline-none focus:border-brand-yellow/40 transition-colors duration-200"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="block text-[10px] text-gray-600 uppercase tracking-widest">Destaque</label>
        <button
          type="button"
          class="w-full py-3 border text-xs uppercase tracking-widest transition-all duration-200"
          :class="form.featured
            ? 'bg-brand-yellow/10 border-brand-yellow/50 text-brand-yellow'
            : 'border-white/[0.08] text-gray-600 hover:border-white/20'"
          @click="form.featured = !form.featured"
        >
          {{ form.featured ? '★ Destaque ativo' : '☆ Sem destaque' }}
        </button>
      </div>
    </div>

    <!-- Tamanhos -->
    <div class="space-y-2">
      <label class="block text-[10px] text-gray-600 uppercase tracking-widest">Tamanhos disponíveis</label>
      <div class="flex gap-2">
        <button
          v-for="size in SIZES"
          :key="size"
          type="button"
          class="px-4 py-2 text-xs uppercase tracking-widest border transition-all duration-150"
          :class="form.sizes.includes(size)
            ? 'bg-brand-yellow text-brand-black border-brand-yellow font-semibold'
            : 'border-white/[0.08] text-gray-600 hover:border-white/20 hover:text-gray-400'"
          @click="toggleSize(size)"
        >
          {{ size }}
        </button>
      </div>
    </div>

    <!-- URL da imagem -->
    <div class="space-y-1.5">
      <label class="block text-[10px] text-gray-600 uppercase tracking-widest">
        URL da imagem <span class="text-brand-yellow">*</span>
      </label>
      <input v-model="form.image_url" type="url" :class="inputClass" placeholder="https://..." />
      <p v-if="errors.image_url" class="text-[11px] text-red-400">{{ errors.image_url }}</p>
      <div v-if="form.image_url && !errors.image_url" class="mt-2 w-32 h-32 border border-white/[0.08] overflow-hidden bg-[#0a0a0a]">
        <img :src="form.image_url" alt="Preview" class="w-full h-full object-cover object-top" />
      </div>
    </div>

    <!-- Link Shopee -->
    <div class="space-y-1.5">
      <label class="block text-[10px] text-gray-600 uppercase tracking-widest">
        Link Shopee <span class="text-brand-yellow">*</span>
      </label>
      <input v-model="form.shopee_link" type="url" :class="inputClass" placeholder="https://shopee.com.br/..." />
      <p v-if="errors.shopee_link" class="text-[11px] text-red-400">{{ errors.shopee_link }}</p>
    </div>

    <!-- Ações -->
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
        {{ loading ? 'Salvando...' : initial ? 'Atualizar produto' : 'Criar produto' }}
      </button>
    </div>
  </form>
</template>
