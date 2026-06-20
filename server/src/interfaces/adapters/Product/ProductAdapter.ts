import { Product } from '../../../domain/entities/Product/Product';

export type ProductResponseDTO = {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  shopee_link: string;
  price?: number | null;
  sizes: string[];
  featured: boolean;
  active: boolean;
  created_at: Date;
};

export class ProductAdapter {
  static toResponse(product: Product): ProductResponseDTO {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      image_url: product.image_url,
      shopee_link: product.shopee_link,
      price: product.price,
      sizes: product.sizes,
      featured: product.featured,
      active: product.active,
      created_at: product.created_at,
    };
  }

  static toResponseList(products: Product[]): ProductResponseDTO[] {
    return products.map(ProductAdapter.toResponse);
  }
}
