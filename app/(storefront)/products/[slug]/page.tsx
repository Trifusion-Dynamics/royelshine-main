import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import ProductDetailViewer from "@/components/storefront/ProductDetailViewer";
import ProductCard from "@/components/storefront/ProductCard";
import { ChevronRight } from "lucide-react";



interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const title = product.seoTitle || `${product.name} | Royal Shine Jewellery`;
  const description =
    product.seoDescription ||
    product.shortDescription ||
    `Discover ${product.name} handcrafted in ${product.purity || "22K gold"} at Royal Shine Jewellery.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.mainImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { name: true, slug: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, url: true, alt: true },
      },
    },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  // Fetch related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isPublished: true,
    },
    take: 4,
    include: {
      category: { select: { name: true, slug: true } },
    },
  });

  const settings = await prisma.websiteSettings.findUnique({ where: { id: "default" } });

  // Product JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [product.mainImage],
    description: product.shortDescription || product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Royal Shine Jewellery",
    },
    offers: {
      "@type": "Offer",
      url: `https://royalshinejewellery.com/products/${product.slug}`,
      priceCurrency: product.currency || "INR",
      price: product.price ? product.price.toString() : "0",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#C5A265] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-zinc-400" />
          <Link href="/products" className="hover:text-[#C5A265] transition-colors">
            Jewellery
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-zinc-400" />
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-[#C5A265] transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-zinc-400" />
          <span className="text-[#1A1A1A] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Interactive Product Detail Viewer */}
        <ProductDetailViewer
          product={product}
          whatsappNumber={settings?.whatsappNumber}
        />

        {/* Related Jewellery Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-14 border-t border-[#EAE4D9]">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
                Harmonious Pairings
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-1">
                You May Also Admire
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                whatsappNumber={settings?.whatsappNumber}
              />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
