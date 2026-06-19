export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  const token = localStorage.getItem('dualstyle_token')
  if (!token && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
})
