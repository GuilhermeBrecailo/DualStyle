<script setup lang="ts">
definePageMeta({ layout: false })

const { login, isAuthenticated } = useAdminAuth()
const router = useRouter()

if (import.meta.client && isAuthenticated()) {
  router.replace('/admin/produtos')
}

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

async function handleLogin() {
  error.value = null
  loading.value = true
  try {
    await login(email.value, password.value)
  } catch {
    error.value = 'Email ou senha incorretos.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-dvh bg-brand-black flex items-center justify-center px-4">
    <!-- Dot grid -->
    <div
      class="absolute inset-0 opacity-[0.025] pointer-events-none"
      style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 28px 28px;"
    />

    <div class="relative w-full max-w-sm">
      <!-- Header -->
      <div class="mb-10">
        <span class="font-display text-3xl text-brand-yellow tracking-display">DUALSTYLE</span>
        <p class="mt-1 text-[10px] text-gray-700 uppercase tracking-[0.3em]">Painel Admin</p>
      </div>

      <!-- Form -->
      <form class="space-y-1" @submit.prevent="handleLogin">
        <div>
          <label class="block text-[10px] text-gray-600 uppercase tracking-widest mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="admin@dualstyle.com"
            class="w-full bg-[#0f0f0f] border border-white/[0.08] text-white text-sm px-4 py-3 placeholder:text-gray-800 focus:outline-none focus:border-brand-yellow/50 transition-colors duration-200"
          />
        </div>

        <div class="pt-3">
          <label class="block text-[10px] text-gray-600 uppercase tracking-widest mb-2">Senha</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full bg-[#0f0f0f] border border-white/[0.08] text-white text-sm px-4 py-3 focus:outline-none focus:border-brand-yellow/50 transition-colors duration-200"
          />
        </div>

        <div v-if="error" class="pt-2">
          <p class="text-red-400 text-xs">{{ error }}</p>
        </div>

        <div class="pt-5">
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-brand-yellow text-brand-black font-semibold text-xs uppercase tracking-widest py-4 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 cursor-pointer"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
