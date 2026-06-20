import { Product } from "../../../domain/entities/Product/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

interface Input {
  title: string;
  description?: string;
  image_url: string;
  shopee_link: string;
  price?: number | null;
  sizes?: string[];
  featured?: boolean;
}

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: Input): Promise<Product> {
    const product = Product.create(input);
    return this.productRepository.create(product);
  }
}
