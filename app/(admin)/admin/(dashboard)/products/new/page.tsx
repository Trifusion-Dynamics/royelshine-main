import { prisma } from "@/lib/db/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
    prisma.collection.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          New Catalogue Entry
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Add Fine Jewellery Product
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Publish a new creation to the Royal Shine public collection with specifications and imagery.
        </p>
      </div>

      <ProductForm categories={categories} collections={collections} />
    </div>
  );
}
