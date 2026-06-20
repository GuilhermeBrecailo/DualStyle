import { Product } from "../../../domain/entities/Product/Product";
import { DomainError } from "../../../domain/errors";

const validInput = {
  title: "Camiseta DualStyle",
  description: "Design exclusivo street wear",
  image_url: "https://example.com/img.jpg",
  shopee_link: "https://shopee.com.br/product/123",
};

describe("Product.create()", () => {
  it("cria produto com dados válidos", () => {
    const product = Product.create(validInput);
    expect(product.id).toBeDefined();
    expect(product.title).toBe(validInput.title);
    expect(product.description).toBe(validInput.description);
    expect(product.image_url).toBe(validInput.image_url);
    expect(product.shopee_link).toBe(validInput.shopee_link);
    expect(product.active).toBe(true);
    expect(product.created_at).toBeInstanceOf(Date);
  });

  it("lança DomainError quando título está vazio", () => {
    expect(() => Product.create({ ...validInput, title: "" })).toThrow(DomainError);
  });

  it("lança DomainError quando título excede 100 caracteres", () => {
    expect(() =>
      Product.create({ ...validInput, title: "a".repeat(101) })
    ).toThrow(DomainError);
  });

  it("lança DomainError quando image_url é inválida", () => {
    expect(() =>
      Product.create({ ...validInput, image_url: "not-a-url" })
    ).toThrow(DomainError);
  });

  it("lança DomainError quando shopee_link é inválido", () => {
    expect(() =>
      Product.create({ ...validInput, shopee_link: "not-a-url" })
    ).toThrow(DomainError);
  });

  it("cria produto sem description (campo opcional)", () => {
    const product = Product.create({
      title: validInput.title,
      image_url: validInput.image_url,
      shopee_link: validInput.shopee_link,
    });
    expect(product.description).toBeUndefined();
  });
});

describe("Product.restore()", () => {
  it("restaura produto a partir de DTO", () => {
    const dto = {
      id: "uuid-123",
      title: "Camiseta",
      image_url: "https://example.com/img.jpg",
      shopee_link: "https://shopee.com.br/123",
      active: false,
      sizes: [],
      featured: false,
      created_at: new Date("2026-01-01"),
      updated_at: new Date("2026-01-02"),
    };
    const product = Product.restore(dto);
    expect(product.id).toBe(dto.id);
    expect(product.active).toBe(false);
    expect(product.created_at).toEqual(dto.created_at);
  });
});

describe("product.update()", () => {
  it("atualiza campos fornecidos e renova updated_at", () => {
    const product = Product.create(validInput);
    const before = product.updated_at;
    product.update({ title: "Novo Título" });
    expect(product.title).toBe("Novo Título");
    expect(product.updated_at.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it("lança DomainError ao atualizar title com valor inválido", () => {
    const product = Product.create(validInput);
    expect(() => product.update({ title: "" })).toThrow(DomainError);
  });

  it("não altera campos não fornecidos", () => {
    const product = Product.create(validInput);
    product.update({ title: "Novo" });
    expect(product.image_url).toBe(validInput.image_url);
    expect(product.shopee_link).toBe(validInput.shopee_link);
  });
});

describe("product.toggleActive()", () => {
  it("inverte active de true para false", () => {
    const product = Product.create(validInput);
    expect(product.active).toBe(true);
    product.toggleActive();
    expect(product.active).toBe(false);
  });

  it("inverte active de false para true", () => {
    const product = Product.restore({
      ...validInput,
      id: "x",
      active: false,
      sizes: [],
      featured: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    product.toggleActive();
    expect(product.active).toBe(true);
  });
});

describe("product.toDTO()", () => {
  it("retorna todos os campos serializados", () => {
    const product = Product.create(validInput);
    const dto = product.toDTO();
    expect(dto.id).toBe(product.id);
    expect(dto.title).toBe(validInput.title);
    expect(dto.active).toBe(true);
    expect(dto.created_at).toBeInstanceOf(Date);
  });
});
