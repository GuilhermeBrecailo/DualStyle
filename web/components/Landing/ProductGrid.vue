<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{ products: Product[] }>()

const gridRef = ref<HTMLElement | null>(null)
const { staggerFadeIn } = useMotionFade()

onMounted(() => {
  if (!gridRef.value) return
  const cards = gridRef.value.querySelectorAll('article')
  if (cards.length) staggerFadeIn(Array.from(cards), 0.07)
})

// Layout editorial: [grande] [grande] / [pequeno] [pequeno] [pequeno] / [grande] [grande] ...
const rows = computed(() => {
  const all = props.products
  const result: Array<{ products: Product[]; layout: 'duo' | 'trio' }> = []
  let i = 0
  let pattern = 0
  while (i < all.length) {
    if (pattern % 2 === 0) {
      result.push({ products: all.slice(i, i + 2), layout: 'duo' })
      i += 2
    } else {
      result.push({ products: all.slice(i, i + 3), layout: 'trio' })
      i += 3
    }
    pattern++
  }
  return result
})

let globalIndex = 0
function nextIndex() { return globalIndex++ }
</script>

<template>
  <div ref="gridRef" class="space-y-2">
    <template v-for="(row, ri) in rows" :key="ri">
      <!-- 2 colunas: cards maiores -->
      <div v-if="row.layout === 'duo'" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <LandingProductCard
          v-for="(product, pi) in row.products"
          :key="product.id"
          :product="product"
          size="tall"
          :index="ri * 5 + pi"
        />
      </div>
      <!-- 3 colunas: cards menores -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <LandingProductCard
          v-for="(product, pi) in row.products"
          :key="product.id"
          :product="product"
          size="normal"
          :index="ri * 5 + pi + 2"
        />
      </div>
    </template>
  </div>
</template>
