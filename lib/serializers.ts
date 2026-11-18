import type { Decimal } from "@prisma/client/runtime/library";

export interface StorefrontProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string | null;
  discountedPrice: string | null;
  currency: string;
  mainImage: string;
  images?: { id: string; url: string; alt?: string | null }[];
  shortDescription?: string | null;
  description?: string | null;
  material?: string | null;
  purity?: string | null;
  weight?: string | null;
  stoneDetails?: string | null;
  dimensions?: string | null;
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  category?: { name: string; slug: string } | null;
}

export function serializePrice(value: Decimal | number | string | null | undefined): string | null {
  if (value == null) return null;
  return String(value);
}

export function serializeProduct(product: Record<string, unknown>): StorefrontProduct {
  return {
    ...product,
    price: serializePrice(product.price as Decimal | number | string | null | undefined),
    discountedPrice: serializePrice(
      product.discountedPrice as Decimal | number | string | null | undefined
    ),
  } as StorefrontProduct;
}

export function serializeProducts(products: Record<string, unknown>[]): StorefrontProduct[] {
  return products.map(serializeProduct);
}
