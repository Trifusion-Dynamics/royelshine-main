import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Gem, Sparkles, MapPin, Phone, Mail, Clock } from "lucide-react";

interface FooterProps {
  settings?: {
    brandName?: string;
    phone?: string;
    contactEmail?: string;
    showroomAddress?: string;
    businessHours?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    youtubeUrl?: string;
  };
}

export default function Footer({ settings }: FooterProps) {
  const brandName = settings?.brandName || "Royal Shine Jewellery";
  const phone = settings?.phone || "+91 98765 43210";
  const email = settings?.contactEmail || "enquiries@royalshinejewellery.com";
  const address =
    settings?.showroomAddress ||
    "Royal Shine Flagship Boutique, Luxury Diamond Souk, Bandra West, Mumbai 400050, India";
  const hours =
    settings?.businessHours || "Monday – Saturday: 10:30 AM – 8:30 PM | Sunday: By Private Appointment";

  return (
    <footer className="bg-[#1A1A1A] text-[#FAF8F5] border-t border-[#333333] pt-16 pb-8">
      {/* 1. Four Pillars of Trust */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-[#C5A265]/30 rounded-sm text-[#C5A265]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base text-[#FAF8F5] font-semibold">100% BIS Hallmarked</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Certified 22K (916) and 18K (750) pure gold verified by government testing bureaus.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-[#C5A265]/30 rounded-sm text-[#C5A265]">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base text-[#FAF8F5] font-semibold">Certified Diamonds</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Every solitaire and diamond creation is accompanied by GIA or IGI certificates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-[#C5A265]/30 rounded-sm text-[#C5A265]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base text-[#FAF8F5] font-semibold">Master Craftsmanship</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Heirloom techniques preserved across three generations of master goldsmiths.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-900 border border-[#C5A265]/30 rounded-sm text-[#C5A265]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base text-[#FAF8F5] font-semibold">Bespoke Concierge</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Private showroom viewings, custom design consultations and insured global transit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/Royal-Shine-Logo.png"
                  alt="Royal Shine Logo"
                  fill
                  sizes="40px"
                  className="object-contain invert brightness-200"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#FAF8F5]">
                  ROYAL SHINE
                </span>
                <span className="block text-[9px] tracking-[0.3em] uppercase text-[#C5A265] font-medium">
                  JEWELLERY
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Royal Shine Jewellery embodies regal Indian heritage fused with modern haute joaillerie.
              From syndicate uncut polki bridal necklaces to pristine natural diamond solitaires, our creations
              celebrate unforgettable milestones of life.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings?.instagramUrl || "https://instagram.com/royalshinejewellery"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-[#C5A265] hover:bg-zinc-700 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={settings?.facebookUrl || "https://facebook.com/royalshinejewellery"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-[#C5A265] hover:bg-zinc-700 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
              <a
                href={settings?.youtubeUrl || "https://youtube.com/@royalshinejewellery"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-[#C5A265] hover:bg-zinc-700 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#C5A265] mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/categories/necklaces" className="hover:text-[#C5A265] transition-colors">
                  Necklaces & Rani Haars
                </Link>
              </li>
              <li>
                <Link href="/categories/rings" className="hover:text-[#C5A265] transition-colors">
                  Solitaire & Gemstone Rings
                </Link>
              </li>
              <li>
                <Link href="/categories/bangles-bracelets" className="hover:text-[#C5A265] transition-colors">
                  Bangles & Kada Bracelets
                </Link>
              </li>
              <li>
                <Link href="/categories/earrings" className="hover:text-[#C5A265] transition-colors">
                  Temple Jhumkas & Chandbalis
                </Link>
              </li>
              <li>
                <Link href="/categories/bridal-jewellery" className="hover:text-[#C5A265] transition-colors">
                  Imperial Bridal Trousseau
                </Link>
              </li>
              <li>
                <Link href="/categories/mangalsutra" className="hover:text-[#C5A265] transition-colors">
                  Sacred Mangalsutras
                </Link>
              </li>
              <li>
                <Link href="/categories/silver-jewellery" className="hover:text-[#C5A265] transition-colors">
                  925 Sterling Silver
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#C5A265] mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-[#C5A265] transition-colors">
                  Our Heritage & Metier
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#C5A265] transition-colors">
                  Signature Collections
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C5A265] transition-colors">
                  Book Private Consultation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#C5A265] transition-colors">
                  Jewellery Care & FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#C5A265] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#C5A265] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Flagship Showroom */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#C5A265] mb-4">
              Flagship Boutique
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-zinc-400">
              <MapPin className="w-4 h-4 text-[#C5A265] flex-shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-400">
              <Phone className="w-4 h-4 text-[#C5A265] flex-shrink-0" />
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-[#C5A265]">
                {phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-400">
              <Mail className="w-4 h-4 text-[#C5A265] flex-shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-[#C5A265]">
                {email}
              </a>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-zinc-400 pt-1">
              <Clock className="w-4 h-4 text-[#C5A265] flex-shrink-0 mt-0.5" />
              <span>{hours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Hallmark Attribution */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-800 text-center sm:flex sm:justify-between sm:items-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} {brandName}. All Rights Reserved.</p>
        <p className="mt-2 sm:mt-0">
          Handcrafted with devotion in Mumbai, India • Catalogue & Bespoke Enquiry Platform
        </p>
      </div>
    </footer>
  );
}
