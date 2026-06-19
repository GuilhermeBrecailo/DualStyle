<script setup lang="ts">
const heroRef = ref<HTMLElement | null>(null)
const marqueeRef = ref<HTMLElement | null>(null)
const scrollY = ref(0)
const { fadeIn } = useMotionFade()

const TAGS = ['DUO STYLE', 'STREET WEAR', 'URBAN DROP', 'FUTEBOL', 'OVERSIZED', 'NOVA COLEÇÃO', 'POP CULTURE', 'LIMITED EDITION']

onMounted(async () => {
  if (heroRef.value) fadeIn(heroRef.value, 0.1)

  const onScroll = () => { scrollY.value = window.scrollY }
  window.addEventListener('scroll', onScroll, { passive: true })

  // GSAP para marquee infinito garantido (mede o DOM real)
  if (marqueeRef.value) {
    const { gsap } = await import('gsap')
    const firstCopy = marqueeRef.value.children[0] as HTMLElement
    const copyWidth = firstCopy.offsetWidth
    gsap.to(marqueeRef.value, {
      x: -copyWidth,
      duration: 28,
      ease: 'none',
      repeat: -1,
    })
  }

  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <section ref="heroRef" class="relative h-dvh flex flex-col items-center justify-center overflow-hidden">

    <!-- Background -->
    <div class="absolute inset-0">
      <img
        src="/products/p3.jpg"
        alt="Duo Style"
        class="w-full h-full object-cover object-top scale-[1.12]"
        :style="{ transform: `scale(1.12) translateY(${scrollY * 0.06}px)` }"
        width="1024"
        height="1024"
      />
      <div class="absolute inset-0 bg-[#080808]/70" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/50" />
    </div>

    <!-- Conteúdo centralizado -->
    <div class="relative z-10 flex flex-col items-center text-center px-4">
      <p class="text-[9px] text-brand-yellow uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
        <span class="w-8 h-px bg-brand-yellow/50" />
        Street Wear · Nova Coleção 2026
        <span class="w-8 h-px bg-brand-yellow/50" />
      </p>

      <h1 class="font-display leading-[0.85] select-none">
        <span class="block text-[clamp(5.5rem,22vw,16rem)] text-white">DUO</span>
        <span class="block text-[clamp(5.5rem,22vw,16rem)] text-brand-yellow -mt-3">STYLE</span>
      </h1>

      <p class="mt-6 text-[10px] text-gray-500 uppercase tracking-[0.45em]">• Street Wear •</p>

      <div class="mt-10 flex items-center gap-4">
        <a
          href="#colecao"
          class="inline-flex items-center gap-2 bg-brand-yellow text-brand-black font-semibold text-[10px] uppercase tracking-widest px-8 py-4 hover:opacity-90 active:scale-[0.97] transition-all duration-200"
        >
          Ver coleção
        </a>
        <a
          href="https://shopee.com.br/duostyle"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[10px] text-gray-400 hover:text-white uppercase tracking-widest border border-white/10 px-6 py-4 hover:border-white/30 transition-all duration-200"
        >
          Shopee ↗
        </a>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
      <div class="w-px h-10 bg-white" />
      <span class="text-[8px] text-white uppercase tracking-widest">scroll</span>
    </div>

    <div class="absolute bottom-8 left-6 md:left-10 flex items-center gap-2 opacity-30">
      <span class="font-display text-[9px] text-white tracking-widest">01 / 09</span>
    </div>
  </section>

  <!-- Marquee strip -->
  <div class="border-y border-white/[0.06] bg-[#080808] py-3.5 overflow-hidden">
    <div ref="marqueeRef" class="flex">
      <!-- 2 cópias idênticas: GSAP move exatamente 1 cópia e reseta -->
      <span v-for="copy in 2" :key="copy" class="flex shrink-0 items-center">
        <template v-for="tag in TAGS" :key="tag">
          <span class="text-[10px] font-display text-gray-700 uppercase tracking-widest px-5 whitespace-nowrap">{{ tag }}</span>
          <span class="text-brand-yellow/30 text-xs shrink-0">★</span>
        </template>
      </span>
    </div>
  </div>
</template>
