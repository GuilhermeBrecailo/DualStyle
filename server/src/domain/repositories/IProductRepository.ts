import { Product } from "../entities/Product/Product";

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findAllActive(): Promise<Product[]>;
}
