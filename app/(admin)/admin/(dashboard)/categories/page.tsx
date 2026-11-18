import { prisma } from "@/lib/db/prisma";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Catalogue Classification
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Jewellery Categories
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage product categories, thumbnail imagery, hero banners, and storefront navigation order.
        </p>
      </div>

      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
