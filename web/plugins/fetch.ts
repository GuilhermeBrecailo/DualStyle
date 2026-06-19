import type { $Fetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      if (import.meta.client) {
        const token = localStorage.getItem('dualstyle_token')
        if (token) {
          options.headers = {
            ...(options.headers as Record<string, string>),
            Authorization: `Bearer ${token}`,
          }
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401 && import.meta.client) {
        localStorage.removeItem('dualstyle_token')
        await router.push('/admin/login')
      }
    },
  })

  return {
    provide: { api: apiFetch },
  }
})

declare module '#app' {
  interface NuxtApp {
    $api: $Fetch
  }
}
