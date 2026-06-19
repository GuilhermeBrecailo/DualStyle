import { z } from "zod";
import { DomainError } from "../../errors";

const schema = z
  .string()
  .min(1, "Título é obrigatório")
  .max(100, "Título deve ter no máximo 100 caracteres");

export class ProductTitle {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): ProductTitle {
    const result = schema.safeParse(value);
    if (!result.success) {
      throw new DomainError(result.error.errors[0].message);
    }
    return new ProductTitle(result.data);
  }

  get value(): string {
    return this._value;
  }
}
