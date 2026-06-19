import type { PrismaClient } from '@prisma/client';
import { Product } from '../../../domain/entities/Product/Product';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { ProductPrismaMapper } from './ProductPrismaMapper';

export class ProductPrismaRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAllActive(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { active: true },
      orderBy: [{ display_order: 'asc' }, { created_at: 'desc' }],
    });

    return products.map(ProductPrismaMapper.toDomain);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: [{ display_order: 'asc' }, { created_at: 'desc' }],
    });

    return products.map(ProductPrismaMapper.toDomain);
  }

  async create(product: Product): Promise<Product> {
    const created = await this.prisma.product.create({
      data: ProductPrismaMapper.toPersistence(product),
    });

    return ProductPrismaMapper.toDomain(created);
  }

  async update(product: Product): Promise<Product> {
    const updated = await this.prisma.product.update({
      where: { id: product.id },
      data: ProductPrismaMapper.toPersistence(product),
    });

    return ProductPrismaMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    return product ? ProductPrismaMapper.toDomain(product) : null;
  }
}
