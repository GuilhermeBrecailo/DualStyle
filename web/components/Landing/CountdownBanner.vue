<script setup lang="ts">
const TARGET = new Date('2026-07-10T20:00:00')

const pad = (n: number) => String(n).padStart(2, '0')

const days = ref('00')
const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')
const expired = ref(false)

const units = computed(() => [
  { value: days.value, label: 'dias' },
  { value: hours.value, label: 'horas' },
  { value: minutes.value, label: 'min' },
  { value: seconds.value, label: 'seg' },
])

function update() {
  const diff = TARGET.getTime() - Date.now()
  if (diff <= 0) { expired.value = true; return }
  days.value = pad(Math.floor(diff / 86400000))
  hours.value = pad(Math.floor((diff % 86400000) / 3600000))
  minutes.value = pad(Math.floor((diff % 3600000) / 60000))
  seconds.value = pad(Math.floor((diff % 60000) / 1000))
}

let interval: ReturnType<typeof setInterval>
onMounted(() => { update(); interval = setInterval(update, 1000) })
onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="border-y border-white/[0.06] bg-[#080808] py-14 px-6 text-center overflow-hidden relative">
    <!-- BG text -->
    <span class="absolute inset-0 flex items-center justify-center font-display text-[20vw] text-white/[0.02] select-none pointer-events-none leading-none">DROP</span>

    <p class="text-[9px] text-brand-yellow uppercase tracking-[0.5em] mb-4">Próximo Drop</p>
    <h3 class="font-display text-[clamp(1.5rem,5vw,3rem)] text-white tracking-display mb-2">
      COLEÇÃO FUTEBOL II
    </h3>
    <p class="text-[10px] text-gray-600 uppercase tracking-widest mb-10">10 de Julho · 20h</p>

    <div v-if="!expired" class="flex items-center justify-center gap-4 md:gap-8">
      <div v-for="unit in units" :key="unit.label" class="flex flex-col items-center gap-1.5">
        <span class="font-display text-[clamp(2.5rem,8vw,5rem)] text-brand-yellow leading-none tabular-nums">{{ unit.value }}</span>
        <span class="text-[8px] text-gray-700 uppercase tracking-widest">{{ unit.label }}</span>
      </div>
    </div>

    <p v-else class="font-display text-3xl text-brand-yellow">DISPONÍVEL AGORA</p>

    <div class="mt-10">
      <a
        href="https://shopee.com.br/duostyle"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 border border-brand-yellow/30 text-brand-yellow text-[10px] uppercase tracking-widest px-8 py-3 hover:bg-brand-yellow/5 transition-colors duration-200"
        data-cursor-hover
      >
        Acompanhar lançamento ↗
      </a>
    </div>
  </div>
</template>
