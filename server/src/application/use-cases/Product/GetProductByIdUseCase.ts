import { Product } from "../../../domain/entities/Product/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ErrorClient } from "../../../domain/errors";

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({ id }: { id: string }): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new ErrorClient("Produto não encontrado");
    return product;
  }
}
