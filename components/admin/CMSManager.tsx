"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Star, Sparkles, X, AlertCircle } from "lucide-react";

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string | null;
  linkUrl?: string | null;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

interface TestimonialItem {
  id: string;
  customerName: string;
  location?: string | null;
  quote: string;
  rating: number;
  isPublished: boolean;
  displayOrder: number;
}

interface CMSManagerProps {
  initialBanners: BannerItem[];
  initialTestimonials: TestimonialItem[];
}

export default function CMSManager({ initialBanners, initialTestimonials }: CMSManagerProps) {
  const router = useRouter();
  const [banners, setBanners] = useState(initialBanners);
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  // Banner Modal State
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [isNewBanner, setIsNewBanner] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    linkUrl: "",
    imageUrl: "",
    displayOrder: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const handleOpenNewBanner = () => {
    setBannerForm({
      title: "",
      subtitle: "",
      linkUrl: "/products",
      imageUrl: "",
      displayOrder: banners.length + 1,
      isActive: true,
    });
    setEditingBanner(null);
    setIsNewBanner(true);
  };

  const handleOpenEditBanner = (b: BannerItem) => {
    setBannerForm({
      title: b.title,
      subtitle: b.subtitle || "",
      linkUrl: b.linkUrl || "",
      imageUrl: b.imageUrl,
      displayOrder: b.displayOrder,
      isActive: b.isActive,
    });
    setEditingBanner(b);
    setIsNewBanner(false);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isNewBanner
      ? "/api/admin/cms/banners"
      : `/api/admin/cms/banners/${editingBanner?.id}`;
    const method = isNewBanner ? "POST" : "PUT";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (isNewBanner) {
          setBanners((prev) => [...prev, data.banner]);
        } else {
          setBanners((prev) =>
            prev.map((b) => (b.id === data.banner.id ? data.banner : b))
          );
        }
        setIsNewBanner(false);
        setEditingBanner(null);
        router.refresh();
      }
    } catch {
      alert("Error saving banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero banner?")) return;
    try {
      const res = await fetch(`/api/admin/cms/banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        router.refresh();
      }
    } catch {
      alert("Error deleting banner.");
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. HERO BANNERS MANAGEMENT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h2 className="font-serif text-xl font-bold text-white">Homepage Hero Banners</h2>
            <p className="text-xs text-zinc-400">
              Control luxury promotional campaign banners and primary calls-to-action on the storefront.
            </p>
          </div>
          <button
            onClick={handleOpenNewBanner}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C5A265] hover:bg-[#AA874C] text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Banner</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-[#1A1A1A] border border-zinc-800 rounded-sm overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full bg-zinc-900">
                <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {b.isActive ? (
                    <span className="px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-bold rounded">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-zinc-800/90 text-zinc-400 text-[10px] font-bold rounded">
                      INACTIVE
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">{b.title}</h4>
                  {b.subtitle && (
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{b.subtitle}</p>
                  )}
                  {b.linkUrl && (
                    <span className="text-[11px] text-[#C5A265] block mt-1">Link: {b.linkUrl}</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs">
                  <span className="text-zinc-500">Order: {b.displayOrder}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditBanner(b)}
                      className="p-1 text-zinc-400 hover:text-[#C5A265]"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="p-1 text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. TESTIMONIALS SECTION */}
      <div className="space-y-4 pt-6 border-t border-zinc-800">
        <div className="pb-3 border-b border-zinc-800">
          <h2 className="font-serif text-xl font-bold text-white">Patron Testimonials</h2>
          <p className="text-xs text-zinc-400">
            Showcase reviews and acclaim from distinguished patrons and brides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#1A1A1A] border border-zinc-800 rounded-sm p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-[#C5A265]">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 italic font-serif leading-relaxed">
                  “{t.quote}”
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800">
                <h4 className="font-semibold text-xs text-white">{t.customerName}</h4>
                {t.location && <span className="text-[11px] text-zinc-500">{t.location}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Modal */}
      {(isNewBanner || editingBanner) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#1A1A1A] border border-zinc-800 rounded-sm p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">
                {isNewBanner ? "Create Hero Campaign Banner" : "Edit Hero Banner"}
              </h3>
              <button
                onClick={() => {
                  setIsNewBanner(false);
                  setEditingBanner(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="e.g. The Royal Symphony of Fine Jewels"
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Subtitle / Campaign Message</label>
                <textarea
                  rows={2}
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Banner Image URL / Path *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  placeholder="e.g. /images/Bridal-jewellery/royal-shine-bridal-jewellery-collection-hero.webp"
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Call-to-Action Link URL</label>
                <input
                  type="text"
                  value={bannerForm.linkUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                  placeholder="/collections/imperial-bridal-heritage"
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    value={bannerForm.displayOrder}
                    onChange={(e) =>
                      setBannerForm({ ...bannerForm, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={bannerForm.isActive}
                      onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                      className="rounded bg-zinc-800 border-zinc-700 text-[#C5A265] focus:ring-0"
                    />
                    <span>Active Banner</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewBanner(false);
                    setEditingBanner(null);
                  }}
                  className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-sm hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#C5A265] hover:bg-[#AA874C] disabled:opacity-50 text-white font-semibold rounded-sm shadow-md"
                >
                  {loading ? "Saving..." : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
