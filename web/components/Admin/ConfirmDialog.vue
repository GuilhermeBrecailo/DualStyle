<script setup lang="ts">
defineProps<{ title: string; message: string }>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('cancel')" />

    <div class="relative bg-[#0f0f0f] border border-white/[0.08] p-6 w-full max-w-sm">
      <h3 class="text-white text-sm font-medium">{{ title }}</h3>
      <p class="mt-2 text-gray-500 text-sm leading-relaxed">{{ message }}</p>

      <div class="mt-6 flex gap-2">
        <button
          class="flex-1 text-[10px] uppercase tracking-widest py-3 border border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20 transition-all duration-200 cursor-pointer"
          @click="emit('cancel')"
        >
          Cancelar
        </button>
        <button
          class="flex-1 text-[10px] uppercase tracking-widest py-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-200 cursor-pointer"
          @click="emit('confirm')"
        >
          Excluir
        </button>
      </div>
    </div>
  </div>
</template>
