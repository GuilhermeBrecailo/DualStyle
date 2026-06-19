import { Product } from "../../../domain/entities/Product/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class GetAllActiveProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAllActive();
  }
}
