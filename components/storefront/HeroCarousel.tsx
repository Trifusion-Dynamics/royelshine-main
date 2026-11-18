"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface BannerItem {
  id: string;
  title: string;
  subtitle: string | null;
  linkUrl: string | null;
  imageUrl: string;
  mobileImageUrl?: string | null;
}

interface HeroCarouselProps {
  banners: BannerItem[];
}

export default function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) {
    return (
      <div className="relative w-full h-[520px] bg-zinc-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-[#C5A265]">Royal Shine Jewellery</h1>
          <p className="mt-2 text-zinc-400">Timeless Elegance & Exquisite Craftsmanship</p>
        </div>
      </div>
    );
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-[480px] sm:h-[580px] lg:h-[680px] overflow-hidden bg-zinc-950">
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background image */}
            <div className="relative w-full h-full">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                priority={index === 0}
                className="object-cover object-center transform scale-105 transition-transform duration-7000 ease-out"
                sizes="100vw"
              />
              {/* Subtle dark luxury gradient overlay to ensure perfect text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content text */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
                <div className="max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A]/80 border border-[#C5A265]/40 rounded-full text-[11px] uppercase tracking-widest text-[#C5A265]">
                    <Sparkles className="w-3 h-3 text-[#C5A265]" />
                    <span>Exclusive Haute Joaillerie</span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#FAF8F5] leading-tight tracking-tight">
                    {banner.title}
                  </h1>

                  {banner.subtitle && (
                    <p className="text-sm sm:text-base lg:text-lg text-zinc-300 font-light leading-relaxed max-w-xl">
                      {banner.subtitle}
                    </p>
                  )}

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Link
                      href={banner.linkUrl || "/products"}
                      className="px-7 py-3.5 bg-[#C5A265] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#AA874C] transition-all duration-300 shadow-lg hover:shadow-[#C5A265]/20"
                    >
                      Explore Collection
                    </Link>
                    <Link
                      href="/contact"
                      className="px-7 py-3.5 border border-[#FAF8F5]/80 text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold hover:bg-white/10 hover:border-white transition-all duration-300"
                    >
                      Book Private Viewing
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white hover:bg-[#C5A265] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white hover:bg-[#C5A265] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {banners.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setCurrentIndex(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  dotIndex === currentIndex ? "w-8 bg-[#C5A265]" : "w-2 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
