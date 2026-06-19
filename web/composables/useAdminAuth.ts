const TOKEN_KEY = 'dualstyle_token'

export function useAdminAuth() {
  const router = useRouter()
  const nuxtApp = useNuxtApp()

  function isAuthenticated(): boolean {
    if (!import.meta.client) return false
    return !!localStorage.getItem(TOKEN_KEY)
  }

  async function login(email: string, password: string): Promise<void> {
    const data = await nuxtApp.$api<{ access_token: string }>(
      '/api/v1/auth/login',
      { method: 'POST', body: { email, password } },
    )
    localStorage.setItem(TOKEN_KEY, data.access_token)
    await router.push('/admin/produtos')
  }

  function logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    router.push('/admin/login')
  }

  return { isAuthenticated, login, logout }
}
