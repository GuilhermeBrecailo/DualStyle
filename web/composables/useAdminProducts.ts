import type { Product, ProductFormData } from '~/types/product'

export function useAdminProducts() {
  const nuxtApp = useNuxtApp()

  async function getAll(): Promise<Product[]> {
    return nuxtApp.$api<Product[]>('/api/v1/admin/products/all')
  }

  async function create(data: ProductFormData): Promise<Product> {
    return nuxtApp.$api<Product>('/api/v1/admin/products/create', {
      method: 'POST',
      body: data,
    })
  }

  async function update(id: string, data: Partial<ProductFormData>): Promise<Product> {
    return nuxtApp.$api<Product>('/api/v1/admin/products/update', {
      method: 'PUT',
      body: { id, ...data },
    })
  }

  async function remove(id: string): Promise<void> {
    await nuxtApp.$api('/api/v1/admin/products/delete', {
      method: 'DELETE',
      body: { id },
    })
  }

  async function toggle(id: string): Promise<Product> {
    return nuxtApp.$api<Product>('/api/v1/admin/products/toggle', {
      method: 'PATCH',
      body: { id },
    })
  }

  async function reorder(orders: Array<{ id: string; position: number }>): Promise<void> {
    await nuxtApp.$api('/api/v1/admin/products/reorder', {
      method: 'PATCH',
      body: { orders },
    })
  }

  return { getAll, create, update, remove, toggle, reorder }
}
