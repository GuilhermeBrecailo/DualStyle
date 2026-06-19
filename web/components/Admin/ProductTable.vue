<script setup lang="ts">
import type { Product } from '~/types/product'

defineProps<{ products: Product[] }>()

const emit = defineEmits<{
  edit: [product: Product]
  delete: [product: Product]
  toggle: [product: Product]
}>()
</script>

<template>
  <div>
    <table v-if="products.length" class="w-full text-sm">
      <thead>
        <tr class="border-b border-white/[0.06]">
          <th class="text-left text-[10px] text-gray-600 uppercase tracking-widest pb-3 pr-6 font-medium">Produto</th>
          <th class="text-left text-[10px] text-gray-600 uppercase tracking-widest pb-3 pr-6 font-medium">Status</th>
          <th class="text-right text-[10px] text-gray-600 uppercase tracking-widest pb-3 font-medium">Ações</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.04]">
        <tr
          v-for="product in products"
          :key="product.id"
          class="group hover:bg-white/[0.015] transition-colors duration-150"
        >
          <td class="py-4 pr-6">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-[#141414] border border-white/[0.06] overflow-hidden shrink-0">
                <img
                  :src="product.image_url"
                  :alt="product.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <p class="text-white text-xs font-medium truncate max-w-[200px]">{{ product.title }}</p>
                <p v-if="product.description" class="text-gray-700 text-[11px] truncate max-w-[200px] mt-0.5">
                  {{ product.description }}
                </p>
              </div>
            </div>
          </td>

          <td class="py-4 pr-6">
            <button
              class="text-[10px] uppercase tracking-widest px-2.5 py-1 border transition-all duration-200 cursor-pointer"
              :class="product.active
                ? 'border-green-500/20 text-green-500 bg-green-500/5 hover:border-red-500/20 hover:text-red-400 hover:bg-red-500/5'
                : 'border-white/10 text-gray-600 hover:border-green-500/20 hover:text-green-500 hover:bg-green-500/5'"
              @click="emit('toggle', product)"
            >
              {{ product.active ? 'Ativo' : 'Inativo' }}
            </button>
          </td>

          <td class="py-4">
            <div class="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button
                class="text-[10px] text-gray-600 hover:text-white uppercase tracking-widest transition-colors duration-150 cursor-pointer"
                @click="emit('edit', product)"
              >
                Editar
              </button>
              <button
                class="text-[10px] text-gray-600 hover:text-red-400 uppercase tracking-widest transition-colors duration-150 cursor-pointer"
                @click="emit('delete', product)"
              >
                Excluir
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="border border-white/[0.06] flex flex-col items-center justify-center py-20 text-center gap-3">
      <p class="text-[10px] text-gray-700 uppercase tracking-widest">Nenhum produto cadastrado</p>
      <div class="w-6 h-px bg-white/10" />
    </div>
  </div>
</template>
