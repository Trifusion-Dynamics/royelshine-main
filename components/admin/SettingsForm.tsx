"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2, AlertCircle, Sliders } from "lucide-react";

interface SettingsData {
  brandName: string;
  tagLine?: string | null;
  logoUrl?: string | null;
  contactEmail: string;
  phone: string;
  whatsappNumber: string;
  showroomAddress: string;
  businessHours: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  defaultCurrency: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
}

interface SettingsFormProps {
  initialSettings: SettingsData;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<SettingsData>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Failed to update settings.");
      } else {
        setSaved(true);
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error updating settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {saved && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Website settings successfully saved. Changes are now reflected live across the public storefront.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. BRAND & IDENTITY */}
      <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-white border-b border-zinc-800 pb-3">
          1. Brand Identity & Visual Assets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Brand Name *</label>
            <input
              type="text"
              required
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Brand Tagline</label>
            <input
              type="text"
              value={formData.tagLine || ""}
              onChange={(e) => setFormData({ ...formData, tagLine: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Logo Asset Path / URL</label>
            <input
              type="text"
              value={formData.logoUrl || ""}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Default Currency</label>
            <input
              type="text"
              value={formData.defaultCurrency}
              onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>
        </div>
      </div>

      {/* 2. CONTACT & BOUTIQUE LOCATION */}
      <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-white border-b border-zinc-800 pb-3">
          2. Showroom Location & Concierge Lines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Contact Phone *</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">WhatsApp Concierge Number *</label>
            <input
              type="text"
              required
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-zinc-300 font-medium mb-1">Official Enquiries Email *</label>
            <input
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-zinc-300 font-medium mb-1">Showroom Address *</label>
            <input
              type="text"
              required
              value={formData.showroomAddress}
              onChange={(e) => setFormData({ ...formData, showroomAddress: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-zinc-300 font-medium mb-1">Operating & Showroom Hours *</label>
            <input
              type="text"
              required
              value={formData.businessHours}
              onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>
        </div>
      </div>

      {/* 3. SOCIAL CHANNELS */}
      <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-white border-b border-zinc-800 pb-3">
          3. Social Media Presence
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Instagram URL</label>
            <input
              type="url"
              value={formData.instagramUrl || ""}
              onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Facebook URL</label>
            <input
              type="url"
              value={formData.facebookUrl || ""}
              onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>
          <div>
            <label className="block text-zinc-300 font-medium mb-1">YouTube URL</label>
            <input
              type="url"
              value={formData.youtubeUrl || ""}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>
        </div>
      </div>

      {/* 4. SEO DEFAULTS */}
      <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-white border-b border-zinc-800 pb-3">
          4. Global SEO Meta Defaults
        </h3>
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Default Meta Title *</label>
            <input
              type="text"
              required
              value={formData.defaultSeoTitle}
              onChange={(e) => setFormData({ ...formData, defaultSeoTitle: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Default Meta Description *</label>
            <textarea
              rows={3}
              required
              value={formData.defaultSeoDescription}
              onChange={(e) => setFormData({ ...formData, defaultSeoDescription: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-[#C5A265] hover:bg-[#AA874C] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Saving Settings..." : "Save Website Settings"}</span>
        </button>
      </div>
    </form>
  );
}
