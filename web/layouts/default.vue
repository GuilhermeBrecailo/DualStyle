<template>
  <div class="min-h-dvh bg-[#080808]">
    <!-- Header -->
    <header class="fixed top-0 inset-x-0 z-50 mix-blend-difference">
      <div class="flex items-center justify-between px-5 md:px-8 h-14">
        <a href="/" class="block">
          <img src="/logo.png" alt="Duo Style" class="h-8 w-auto" />
        </a>

        <nav class="flex items-center gap-8">
          <a href="#colecao" class="text-[10px] text-white uppercase tracking-[0.25em] hover:opacity-60 transition-opacity">
            Coleção
          </a>
          <a
            href="https://shopee.com.br/duostyle"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[10px] text-white uppercase tracking-[0.25em] hover:opacity-60 transition-opacity"
          >
            Shopee ↗
          </a>
        </nav>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <LandingFooterSection />
  </div>
</template>
