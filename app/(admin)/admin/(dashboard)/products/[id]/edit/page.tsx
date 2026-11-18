import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        collections: { select: { collectionId: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
    prisma.collection.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    categoryId: product.categoryId,
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    price: product.price ? product.price.toString() : "",
    discountedPrice: product.discountedPrice ? product.discountedPrice.toString() : "",
    mainImage: product.mainImage,
    galleryImages: product.images.map((img) => img.url),
    material: product.material || "",
    purity: product.purity || "",
    weight: product.weight || "",
    stoneDetails: product.stoneDetails || "",
    dimensions: product.dimensions || "",
    inStock: product.inStock,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isPublished: product.isPublished,
    collectionIds: product.collections.map((c) => c.collectionId),
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Catalogue Editor
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Edit {product.name}
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Modify specifications, photography, pricing, or collection associations.
        </p>
      </div>

      <ProductForm
        initialData={initialData}
        categories={categories}
        collections={collections}
        isEdit
      />
    </div>
  );
}
