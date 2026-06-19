import { Product } from "../../../domain/entities/Product/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ErrorClient } from "../../../domain/errors";

interface Input {
  id: string;
  title?: string;
  description?: string;
  image_url?: string;
  shopee_link?: string;
  active?: boolean;
}

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: Input): Promise<Product> {
    const product = await this.productRepository.findById(input.id);
    if (!product) throw new ErrorClient("Produto não encontrado");

    product.update({
      title: input.title,
      description: input.description,
      image_url: input.image_url,
      shopee_link: input.shopee_link,
      active: input.active,
    });

    return this.productRepository.update(product);
  }
}
