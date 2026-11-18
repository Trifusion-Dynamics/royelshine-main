import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import ProductCard from "@/components/storefront/ProductCard";
import { ChevronRight, Sparkles } from "lucide-react";



interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({ where: { slug } });

  if (!collection) return { title: "Collection Not Found" };

  const title = collection.seoTitle || `${collection.name} | Royal Shine Jewellery`;
  const description =
    collection.seoDescription ||
    collection.description ||
    `Explore ${collection.name} at Royal Shine Jewellery.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: collection.bannerImage ? [{ url: collection.bannerImage }] : [],
    },
  };
}

export default async function IndividualCollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: {
            include: {
              category: { select: { name: true, slug: true } },
            },
          },
        },
      },
    },
  });

  if (!collection || !collection.isPublished) {
    notFound();
  }

  const settings = await prisma.websiteSettings.findUnique({ where: { id: "default" } });
  const products = collection.products
    .map((cp) => cp.product)
    .filter((p) => p.isPublished);

  return (
    <div>
      {/* Hero Banner for Collection */}
      <div className="relative w-full h-[360px] sm:h-[440px] bg-zinc-950 overflow-hidden flex items-end">
        {collection.bannerImage && (
          <Image
            src={collection.bannerImage}
            alt={collection.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white z-10">
          <nav className="flex items-center gap-2 text-xs text-zinc-300 mb-3">
            <Link href="/" className="hover:text-[#C5A265] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <Link href="/collections" className="hover:text-[#C5A265] transition-colors">
              Collections
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[#DFCA9B] font-medium">{collection.name}</span>
          </nav>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#C5A265] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collection • {products.length} Masterpieces</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            {collection.name}
          </h1>

          {collection.description && (
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-3 font-light leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      {/* Collection Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#EAE4D9] rounded-sm p-8">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
              Creations Coming Soon
            </h3>
            <p className="text-xs text-zinc-500 mt-2">
              New pieces for this collection are currently being handcrafted in our atelier.
            </p>
            <div className="mt-4">
              <Link
                href="/products"
                className="inline-flex px-6 py-2.5 bg-[#C5A265] text-white text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#AA874C]"
              >
                Browse All Jewellery
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings?.whatsappNumber}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
