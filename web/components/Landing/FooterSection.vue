<template>
  <footer class="border-t border-white/[0.06] mt-24">
    <!-- Barcode strip -->
    <div class="border-b border-white/[0.04] py-3 overflow-hidden">
      <div class="flex w-max animate-marquee-fast">
        <span v-for="i in 2" :key="i" class="flex shrink-0 gap-3 pr-3">
          <template v-for="tag in ['0012', '7482901', '2744103', '8800348', '8774510', '7205']" :key="tag">
            <span class="font-mono text-[9px] text-gray-800">{{ tag }}</span>
          </template>
          <span class="font-mono text-[9px] text-gray-800 px-3">||||||||| ||| |||||| ||| ||||||||||</span>
        </span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        <!-- Brand -->
        <div>
          <img src="/products/logo.jpg" alt="Duo Style" class="h-10 w-auto invert mb-4" />
          <p class="text-[10px] text-gray-700 uppercase tracking-widest leading-relaxed">
            Street Wear · Pop Culture<br />Feito pra quem tem atitude.
          </p>
        </div>

        <!-- Links -->
        <div class="space-y-3">
          <p class="text-[9px] text-gray-600 uppercase tracking-widest mb-4">Links</p>
          <a href="#colecao" class="block text-[11px] text-gray-500 hover:text-white transition-colors duration-200">Coleção</a>
          <a href="https://shopee.com.br/duostyle" target="_blank" rel="noopener noreferrer" class="block text-[11px] text-gray-500 hover:text-white transition-colors duration-200">Shopee ↗</a>
        </div>

        <!-- Copyright -->
        <div class="md:text-right">
          <p class="text-[9px] text-gray-700 uppercase tracking-widest">
            © {{ new Date().getFullYear() }} Duo Style<br />Todos os direitos reservados
          </p>
          <div class="mt-4 flex md:justify-end">
            <span class="text-[8px] font-mono text-gray-800 tracking-widest border border-white/5 px-2 py-1">STREET WEAR BRAND</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
