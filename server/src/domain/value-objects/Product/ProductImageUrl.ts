import { z } from "zod";
import { DomainError } from "../../errors";

const schema = z.string().url("URL da imagem inválida").min(1, "URL da imagem é obrigatória");

export class ProductImageUrl {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): ProductImageUrl {
    const result = schema.safeParse(value);
    if (!result.success) {
      throw new DomainError(result.error.errors[0].message);
    }
    return new ProductImageUrl(result.data);
  }

  get value(): string {
    return this._value;
  }
}
