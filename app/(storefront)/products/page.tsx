import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import ProductCard from "@/components/storefront/ProductCard";
import type { Prisma } from "@prisma/client";
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Sparkles } from "lucide-react";



interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    collection?: string;
    purity?: string;
    featured?: string;
    new?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;

  const searchQuery = resolvedParams.search || "";
  const categorySlug = resolvedParams.category || "";
  const collectionSlug = resolvedParams.collection || "";
  const purityFilter = resolvedParams.purity || "";
  const isFeatured = resolvedParams.featured === "true";
  const isNew = resolvedParams.new === "true";
  const sortBy = resolvedParams.sort || "newest";
  const currentPage = parseInt(resolvedParams.page || "1", 10) || 1;
  const pageSize = 12;

  // Build Prisma where conditions
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
      { shortDescription: { contains: searchQuery, mode: "insensitive" } },
      { sku: { contains: searchQuery, mode: "insensitive" } },
      { material: { contains: searchQuery, mode: "insensitive" } },
      { stoneDetails: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (collectionSlug) {
    where.collections = {
      some: {
        collection: { slug: collectionSlug },
      },
    };
  }

  if (purityFilter) {
    where.purity = { contains: purityFilter, mode: "insensitive" };
  }

  if (isFeatured) {
    where.isFeatured = true;
  }

  if (isNew) {
    where.isNewArrival = true;
  }

  // Sorting
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sortBy === "price_asc") orderBy = { price: "asc" };
  if (sortBy === "price_desc") orderBy = { price: "desc" };
  if (sortBy === "name_asc") orderBy = { name: "asc" };

  // Fetch data
  const [products, totalCount, allCategories, allCollections, settings] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.collection.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.websiteSettings.findUnique({ where: { id: "default" } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Helper to construct filter query urls
  const createFilterUrl = (param: string, value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (categorySlug && param !== "category") params.set("category", categorySlug);
    if (collectionSlug && param !== "collection") params.set("collection", collectionSlug);
    if (purityFilter && param !== "purity") params.set("purity", purityFilter);
    if (isFeatured && param !== "featured") params.set("featured", "true");
    if (isNew && param !== "new") params.set("new", "true");
    if (sortBy !== "newest" && param !== "sort") params.set("sort", sortBy);

    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    return `/products?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Header */}
      <div className="border-b border-[#EAE4D9] pb-8 mb-8 text-center sm:text-left">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
          Curated Fine Jewels
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-1">
          {categorySlug
            ? allCategories.find((c) => c.slug === categorySlug)?.name || "Jewellery Collection"
            : collectionSlug
            ? allCollections.find((c) => c.slug === collectionSlug)?.name || "High Jewellery Collection"
            : isFeatured
            ? "Featured Masterpieces"
            : isNew
            ? "New Jewellery Arrivals"
            : "All Jewellery Creations"}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 mt-2 font-light">
          Showing {products.length} of {totalCount} exquisite creations handcrafted with 22K gold,
          certified solitaires, and heirloom gemstones.
        </p>

        {/* Active Filters Pill Bar */}
        {(searchQuery || categorySlug || collectionSlug || purityFilter || isFeatured || isNew) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3">
            <span className="text-xs text-zinc-400 font-medium">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EAE4D9] rounded-full text-xs text-zinc-700">
                Search: “{searchQuery}”
                <Link href={createFilterUrl("search", "")} className="text-zinc-400 hover:text-zinc-800">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {categorySlug && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EAE4D9] rounded-full text-xs text-zinc-700">
                Category: {allCategories.find((c) => c.slug === categorySlug)?.name}
                <Link href={createFilterUrl("category", "")} className="text-zinc-400 hover:text-zinc-800">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {collectionSlug && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EAE4D9] rounded-full text-xs text-zinc-700">
                Collection: {allCollections.find((c) => c.slug === collectionSlug)?.name}
                <Link href={createFilterUrl("collection", "")} className="text-zinc-400 hover:text-zinc-800">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {purityFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EAE4D9] rounded-full text-xs text-zinc-700">
                Purity: {purityFilter}
                <Link href={createFilterUrl("purity", "")} className="text-zinc-400 hover:text-zinc-800">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {isFeatured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EAE4D9] rounded-full text-xs text-zinc-700">
                Featured Only
                <Link href={createFilterUrl("featured", "")} className="text-zinc-400 hover:text-zinc-800">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {isNew && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EAE4D9] rounded-full text-xs text-zinc-700">
                New Arrivals
                <Link href={createFilterUrl("new", "")} className="text-zinc-400 hover:text-zinc-800">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            <Link
              href="/products"
              className="text-xs text-[#9A7737] hover:underline font-semibold ml-2"
            >
              Clear All
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR FILTERS (DESKTOP) */}
        <aside className="hidden lg:block space-y-8 pr-4 border-r border-[#EAE4D9]/80">
          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A] mb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A265]" />
              <span>Categories</span>
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href={createFilterUrl("category", "")}
                  className={`block py-1 hover:text-[#C5A265] transition-colors ${
                    !categorySlug ? "text-[#C5A265] font-semibold" : "text-zinc-600"
                  }`}
                >
                  All Categories
                </Link>
              </li>
              {allCategories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={createFilterUrl("category", c.slug)}
                    className={`block py-1 hover:text-[#C5A265] transition-colors ${
                      categorySlug === c.slug ? "text-[#C5A265] font-semibold" : "text-zinc-600"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Signature Collections */}
          <div className="pt-6 border-t border-[#EAE4D9]/80">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A] mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A265]" />
              <span>Collections</span>
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href={createFilterUrl("collection", "")}
                  className={`block py-1 hover:text-[#C5A265] transition-colors ${
                    !collectionSlug ? "text-[#C5A265] font-semibold" : "text-zinc-600"
                  }`}
                >
                  All Collections
                </Link>
              </li>
              {allCollections.map((col) => (
                <li key={col.id}>
                  <Link
                    href={createFilterUrl("collection", col.slug)}
                    className={`block py-1 hover:text-[#C5A265] transition-colors ${
                      collectionSlug === col.slug ? "text-[#C5A265] font-semibold" : "text-zinc-600"
                    }`}
                  >
                    {col.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Metal & Purity Filter */}
          <div className="pt-6 border-t border-[#EAE4D9]/80">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#1A1A1A] mb-3">
              Gold Purity & Metals
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {["22K", "18K", "925 Silver"].map((purity) => (
                <Link
                  key={purity}
                  href={purityFilter === purity ? createFilterUrl("purity", "") : createFilterUrl("purity", purity)}
                  className={`px-3 py-1.5 border rounded-xs transition-colors ${
                    purityFilter === purity
                      ? "border-[#C5A265] bg-[#C5A265]/10 text-[#9A7737] font-semibold"
                      : "border-[#EAE4D9] bg-white text-zinc-600 hover:border-zinc-400"
                  }`}
                >
                  {purity}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT GRID CONTAINER */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D9]">
            <span className="text-xs text-zinc-500">{totalCount} items found</span>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400 hidden sm:inline">Sort by:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: "newest", label: "Newest" },
                  { id: "price_asc", label: "Price: Low to High" },
                  { id: "price_desc", label: "Price: High to Low" },
                ].map((s) => (
                  <Link
                    key={s.id}
                    href={createFilterUrl("sort", s.id)}
                    className={`px-2.5 py-1 text-xs rounded-xs transition-colors ${
                      sortBy === s.id
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
            <div className="bg-white border border-[#EAE4D9] rounded-sm p-12 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] border border-[#EAE4D9] flex items-center justify-center text-[#C5A265]">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                No Jewellery Creations Found
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                We could not find items matching your selected criteria. Try adjusting your search or
                clearing the filters.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex px-6 py-2.5 bg-[#C5A265] text-white text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#AA874C] transition-colors"
                >
                  View All Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsappNumber={settings?.whatsappNumber}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-8 border-t border-[#EAE4D9] flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <Link
                    key={pageNum}
                    href={createFilterUrl("page", pageNum.toString())}
                    className={`w-9 h-9 flex items-center justify-center text-xs rounded-sm transition-colors ${
                      isCurrent
                        ? "bg-[#C5A265] text-white font-bold"
                        : "bg-white border border-[#EAE4D9] text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
