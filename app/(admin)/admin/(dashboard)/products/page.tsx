import { prisma } from "@/lib/db/prisma";
import ProductsTable from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Inventory & Catalogue
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Product Management
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your high jewellery collection, hallmark specifications, imagery and live visibility.
        </p>
      </div>

      <ProductsTable initialProducts={products} categories={categories} />
    </div>
  );
}
