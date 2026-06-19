import type { Product } from '~/types/product'

export function useProducts() {
  const nuxtApp = useNuxtApp()

  async function getAll(): Promise<Product[]> {
    return nuxtApp.$api<Product[]>('/api/v1/products')
  }

  async function getById(id: string): Promise<Product> {
    return nuxtApp.$api<Product>(`/api/v1/products/${id}`)
  }

  return { getAll, getById }
}
