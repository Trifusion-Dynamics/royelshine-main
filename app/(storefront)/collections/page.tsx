import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { ArrowRight, Sparkles } from "lucide-react";



export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
          Exclusive Haute Joaillerie
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1A1A] mt-2">
          Signature Collections
        </h1>
        <div className="w-16 h-[1.5px] bg-[#C5A265] mx-auto mt-4" />
        <p className="text-xs sm:text-sm text-zinc-600 mt-4 leading-relaxed font-light">
          Each Royal Shine collection represents a unique facet of Indian jewellery heritage: from
          syndicate uncut polki bridal sets to immaculate natural diamond solitaires and hallmarked
          925 sterling silver artifacts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {collections.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className="group relative h-[440px] sm:h-[480px] rounded-sm overflow-hidden border border-[#EAE4D9] bg-zinc-900 block shadow-md hover:shadow-2xl transition-all duration-500"
          >
            {col.bannerImage && (
              <Image
                src={col.bannerImage}
                alt={col.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-90"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 flex flex-col justify-end text-white">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#C5A265] font-semibold mb-1">
                <Sparkles className="w-3 h-3 text-[#C5A265]" />
                <span>{col._count.products} Exclusive Pieces</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-[#DFCA9B] transition-colors">
                {col.name}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 mt-2 line-clamp-3 font-light leading-relaxed">
                {col.description}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#C5A265] group-hover:text-[#DFCA9B] transition-colors">
                <span>View Collection Pieces</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
