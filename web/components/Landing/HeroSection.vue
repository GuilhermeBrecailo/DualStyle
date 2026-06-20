<script setup lang="ts">
const marqueeRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const logoRef = ref<HTMLElement | null>(null)
const btnsRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const scanRef = ref<HTMLElement | null>(null)
const scrollY = ref(0)

const TAGS = ['DUO STYLE', 'STREET WEAR', 'URBAN DROP', 'FUTEBOL', 'OVERSIZED', 'NOVA COLEÇÃO', 'POP CULTURE', 'LIMITED EDITION']

onMounted(async () => {
  const { gsap } = await import('gsap')

  const onScroll = () => { scrollY.value = window.scrollY }
  window.addEventListener('scroll', onScroll, { passive: true })

  // garante estado inicial do scale via GSAP (evita conflito com inline style)
  gsap.set(logoRef.value, { scale: 0.94 })

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!reduced) {
    const tl = gsap.timeline({ delay: 0.1 })

    // scan line sweep
    tl.to(scanRef.value, {
      scaleX: 1, opacity: 1, duration: 0.5, ease: 'expo.out',
    })
    .to(scanRef.value, { opacity: 0, duration: 0.3 }, '+=0.05')

    // badge desce do topo
    tl.to(badgeRef.value, {
      opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
    }, '-=0.2')

    // logo: clipPath wipe de baixo pra cima + fade
    tl.to(logoRef.value, {
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      scale: 1,
      duration: 0.85,
      ease: 'expo.out',
    }, '-=0.2')

    // botões sobem com stagger
    tl.to(Array.from(btnsRef.value?.children ?? []), {
      opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out',
    }, '-=0.3')

    // scroll indicator
    tl.to(scrollRef.value, {
      opacity: 0.4, duration: 0.6, ease: 'power2.out',
    }, '-=0.1')
  } else {
    // sem motion: mostra tudo imediatamente
    gsap.set([badgeRef.value, logoRef.value, btnsRef.value?.children, scrollRef.value], {
      opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)',
    })
  }

  // marquee infinito
  if (marqueeRef.value) {
    const firstCopy = marqueeRef.value.children[0] as HTMLElement
    const copyWidth = firstCopy.offsetWidth
    gsap.to(marqueeRef.value, { x: -copyWidth, duration: 28, ease: 'none', repeat: -1 })
  }

  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <section class="relative py-16 flex flex-col items-center justify-center overflow-hidden">

    <!-- Background -->
    <div class="absolute inset-0">
      <img
        src="/products/p3.jpg"
        alt=""
        class="w-full h-full object-cover object-top"
        :style="{ transform: `scale(1.12) translateY(${scrollY * 0.06}px)` }"
        width="1024"
        height="1024"
      />
      <div class="absolute inset-0 bg-[#080808]/65" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/60" />
    </div>

    <!-- Grain texture -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-[0.06]" aria-hidden="true">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>

    <!-- Scan line (animada no mount) -->
    <div
      ref="scanRef"
      class="absolute inset-x-0 top-1/2 h-px bg-brand-yellow z-30 pointer-events-none"
      style="opacity: 0; transform: scaleX(0); transform-origin: left;"
    />

    <!-- Accent line topo -->
    <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-yellow/50 to-transparent z-20" />

    <!-- Conteúdo -->
    <div class="relative z-20 flex flex-col items-center text-center px-4">

      <!-- Badge -->
      <div
        ref="badgeRef"
        class="mb-3 inline-flex items-center gap-3 border border-brand-yellow/30 px-4 py-1.5 backdrop-blur-sm"
        style="opacity: 0; transform: translateY(-14px);"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
        <span class="text-[9px] text-brand-yellow uppercase tracking-[0.45em]">Street Wear · Nova Coleção 2026</span>
        <span class="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
      </div>

      <!-- Logo com clipPath reveal -->
      <img
        ref="logoRef"
        src="/logo.png"
        alt="Duo Style"
        class="w-[clamp(22rem,62vw,52rem)] select-none drop-shadow-2xl"
        style="opacity: 0; clip-path: inset(100% 0% 0% 0%);"
      />

      <!-- Botões -->
      <div ref="btnsRef" class="mt-6 flex items-center gap-4">
        <a
          href="#colecao"
          class="group relative inline-flex items-center gap-2 bg-brand-yellow text-brand-black font-semibold text-[10px] uppercase tracking-widest px-8 py-4 overflow-hidden transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
          style="opacity: 0; transform: translateY(18px);"
        >
          <span class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-white/20 skew-x-12" />
          Ver coleção
        </a>
        <a
          href="https://shopee.com.br/duostyle"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[10px] text-gray-400 hover:text-brand-yellow uppercase tracking-widest border border-white/10 px-6 py-4 hover:border-brand-yellow/40 transition-all duration-300"
          style="opacity: 0; transform: translateY(18px);"
        >
          Shopee ↗
        </a>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div
      ref="scrollRef"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      style="opacity: 0;"
    >
      <div class="w-px h-10 bg-gradient-to-b from-brand-yellow/70 to-transparent" />
      <span class="text-[8px] text-brand-yellow/60 uppercase tracking-widest">scroll</span>
    </div>

    <div class="absolute bottom-8 left-6 md:left-10 flex items-center gap-2 opacity-20 z-20">
      <span class="font-display text-[9px] text-white tracking-widest">01 / 09</span>
    </div>
  </section>

  <!-- Marquee strip -->
  <div class="border-y border-white/[0.06] bg-[#080808] py-3.5 overflow-hidden">
    <div ref="marqueeRef" class="flex">
      <span v-for="copy in 2" :key="copy" class="flex shrink-0 items-center">
        <template v-for="tag in TAGS" :key="tag">
          <span class="text-[10px] font-display text-gray-700 uppercase tracking-widest px-5 whitespace-nowrap">{{ tag }}</span>
          <span class="text-brand-yellow/30 text-xs shrink-0">★</span>
        </template>
      </span>
    </div>
  </div>
</template>
