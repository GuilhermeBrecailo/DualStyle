import { z } from "zod";
import { DomainError } from "../../errors";

const schema = z.string().url("Link do Shopee inválido").min(1, "Link do Shopee é obrigatório");

export class ProductShopeeLink {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): ProductShopeeLink {
    const result = schema.safeParse(value);
    if (!result.success) {
      throw new DomainError(result.error.errors[0].message);
    }
    return new ProductShopeeLink(result.data);
  }

  get value(): string {
    return this._value;
  }
}
