<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
  product: Product
  size?: 'normal' | 'tall' | 'wide'
  index?: number
}>()

const imgError = ref(false)
function onImageError() { imgError.value = true }

const aspectClass = computed(() => {
  if (props.size === 'tall') return 'aspect-[3/4]'
  if (props.size === 'wide') return 'aspect-[16/9]'
  return 'aspect-[3/4]'
})
</script>

<template>
  <NuxtLink :to="`/produto/${product.id}`" class="group relative overflow-hidden bg-[#0f0f0f] block h-full" data-cursor-hover>
    <!-- Image -->
    <div class="relative overflow-hidden" :class="aspectClass">
      <img
        v-if="!imgError"
        :src="product.image_url"
        :alt="product.title"
        loading="lazy"
        width="600"
        height="800"
        class="w-full h-full object-cover object-top group-hover:scale-[1.06] transition-transform duration-700 ease-out"
        @error="onImageError"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-[#111]">
        <span class="font-display text-6xl text-white/5">DS</span>
      </div>

      <!-- Always-visible gradient -->
      <div class="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

      <!-- Index number top-right -->
      <span v-if="index !== undefined" class="absolute top-4 right-4 font-display text-[10px] text-white/20 tracking-widest">
        {{ String(index + 1).padStart(2, '0') }}
      </span>

      <!-- Info overlay at bottom -->
      <div class="absolute inset-x-0 bottom-0 p-5">
        <p class="text-[9px] text-gray-500 uppercase tracking-[0.3em] mb-1.5">
          {{ product.description || 'Duo Style' }}
        </p>
        <h3 class="font-display text-white tracking-display text-xl leading-tight">
          {{ product.title }}
        </h3>

        <!-- CTA slides up on hover -->
        <div class="overflow-hidden mt-3">
          <a
            :href="product.shopee_link"
            target="_blank"
            rel="noopener noreferrer"
            class="card-cta block w-full bg-brand-yellow text-brand-black text-center text-[10px] font-semibold uppercase tracking-widest py-3.5"
            @click.stop
          >
            Comprar na Shopee
          </a>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
