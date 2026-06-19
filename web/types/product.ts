export interface Product {
  id: string
  title: string
  description?: string | null
  image_url: string
  shopee_link: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface ProductFormData {
  title: string
  description?: string
  image_url: string
  shopee_link: string
}
