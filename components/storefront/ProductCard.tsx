"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Eye, Sparkles } from "lucide-react";
import EnquiryModal from "./EnquiryModal";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price?: unknown;
    discountedPrice?: unknown;
    mainImage: string;
    purity?: string | null;
    material?: string | null;
    weight?: string | null;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    inStock?: boolean;
    category?: {
      name: string;
      slug: string;
    } | null;
  };
  whatsappNumber?: string;
}

export default function ProductCard({
  product,
  whatsappNumber = "+919876543210",
}: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const formatPrice = (val: unknown) => {
    if (val == null) return null;
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(num)) return null;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formattedPrice = formatPrice(product.price);
  const formattedDiscounted = formatPrice(product.discountedPrice);

  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hello Royal Shine Jewellery, I am enquiring about ${product.name} (SKU: ${product.sku}).`
  )}`;

  return (
    <>
      <div className="group relative bg-white border border-[#EAE4D9] rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-semibold rounded-xs shadow-sm">
              New Arrival
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 bg-[#C5A265] text-white text-[10px] uppercase tracking-widest font-semibold rounded-xs shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
          {product.purity && (
            <span className="px-2 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200 text-[10px] uppercase tracking-wider font-medium rounded-xs">
              {product.purity.split(" ")[0]}
            </span>
          )}
        </div>

        {/* Product Image Area */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#FBF9F6]">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <Image
              src={product.mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Quick Hover Action Overlays */}
          <div className="absolute inset-x-0 bottom-3 px-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-auto">
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 py-2 px-3 bg-[#1A1A1A]/90 hover:bg-[#C5A265] text-white text-[11px] uppercase tracking-wider font-medium rounded-xs transition-colors backdrop-blur-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              Enquire
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Direct WhatsApp enquiry"
              className="p-2 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xs transition-colors shadow-md flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <Link
              href={`/products/${product.slug}`}
              aria-label="View product details"
              className="p-2 bg-white/90 hover:bg-white text-zinc-900 rounded-xs transition-colors shadow-md flex items-center justify-center"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
          <div>
            {product.category && (
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C5A265]">
                {product.category.name}
              </span>
            )}

            <Link href={`/products/${product.slug}`}>
              <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1A1A1A] group-hover:text-[#9A7737] transition-colors line-clamp-2 mt-1">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
              <span>SKU: {product.sku}</span>
              {product.weight && <span>• {product.weight}</span>}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#EAE4D9]/60 flex items-center justify-between">
            <div>
              {formattedDiscounted ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                    {formattedDiscounted}
                  </span>
                  <span className="text-xs text-zinc-400 line-through">
                    {formattedPrice}
                  </span>
                </div>
              ) : formattedPrice ? (
                <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  {formattedPrice}
                </span>
              ) : (
                <span className="text-xs uppercase tracking-wider text-[#9A7737] font-medium">
                  Price on Request
                </span>
              )}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="text-xs uppercase tracking-wider text-[#C5A265] hover:text-[#9A7737] font-semibold transition-colors"
            >
              Enquire →
            </button>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          sku: product.sku,
          mainImage: product.mainImage,
          purity: product.purity,
          material: product.material,
        }}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
