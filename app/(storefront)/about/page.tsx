import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Gem, Award, Crown, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Our Heritage & Craftsmanship | Royal Shine Jewellery",
  description:
    "Learn about the legacy of Royal Shine Jewellery: three generations of master Indian goldsmiths, 100% BIS hallmarked 22K gold, and certified solitaire diamonds.",
};

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-12 sm:py-16">
      {/* 1. Header Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
          A Legacy of Regal Splendor
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1A1A] mt-2">
          The Royal Shine Metier
        </h1>
        <div className="w-16 h-[1.5px] bg-[#C5A265] mx-auto mt-4" />
        <p className="text-xs sm:text-sm text-zinc-600 mt-5 leading-relaxed font-light">
          Founded on the uncompromising pursuit of perfection, Royal Shine Jewellery has been the
          trusted destination for Indian royalty, discerning connoisseurs, and modern brides seeking
          heirloom jewellery crafted with eternal elegance.
        </p>
      </section>

      {/* 2. Visual Atelier Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-4/3 rounded-sm overflow-hidden border border-[#EAE4D9] bg-zinc-900 shadow-xl">
            <Image
              src="/images/Bridal-jewellery/royal-shine-antique-gold-kundan-polki-choker-rani-haar-set-original.png"
              alt="Royal Shine Masterpiece"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
              Generations of Mastery
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A]">
              Where Ancient Heritage Meets Contemporary Haute Joaillerie
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
              Indian jewellery is not merely decorative; it is an intimate repository of sacred culture,
              family blessings, and artistic legacy. Our ateliers in Mumbai and Jaipur continue to practice
              the historic art of <em>Jadau</em> and <em>Nakshi</em> engraving that once adorned the Mughal
              emperors and Rajput courts.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
              Every polki diamond is hand-selected for its pristine crystal transparency and set inside pure
              22-karat gold foil bezels that reflect natural light like water.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "100% BIS Hallmarked (916) 22K pure gold guarantee",
                "Natural conflict-free diamonds certified by GIA & IGI",
                "Pure Syndicate Polki with Basra seed pearls & untreated Zambian emeralds",
                "Complete customization with private jewellery designer consultations",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-zinc-700">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A265] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Four Pillars of Royal Shine */}
      <section className="bg-[#F5F2EB]/60 py-16 sm:py-20 border-y border-[#EAE4D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
              Our Guiding Principles
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mt-2">
              The Pillars of Excellence
            </h2>
            <div className="w-16 h-[1.5px] bg-[#C5A265] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border border-[#EAE4D9] p-8 rounded-sm text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] border border-[#C5A265]/40 flex items-center justify-center text-[#C5A265]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Purity Guarantee</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Zero compromise on metal purity. Every gram of gold carries the official BIS Hallmark
                laser engraving.
              </p>
            </div>

            <div className="bg-white border border-[#EAE4D9] p-8 rounded-sm text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] border border-[#C5A265]/40 flex items-center justify-center text-[#C5A265]">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Ethical Sourcing</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Conflict-free diamonds and gemstones sourced through certified Kimberley Process
                compliant channels.
              </p>
            </div>

            <div className="bg-white border border-[#EAE4D9] p-8 rounded-sm text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] border border-[#C5A265]/40 flex items-center justify-center text-[#C5A265]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Artisan Preservation</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Sustaining master Indian artisan families and providing ethical livelihoods to hereditary
                silversmiths and goldsmiths.
              </p>
            </div>

            <div className="bg-white border border-[#EAE4D9] p-8 rounded-sm text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] border border-[#C5A265]/40 flex items-center justify-center text-[#C5A265]">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Private Concierge</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Discreet private suite consultations, bespoke bridal trousseau styling, and lifetime
                complimentary cleaning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#1A1A1A] text-white p-10 sm:p-14 rounded-sm space-y-4 max-w-3xl mx-auto">
          <Sparkles className="w-6 h-6 text-[#C5A265] mx-auto" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Begin Your Heirloom Journey
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto font-light leading-relaxed">
            Allow us to craft a piece uniquely yours, or explore our curated creations in person at our
            Mumbai flagship boutique.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-[#C5A265] hover:bg-[#AA874C] text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors"
            >
              Book Showroom Viewing
            </Link>
            <Link
              href="/products"
              className="px-8 py-3.5 border border-zinc-600 hover:border-white text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors"
            >
              Browse Jewellery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
