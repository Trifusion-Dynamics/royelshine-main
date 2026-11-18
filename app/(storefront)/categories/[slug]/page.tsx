import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import ProductCard from "@/components/storefront/ProductCard";
import { serializeProducts } from "@/lib/serializers";
import type { Prisma } from "@prisma/client";
import { ChevronRight, SlidersHorizontal } from "lucide-react";



interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | Royal Shine Jewellery`,
    description:
      category.description ||
      `Explore luxury handcrafted ${category.name} at Royal Shine Jewellery.`,
  };
}

export default async function CategoryListingPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category || !category.isVisible) {
    notFound();
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      isPublished: true,
    },
    orderBy,
    include: {
      category: { select: { name: true, slug: true } },
    },
  });

  const serializedProducts = serializeProducts(products);

  const settings = await prisma.websiteSettings.findUnique({ where: { id: "default" } });

  return (
    <div>
      {/* Category Hero / Header */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-zinc-950 overflow-hidden flex items-end">
        {category.heroBanner && (
          <Image
            src={category.heroBanner}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-65"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full text-white z-10">
          <nav className="flex items-center gap-2 text-xs text-zinc-300 mb-3">
            <Link href="/" className="hover:text-[#C5A265] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <Link href="/products" className="hover:text-[#C5A265] transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[#DFCA9B] font-medium">{category.name}</span>
          </nav>

          <span className="text-[10px] uppercase tracking-widest text-[#C5A265] font-semibold block mb-1">
            Haute Joaillerie Catalogue
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-2 font-light leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Sort & Count Header */}
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#EAE4D9]">
          <span className="text-xs text-zinc-500 font-medium">
            Showing {products.length} {category.name}
          </span>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 hidden sm:inline">Sort by:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: "newest", label: "Newest", query: "" },
                { id: "price_asc", label: "Price: Low to High", query: "?sort=price_asc" },
                { id: "price_desc", label: "Price: High to Low", query: "?sort=price_desc" },
              ].map((s) => (
                <Link
                  key={s.id}
                  href={`/categories/${category.slug}${s.query}`}
                  className={`px-2.5 py-1 text-xs rounded-xs transition-colors ${
                    (sort || "newest") === s.id
                      ? "bg-[#1A1A1A] text-white font-medium"
                      : "bg-white border border-[#EAE4D9] text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#EAE4D9] rounded-sm p-8">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
              No Products in this Category
            </h3>
            <p className="text-xs text-zinc-500 mt-2">
              Our master artisans are currently handcrafting new items for this collection.
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
            {serializedProducts.map((product) => (
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
