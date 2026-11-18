import Image from "next/image";
import Link from "next/link";
import NextLink from "next/link";
import { prisma } from "@/lib/db/prisma";
import HeroCarousel from "@/components/storefront/HeroCarousel";
import ProductCard from "@/components/storefront/ProductCard";
import { serializeProducts } from "@/lib/serializers";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gem,
  Award,
  Crown,
  Star,
  Compass,
} from "lucide-react";



export default async function HomePage() {
  // 1. Fetch live banners
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  // 2. Fetch featured collections
  const collections = await prisma.collection.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: { displayOrder: "asc" },
    take: 4,
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  // 3. Fetch all visible categories
  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    orderBy: { displayOrder: "asc" },
  });

  // 4. Fetch Featured Products
  const featuredProducts = await prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
  });

  const serializedFeatured = serializeProducts(featuredProducts);

  // 5. Fetch New Arrivals
  const newArrivals = await prisma.product.findMany({
    where: { isPublished: true, isNewArrival: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
  });

  const serializedNewArrivals = serializeProducts(newArrivals);

  // 6. Fetch Testimonials
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: "asc" },
    take: 3,
  });

  // 7. Fetch Website Settings
  const settings = await prisma.websiteSettings.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section>
        <HeroCarousel banners={banners} />
      </section>

      {/* 2. VALUE PROPOSITION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#EAE4D9] rounded-sm p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-white border border-[#C5A265]/40 rounded-full text-[#C5A265] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#1A1A1A]">
                100% BIS Hallmarked
              </h4>
              <p className="text-[11px] text-zinc-500">Government Certified 22K/18K</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-white border border-[#C5A265]/40 rounded-full text-[#C5A265] flex-shrink-0">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#1A1A1A]">
                Certified Diamonds
              </h4>
              <p className="text-[11px] text-zinc-500">GIA & IGI Graded Natural Gems</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-white border border-[#C5A265]/40 rounded-full text-[#C5A265] flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#1A1A1A]">
                Heirloom Artistry
              </h4>
              <p className="text-[11px] text-zinc-500">Centuries of Master Goldsmithing</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-white border border-[#C5A265]/40 rounded-full text-[#C5A265] flex-shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#1A1A1A]">
                Private Concierge
              </h4>
              <p className="text-[11px] text-zinc-500">Bespoke Design & Viewing</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
            Curated Metier
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2">
            Signature Collections
          </h2>
          <div className="w-16 h-[1.5px] bg-[#C5A265] mx-auto mt-4" />
          <p className="text-xs sm:text-sm text-zinc-600 mt-4 leading-relaxed font-light">
            Every collection tells an illustrious story of Indian royalty, immaculate gemology, and
            timeless elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <NextLink
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group relative h-[380px] rounded-sm overflow-hidden border border-[#EAE4D9] bg-zinc-900 block"
            >
              {col.bannerImage && (
                <Image
                  src={col.bannerImage}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-center transform transition-transform duration-700 group-hover:scale-108 opacity-80 group-hover:opacity-90"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A265] font-medium">
                  {col._count.products} Handcrafted Creations
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1 group-hover:text-[#DFCA9B] transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-zinc-300 mt-2 line-clamp-2 font-light">
                  {col.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#C5A265] uppercase tracking-widest font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </NextLink>
          ))}
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY */}
      <section className="bg-[#F5F2EB]/60 py-16 sm:py-20 border-y border-[#EAE4D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
                Complete Catalogue
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2">
                Discover by Category
              </h2>
            </div>
            <NextLink
              href="/products"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#1A1A1A] hover:text-[#C5A265] transition-colors"
            >
              <span>View All Jewellery</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <NextLink
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group bg-white border border-[#EAE4D9] rounded-sm overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-[#FAF8F5] mb-3">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transform transition-transform duration-500 group-hover:scale-108"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <Compass className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <h3 className="font-serif text-xs sm:text-sm font-semibold text-[#1A1A1A] group-hover:text-[#9A7737] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider">
                  Explore →
                </span>
              </NextLink>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED CREATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
            Masterpieces of Distinction
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2">
            Featured Creations
          </h2>
          <div className="w-16 h-[1.5px] bg-[#C5A265] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {serializedFeatured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={settings?.whatsappNumber}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <NextLink
            href="/products?featured=true"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-all duration-300"
          >
            Explore All Featured Jewels
          </NextLink>
        </div>
      </section>

      {/* 6. CRAFTSMANSHIP & HERITAGE STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1A1A] text-white rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-zinc-800">
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#C5A265] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Three Generations of Mastery</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF8F5] leading-tight">
              The Metier of Royal Indian Goldsmithing
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              At Royal Shine Jewellery, each piece is more than an adornment — it is an immutable legacy.
              Our karigars preserve centuries-old Jadau, Nakshi carving, and Meenakari enamel arts,
              spending hundreds of hours hand-crafting individual foil mounts and hand-polishing pure 22K gold.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-2 border-t border-zinc-800">
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#C5A265]">
                  100%
                </span>
                <span className="text-xs text-zinc-400">BIS Hallmarked Purity Guarantee</span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#C5A265]">
                  1000+
                </span>
                <span className="text-xs text-zinc-400">Bespoke Bridal Heirlooms Created</span>
              </div>
            </div>

            <div className="pt-2">
              <NextLink
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#C5A265] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#AA874C] transition-colors"
              >
                <span>Read Our Heritage Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>
          </div>

          <div className="relative min-h-[360px] lg:min-h-full bg-zinc-900">
            <Image
              src="/images/Bridal-jewellery/royal-shine-gold-kundan-polki-complete-bridal-jewellery-set-original.png"
              alt="Royal Shine Masterpiece"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* 7. NEW ARRIVALS */}
      {serializedNewArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
                Fresh From The Atelier
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2">
                New Arrivals
              </h2>
            </div>
            <NextLink
              href="/products?new=true"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#1A1A1A] hover:text-[#C5A265] transition-colors"
            >
              <span>Explore All New Pieces</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {serializedNewArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings?.whatsappNumber}
              />
            ))}
          </div>
        </section>
      )}

      {/* 8. CLIENT TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-[#FAF8F5] py-16 sm:py-20 border-t border-[#EAE4D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
                Client Reflections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2">
                Patrons of Distinction
              </h2>
              <div className="w-16 h-[1.5px] bg-[#C5A265] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border border-[#EAE4D9] p-8 rounded-sm shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center gap-1 text-[#C5A265]">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-700 italic font-serif leading-relaxed">
                    “{t.quote}”
                  </p>

                  <div className="pt-4 border-t border-[#EAE4D9]/60">
                    <h4 className="font-semibold text-xs sm:text-sm text-[#1A1A1A]">
                      {t.customerName}
                    </h4>
                    {t.location && (
                      <span className="text-[11px] text-zinc-400">{t.location}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. VIP CONCIERGE & APPOINTMENT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#F5F2EB] border border-[#C5A265]/40 rounded-sm p-8 sm:p-14 text-center space-y-4 overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9A7737]">
              Private Showroom Experience
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A]">
              Schedule a Private Viewing with Our Master Jeweller
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
              Experience our bridal trousseau and diamond solitaires in the privacy of our Mumbai VIP
              suite. Customized designs, diamond education, and personalized guidance await you.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <NextLink
                href="/contact"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#C5A265] text-white text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#AA874C] transition-colors shadow-md"
              >
                Reserve Your Appointment
              </NextLink>
              <a
                href={`https://wa.me/${(settings?.whatsappNumber || "+919876543210").replace(
                  /[^0-9]/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors"
              >
                Instant WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
