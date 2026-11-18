import { prisma } from "@/lib/db/prisma";
import CollectionsManager from "@/components/admin/CollectionsManager";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Curated Showcases
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Signature Collections
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Curate themed haute joaillerie suites such as Imperial Bridal, Temple Antiquities, and Solitaire Symphony.
        </p>
      </div>

      <CollectionsManager initialCollections={collections} />
    </div>
  );
}
