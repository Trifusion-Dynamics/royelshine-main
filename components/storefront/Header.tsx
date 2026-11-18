"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Phone,
  MessageCircle,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  settings?: {
    brandName?: string;
    phone?: string;
    whatsappNumber?: string;
    showroomAddress?: string;
  };
}

export default function Header({ settings }: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const phone = settings?.phone || "+91 98765 43210";
  const whatsappNumber = settings?.whatsappNumber || "+919876543210";
  const cleanPhone = phone.replace(/\s+/g, "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Necklaces", href: "/categories/necklaces" },
    { label: "Rings", href: "/categories/rings" },
    { label: "Bangles", href: "/categories/bangles-bracelets" },
    { label: "Earrings", href: "/categories/earrings" },
    { label: "Bridal Heirloom", href: "/categories/bridal-jewellery" },
    { label: "Mangalsutra", href: "/categories/mangalsutra" },
    { label: "Silver", href: "/categories/silver-jewellery" },
    { label: "All Jewellery", href: "/products" },
    { label: "Our Story", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full bg-[#FAF8F5] sticky top-0 z-50 shadow-sm border-b border-[#EAE4D9]">
      {/* 1. Announcement Bar */}
      <div className="bg-[#1A1A1A] text-[#FAF8F5] text-xs py-2 px-4 tracking-wider uppercase">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A265] animate-pulse" />
            <span className="hidden sm:inline">100% BIS Hallmarked 22K Gold & Certified Natural Diamonds</span>
            <span className="sm:hidden">100% BIS Hallmarked Jewellery</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-sans">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello Royal Shine Jewellery, I would like to enquire about your exquisite collections."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#C5A265] hover:text-[#DFCA9B] transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Concierge</span>
            </a>
            <span className="text-zinc-600">|</span>
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-1 hover:text-[#C5A265] transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span className="hidden md:inline">{phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1A1A1A] hover:text-[#C5A265] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo & Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
              <Image
                src="/images/Royal-Shine-Logo.png"
                alt="Royal Shine Jewellery Logo"
                fill
                sizes="56px"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#9A7737] transition-colors">
                ROYAL SHINE
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#C5A265] font-medium -mt-1">
                JEWELLERY
              </span>
            </div>
          </Link>

          {/* Search bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-md mx-6"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search handcrafted necklaces, solitaires, kundan..."
              className="w-full bg-[#FFFFFF] border border-[#EAE4D9] rounded-full py-2.5 pl-4 pr-11 text-xs tracking-wide text-[#1A1A1A] placeholder:text-[#6B655E] focus:outline-none focus:border-[#C5A265] focus:ring-1 focus:ring-[#C5A265] transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 p-1 text-[#6B655E] hover:text-[#C5A265] transition-colors"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Header Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Mobile search trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-[#1A1A1A] hover:text-[#C5A265] transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Direct Enquiry CTA */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 border border-[#C5A265] bg-[#C5A265] text-[#FFFFFF] text-xs font-medium uppercase tracking-wider rounded-sm shadow-sm hover:bg-[#B89354] hover:border-[#B89354] transition-all duration-300"
            >
              Book Viewing
            </Link>
          </div>
        </div>

        {/* Mobile search field expandable */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewels, bridal sets, rings..."
              className="w-full bg-white border border-[#EAE4D9] rounded-full py-2 pl-4 pr-10 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C5A265]"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 p-1 text-zinc-500 hover:text-[#C5A265]"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* 3. Primary Navigation Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-[#EAE4D9] bg-[#FFFFFF]/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center space-x-7 py-3 text-xs tracking-[0.14em] uppercase font-medium text-[#1A1A1A]">
            {navLinks.slice(1, 10).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-[#C5A265] transition-colors duration-200 py-1 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C5A265] transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* 4. Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE4D9] bg-[#FAF8F5] px-6 py-6 space-y-4 animate-fade-in shadow-xl">
          <ul className="space-y-3 divide-y divide-[#EAE4D9]">
            {navLinks.map((item) => (
              <li key={item.href} className="pt-2 first:pt-0">
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium tracking-wide text-[#1A1A1A] hover:text-[#C5A265] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-[#EAE4D9] space-y-3">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center py-3 bg-[#C5A265] text-white text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#AA874C] transition-colors"
            >
              Book Private Consultation
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 border border-[#C5A265] text-[#1A1A1A] text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#F5F2EB] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Direct WhatsApp Chat
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
