import { Product } from "../../../domain/entities/Product/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ErrorClient } from "../../../domain/errors";
import { CreateProductUseCase } from "../../../application/use-cases/Product/CreateProductUseCase";
import { UpdateProductUseCase } from "../../../application/use-cases/Product/UpdateProductUseCase";
import { DeleteProductUseCase } from "../../../application/use-cases/Product/DeleteProductUseCase";
import { ToggleProductUseCase } from "../../../application/use-cases/Product/ToggleProductUseCase";
import { GetAllProductsUseCase } from "../../../application/use-cases/Product/GetAllProductsUseCase";
import { GetAllActiveProductsUseCase } from "../../../application/use-cases/Product/GetAllActiveProductsUseCase";
import { GetProductByIdUseCase } from "../../../application/use-cases/Product/GetProductByIdUseCase";

const makeProduct = (overrides = {}) =>
  Product.create({
    title: "Camiseta DualStyle",
    image_url: "https://example.com/img.jpg",
    shopee_link: "https://shopee.com.br/123",
    ...overrides,
  });

const makeRepo = (overrides: Partial<IProductRepository> = {}): IProductRepository => ({
  create: jest.fn(async (p) => p),
  update: jest.fn(async (p) => p),
  delete: jest.fn(async () => {}),
  findById: jest.fn(async () => null),
  findAll: jest.fn(async () => []),
  findAllActive: jest.fn(async () => []),
  ...overrides,
});

// ─── CreateProductUseCase ───────────────────────────────────────────────────

describe("CreateProductUseCase", () => {
  it("cria e persiste produto com dados válidos", async () => {
    const repo = makeRepo();
    const useCase = new CreateProductUseCase(repo);
    const result = await useCase.execute({
      title: "Camiseta DualStyle",
      image_url: "https://example.com/img.jpg",
      shopee_link: "https://shopee.com.br/123",
    });
    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(result.title).toBe("Camiseta DualStyle");
    expect(result.active).toBe(true);
  });
});

// ─── UpdateProductUseCase ───────────────────────────────────────────────────

describe("UpdateProductUseCase", () => {
  it("atualiza produto existente", async () => {
    const product = makeProduct();
    const repo = makeRepo({ findById: jest.fn(async () => product) });
    const useCase = new UpdateProductUseCase(repo);
    await useCase.execute({ id: product.id, title: "Novo Título" });
    expect(repo.update).toHaveBeenCalledWith(product);
    expect(product.title).toBe("Novo Título");
  });

  it("lança ErrorClient quando produto não existe", async () => {
    const repo = makeRepo({ findById: jest.fn(async () => null) });
    const useCase = new UpdateProductUseCase(repo);
    await expect(useCase.execute({ id: "inexistente" })).rejects.toThrow(ErrorClient);
  });
});

// ─── DeleteProductUseCase ───────────────────────────────────────────────────

describe("DeleteProductUseCase", () => {
  it("deleta produto existente", async () => {
    const product = makeProduct();
    const repo = makeRepo({ findById: jest.fn(async () => product) });
    const useCase = new DeleteProductUseCase(repo);
    await useCase.execute({ id: product.id });
    expect(repo.delete).toHaveBeenCalledWith(product.id);
  });

  it("lança ErrorClient quando produto não existe", async () => {
    const repo = makeRepo({ findById: jest.fn(async () => null) });
    const useCase = new DeleteProductUseCase(repo);
    await expect(useCase.execute({ id: "inexistente" })).rejects.toThrow(ErrorClient);
  });
});

// ─── ToggleProductUseCase ───────────────────────────────────────────────────

describe("ToggleProductUseCase", () => {
  it("desativa produto ativo", async () => {
    const product = makeProduct();
    expect(product.active).toBe(true);
    const repo = makeRepo({ findById: jest.fn(async () => product) });
    const useCase = new ToggleProductUseCase(repo);
    await useCase.execute({ id: product.id });
    expect(product.active).toBe(false);
    expect(repo.update).toHaveBeenCalledWith(product);
  });

  it("lança ErrorClient quando produto não existe", async () => {
    const repo = makeRepo({ findById: jest.fn(async () => null) });
    const useCase = new ToggleProductUseCase(repo);
    await expect(useCase.execute({ id: "inexistente" })).rejects.toThrow(ErrorClient);
  });
});

// ─── GetAllProductsUseCase ──────────────────────────────────────────────────

describe("GetAllProductsUseCase", () => {
  it("retorna todos os produtos incluindo inativos", async () => {
    const products = [makeProduct(), makeProduct()];
    const repo = makeRepo({ findAll: jest.fn(async () => products) });
    const useCase = new GetAllProductsUseCase(repo);
    const result = await useCase.execute();
    expect(result).toHaveLength(2);
  });

  it("retorna array vazio quando não há produtos", async () => {
    const repo = makeRepo({ findAll: jest.fn(async () => []) });
    const useCase = new GetAllProductsUseCase(repo);
    const result = await useCase.execute();
    expect(result).toEqual([]);
  });
});

// ─── GetAllActiveProductsUseCase ────────────────────────────────────────────

describe("GetAllActiveProductsUseCase", () => {
  it("retorna apenas produtos ativos", async () => {
    const active = [makeProduct()];
    const repo = makeRepo({ findAllActive: jest.fn(async () => active) });
    const useCase = new GetAllActiveProductsUseCase(repo);
    const result = await useCase.execute();
    expect(result).toHaveLength(1);
    expect(repo.findAllActive).toHaveBeenCalledTimes(1);
  });
});

// ─── GetProductByIdUseCase ──────────────────────────────────────────────────

describe("GetProductByIdUseCase", () => {
  it("retorna produto quando encontrado", async () => {
    const product = makeProduct();
    const repo = makeRepo({ findById: jest.fn(async () => product) });
    const useCase = new GetProductByIdUseCase(repo);
    const result = await useCase.execute({ id: product.id });
    expect(result.id).toBe(product.id);
  });

  it("lança ErrorClient quando produto não encontrado", async () => {
    const repo = makeRepo({ findById: jest.fn(async () => null) });
    const useCase = new GetProductByIdUseCase(repo);
    await expect(useCase.execute({ id: "inexistente" })).rejects.toThrow(ErrorClient);
  });
});
