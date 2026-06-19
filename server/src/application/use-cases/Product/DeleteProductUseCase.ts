import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ErrorClient } from "../../../domain/errors";

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({ id }: { id: string }): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new ErrorClient("Produto não encontrado");
    await this.productRepository.delete(id);
  }
}
