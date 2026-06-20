import { ProductTitle } from "../../value-objects/Product/ProductTitle";
import { ProductImageUrl } from "../../value-objects/Product/ProductImageUrl";
import { ProductShopeeLink } from "../../value-objects/Product/ProductShopeeLink";
import { randomUUID } from "crypto";

export interface ProductDTO {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  shopee_link: string;
  price?: number | null;
  sizes: string[];
  featured: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface ProductProps {
  id: string;
  title: ProductTitle;
  description?: string;
  image_url: ProductImageUrl;
  shopee_link: ProductShopeeLink;
  price?: number | null;
  sizes: string[];
  featured: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class Product {
  private readonly props: ProductProps;

  private constructor(props: ProductProps) {
    this.props = props;
  }

  static create(input: {
    title: string;
    description?: string;
    image_url: string;
    shopee_link: string;
    price?: number | null;
    sizes?: string[];
    featured?: boolean;
  }): Product {
    return new Product({
      id: randomUUID(),
      title: ProductTitle.create(input.title),
      description: input.description,
      image_url: ProductImageUrl.create(input.image_url),
      shopee_link: ProductShopeeLink.create(input.shopee_link),
      price: input.price ?? null,
      sizes: input.sizes ?? [],
      featured: input.featured ?? false,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  static restore(dto: ProductDTO): Product {
    return new Product({
      id: dto.id,
      title: ProductTitle.create(dto.title),
      description: dto.description,
      image_url: ProductImageUrl.create(dto.image_url),
      shopee_link: ProductShopeeLink.create(dto.shopee_link),
      price: dto.price ?? null,
      sizes: dto.sizes ?? [],
      featured: dto.featured ?? false,
      active: dto.active,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
    });
  }

  update(input: {
    title?: string;
    description?: string;
    image_url?: string;
    shopee_link?: string;
    price?: number | null;
    sizes?: string[];
    featured?: boolean;
    active?: boolean;
  }): void {
    if (input.title !== undefined) {
      (this.props as any).title = ProductTitle.create(input.title);
    }
    if (input.description !== undefined) {
      this.props.description = input.description;
    }
    if (input.image_url !== undefined) {
      (this.props as any).image_url = ProductImageUrl.create(input.image_url);
    }
    if (input.shopee_link !== undefined) {
      (this.props as any).shopee_link = ProductShopeeLink.create(input.shopee_link);
    }
    if (input.price !== undefined) {
      this.props.price = input.price;
    }
    if (input.sizes !== undefined) {
      this.props.sizes = input.sizes;
    }
    if (input.featured !== undefined) {
      this.props.featured = input.featured;
    }
    if (input.active !== undefined) {
      this.props.active = input.active;
    }
    this.props.updated_at = new Date();
  }

  toggleActive(): void {
    this.props.active = !this.props.active;
    this.props.updated_at = new Date();
  }

  get id(): string { return this.props.id; }
  get title(): string { return this.props.title.value; }
  get description(): string | undefined { return this.props.description; }
  get image_url(): string { return this.props.image_url.value; }
  get shopee_link(): string { return this.props.shopee_link.value; }
  get price(): number | null | undefined { return this.props.price; }
  get sizes(): string[] { return this.props.sizes; }
  get featured(): boolean { return this.props.featured; }
  get active(): boolean { return this.props.active; }
  get created_at(): Date { return this.props.created_at; }
  get updated_at(): Date { return this.props.updated_at; }

  toDTO(): ProductDTO {
    return {
      id: this.props.id,
      title: this.props.title.value,
      description: this.props.description,
      image_url: this.props.image_url.value,
      shopee_link: this.props.shopee_link.value,
      price: this.props.price,
      sizes: this.props.sizes,
      featured: this.props.featured,
      active: this.props.active,
      created_at: this.props.created_at,
      updated_at: this.props.updated_at,
    };
  }
}
