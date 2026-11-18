"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, Send, ShieldCheck, Sparkles, Truck, RefreshCw, ZoomIn } from "lucide-react";
import EnquiryModal from "./EnquiryModal";

interface ProductDetailViewerProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price?: unknown;
    discountedPrice?: unknown;
    mainImage: string;
    images: { id: string; url: string; alt?: string | null }[];
    shortDescription?: string | null;
    description?: string | null;
    material?: string | null;
    purity?: string | null;
    weight?: string | null;
    stoneDetails?: string | null;
    dimensions?: string | null;
    inStock: boolean;
    isFeatured: boolean;
    isNewArrival: boolean;
    category?: { name: string; slug: string } | null;
  };
  whatsappNumber?: string;
}

export default function ProductDetailViewer({
  product,
  whatsappNumber = "+919876543210",
}: ProductDetailViewerProps) {
  const allImages = [
    { id: "main", url: product.mainImage, alt: product.name },
    ...(product.images || []).filter((img) => img.url !== product.mainImage),
  ];

  const [activeImage, setActiveImage] = useState(allImages[0]?.url || product.mainImage);
  const [modalOpen, setModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

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
    `Hello Royal Shine Jewellery, I would like to enquire about ${product.name} (SKU: ${product.sku}). Please share pricing and availability.`
  )}`;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* LEFT COLUMN: PRODUCT IMAGERY */}
        <div className="space-y-4">
          {/* Main Large Image */}
          <div
            className="relative aspect-square w-full bg-white border border-[#EAE4D9] rounded-sm overflow-hidden group cursor-crosshair"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover object-center transition-transform duration-500 ${
                isZoomed ? "scale-150" : "group-hover:scale-105"
              }`}
            />

            <div className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-xs rounded-full text-zinc-700 shadow-sm opacity-70 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4" />
            </div>

            <div className="absolute bottom-3 left-3 bg-[#1A1A1A]/80 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 uppercase tracking-widest rounded-xs">
              {isZoomed ? "Click to reset zoom" : "Click to zoom"}
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => {
                    setActiveImage(img.url);
                    setIsZoomed(false);
                  }}
                  className={`relative w-20 h-20 flex-shrink-0 bg-white border rounded-sm overflow-hidden transition-all ${
                    activeImage === img.url
                      ? "border-[#C5A265] ring-1 ring-[#C5A265]"
                      : "border-[#EAE4D9] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILS & ACTIONS */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.category && (
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
                  {product.category.name}
                </span>
              )}
              {product.isNewArrival && (
                <span className="px-2 py-0.5 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-wider font-semibold">
                  New Arrival
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-2">
              <span>SKU: <strong className="text-zinc-700">{product.sku}</strong></span>
              <span>•</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {product.inStock ? "Available for Bespoke Ordering" : "Made to Order"}
              </span>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="p-4 bg-white border border-[#EAE4D9] rounded-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                Indicative Value
              </span>
              {formattedDiscounted ? (
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                    {formattedDiscounted}
                  </span>
                  <span className="text-sm text-zinc-400 line-through">
                    {formattedPrice}
                  </span>
                </div>
              ) : formattedPrice ? (
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-0.5 block">
                  {formattedPrice}
                </span>
              ) : (
                <span className="font-serif text-xl font-bold text-[#9A7737] mt-0.5 block">
                  Price on Request
                </span>
              )}
            </div>

            <div className="text-right text-[11px] text-zinc-500">
              <span>Includes Insured Delivery</span>
              <span className="block text-[#C5A265] font-medium">Bespoke Custom Sizing</span>
            </div>
          </div>

          {/* Short Narrative */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
              {product.shortDescription}
            </p>
          )}

          {/* Main Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full py-4 bg-[#C5A265] hover:bg-[#AA874C] text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Enquire & Reserve Private Viewing</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 border border-emerald-600 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Instant WhatsApp Concierge</span>
            </a>
          </div>

          {/* Technical Specifications Table */}
          <div className="pt-4 border-t border-[#EAE4D9]">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A] mb-3">
              Jewellery Specifications & Hallmarking
            </h3>

            <div className="bg-white border border-[#EAE4D9] rounded-sm divide-y divide-[#EAE4D9] text-xs">
              {product.purity && (
                <div className="flex justify-between p-3">
                  <span className="text-zinc-500">Metal & Purity</span>
                  <span className="font-semibold text-[#1A1A1A]">{product.purity}</span>
                </div>
              )}
              {product.material && (
                <div className="flex justify-between p-3">
                  <span className="text-zinc-500">Material Composition</span>
                  <span className="font-semibold text-[#1A1A1A]">{product.material}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between p-3">
                  <span className="text-zinc-500">Gross Weight</span>
                  <span className="font-semibold text-[#1A1A1A]">{product.weight}</span>
                </div>
              )}
              {product.stoneDetails && (
                <div className="flex justify-between p-3">
                  <span className="text-zinc-500">Diamonds & Gemstones</span>
                  <span className="font-semibold text-[#1A1A1A] text-right max-w-xs">{product.stoneDetails}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between p-3">
                  <span className="text-zinc-500">Dimensions / Length</span>
                  <span className="font-semibold text-[#1A1A1A]">{product.dimensions}</span>
                </div>
              )}
              <div className="flex justify-between p-3">
                <span className="text-zinc-500">Certification</span>
                <span className="font-semibold text-[#1A1A1A]">BIS Hallmarked / GIA / IGI Certified</span>
              </div>
            </div>
          </div>

          {/* Royal Assurance Badges */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-zinc-600">
              <ShieldCheck className="w-4 h-4 text-[#C5A265] flex-shrink-0" />
              <span>100% Certified Authentic</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-600">
              <Truck className="w-4 h-4 text-[#C5A265] flex-shrink-0" />
              <span>Complimentary Insured Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Description & Craftsmanship Metier */}
      {product.description && (
        <div className="mt-16 pt-12 border-t border-[#EAE4D9] max-w-4xl">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
            Artisan Story & Heritage
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-1 mb-4">
            About this Masterpiece
          </h2>
          <div className="prose prose-zinc text-xs sm:text-sm text-zinc-700 leading-relaxed whitespace-pre-line font-light">
            {product.description}
          </div>
        </div>
      )}

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
