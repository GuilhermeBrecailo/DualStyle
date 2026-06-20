import type { Product as PrismaProduct } from '@prisma/client';
import { Product } from '../../../domain/entities/Product/Product';

type ProductPersistenceDTO = {
  title: string;
  description?: string | null;
  image_url: string;
  shopee_link: string;
  price?: number | null;
  sizes: string[];
  featured: boolean;
  active: boolean;
};

export class ProductPrismaMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.restore({
      id: raw.id,
      title: raw.title,
      description: raw.description ?? undefined,
      image_url: raw.image_url,
      shopee_link: raw.shopee_link,
      price: raw.price ? Number(raw.price) : null,
      sizes: raw.sizes ?? [],
      featured: raw.featured ?? false,
      active: raw.active,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(product: Product): ProductPersistenceDTO {
    return {
      title: product.title,
      description: product.description,
      image_url: product.image_url,
      shopee_link: product.shopee_link,
      price: product.price ?? null,
      sizes: product.sizes,
      featured: product.featured,
      active: product.active,
    };
  }
}
