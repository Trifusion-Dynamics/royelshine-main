"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, AlertCircle, Sparkles } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface CollectionOption {
  id: string;
  name: string;
}

interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price: string;
  discountedPrice: string;
  mainImage: string;
  galleryImages: string[];
  material: string;
  purity: string;
  weight: string;
  stoneDetails: string;
  dimensions: string;
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  collectionIds: string[];
  seoTitle: string;
  seoDescription: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  categories: CategoryOption[];
  collections: CollectionOption[];
  isEdit?: boolean;
}

export default function ProductForm({
  initialData,
  categories,
  collections,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProductFormData>({
    id: initialData?.id || undefined,
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    sku: initialData?.sku || "",
    categoryId: initialData?.categoryId || (categories[0]?.id || ""),
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    price: initialData?.price ? initialData.price.toString() : "",
    discountedPrice: initialData?.discountedPrice ? initialData.discountedPrice.toString() : "",
    mainImage: initialData?.mainImage || "",
    galleryImages: initialData?.galleryImages || [],
    material: initialData?.material || "22K Yellow Gold",
    purity: initialData?.purity || "22K (916 BIS Hallmarked)",
    weight: initialData?.weight || "",
    stoneDetails: initialData?.stoneDetails || "",
    dimensions: initialData?.dimensions || "",
    inStock: initialData?.inStock ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    isNewArrival: initialData?.isNewArrival ?? false,
    isPublished: initialData?.isPublished ?? true,
    collectionIds: initialData?.collectionIds || [],
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Auto-generate slug from name if not manually edited
  const handleNameChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, name: val };
      if (!isEdit && !prev.slug) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return updated;
    });
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, newGalleryUrl.trim()],
      }));
      setNewGalleryUrl("");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleCollectionToggle = (colId: string) => {
    setFormData((prev) => {
      const exists = prev.collectionIds.includes(colId);
      return {
        ...prev,
        collectionIds: exists
          ? prev.collectionIds.filter((id) => id !== colId)
          : [...prev.collectionIds, colId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setFieldErrors({});

    const endpoint = isEdit ? `/api/admin/products/${formData.id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.errors) {
          setFieldErrors(data.errors);
        } else {
          setErrorMsg(data.message || "Failed to save product.");
        }
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error saving product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 border border-zinc-700 text-zinc-300 text-xs rounded-sm hover:bg-zinc-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-[#C5A265] hover:bg-[#AA874C] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{loading ? "Saving..." : isEdit ? "Update Masterpiece" : "Publish Product"}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. CORE DETAILS */}
      <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-white border-b border-zinc-800 pb-3">
          1. General Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Royal Antique Gold Rani Haar with Ruby & Emerald"
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-[11px] mt-1">{fieldErrors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. royal-antique-gold-rani-haar"
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
            {fieldErrors.slug && (
              <p className="text-red-500 text-[11px] mt-1">{fieldErrors.slug[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g. RS-NK-001"
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
            {fieldErrors.sku && (
              <p className="text-red-500 text-[11px] mt-1">{fieldErrors.sku[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              Primary Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs">
          <label className="block text-zinc-300 font-medium mb-1">Short Description</label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Brief 1-line luxury summary shown on catalogue cards and preview"
            className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
          />
        </div>

        <div className="text-xs">
          <label className="block text-zinc-300 font-medium mb-1">Full Artisan Story & Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed narrative describing craftsmanship, historical inspirations, stones, and styling..."
            className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
          />
        </div>
      </div>

      {/* 2. PRICING & VISIBILITY */}
      <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-white border-b border-zinc-800 pb-3">
          2. Value & Visibility Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Indicative Price (INR ₹)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g. 485000"
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Special / Discounted Price (INR ₹)</label>
            <input
              type="number"
              value={formData.discountedPrice}
              onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
              placeholder="e.g. 460000 (Optional)"
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="rounded bg-zinc-800 border-zinc-700 text-[#C5A265] focus:ring-0"
            />
            <span>Published on Site</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="rounded bg-zinc-800 border-zinc-700 text-[#C5A265] focus:ring-0"
            />
            <span>In Stock / Ready</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="rounded bg-zinc-800 border-zinc-700 text-[#C5A265] focus:ring-0"
            />
            <span>Featured Creation</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
            <input
              type="checkbox"
              checked={formData.isNewArrival}
              onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
              className="rounded bg-zinc-800 border-zinc-700 text-[#C5A265] focus:ring-0"
            />
            <span>New Arrival Badge</span>
          </label>
        </div>
      </div>

      {/* 3. IMAGERY & MEDIA */}
      <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-white border-b border-zinc-800 pb-3">
          3. Imagery & Gallery
        </h3>

        <div className="text-xs space-y-2">
          <label className="block text-zinc-300 font-medium">
            Main Primary Image URL / Path <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.mainImage}
            onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
            placeholder="e.g. /images/necjlace/royal-shine-antique-gold-rani-haar-ruby-emerald-original.png or ImageKit URL"
            className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
          />
          {formData.mainImage && (
            <div className="relative w-28 h-28 mt-2 rounded bg-zinc-900 border border-zinc-700 overflow-hidden">
              <Image src={formData.mainImage} alt="Preview" fill className="object-cover" />
            </div>
          )}
        </div>

        {/* Gallery Images List */}
        <div className="text-xs space-y-3 pt-3 border-t border-zinc-800">
          <label className="block text-zinc-300 font-medium">Additional Gallery Images</label>

          <div className="flex gap-2">
            <input
              type="text"
              value={newGalleryUrl}
              onChange={(e) => setNewGalleryUrl(e.target.value)}
              placeholder="Paste image URL or relative path..."
              className="flex-1 bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
            <button
              type="button"
              onClick={handleAddGalleryImage}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-sm"
            >
              Add to Gallery
            </button>
          </div>

          {formData.galleryImages.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {formData.galleryImages.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-24 rounded bg-zinc-900 border border-zinc-700 overflow-hidden group"
                >
                  <Image src={url} alt="Gallery" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. LUXURY SPECIFICATIONS */}
      <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-white border-b border-zinc-800 pb-3">
          4. Technical Specifications & Hallmarking
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Metal Purity</label>
            <input
              type="text"
              value={formData.purity}
              onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
              placeholder="e.g. 22K (916 BIS Hallmarked)"
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Material Composition</label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="e.g. 22K Antique Yellow Gold"
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Gross Weight</label>
            <input
              type="text"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="e.g. 68.50 grams"
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Dimensions / Length</label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              placeholder="e.g. 24 inches adjustable with Dori"
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="block text-zinc-300 font-medium mb-1">Diamonds & Gemstones Breakdown</label>
          <input
            type="text"
            value={formData.stoneDetails}
            onChange={(e) => setFormData({ ...formData, stoneDetails: e.target.value })}
            placeholder="e.g. Natural Burmese Rubies, Zambian Emerald Cabochons, Basra Seed Pearls"
            className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
          />
        </div>
      </div>

      {/* 5. SIGNATURE COLLECTIONS */}
      {collections.length > 0 && (
        <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-white border-b border-zinc-800 pb-3">
            5. Collection Associations
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {collections.map((col) => {
              const selected = formData.collectionIds.includes(col.id);
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => handleCollectionToggle(col.id)}
                  className={`p-3 text-left border rounded-sm transition-all ${
                    selected
                      ? "border-[#C5A265] bg-[#C5A265]/10 text-white font-semibold"
                      : "border-zinc-800 bg-[#141414] text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className="block font-medium">{col.name}</span>
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    {selected ? "✓ Assigned" : "+ Add"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. SEO METADATA */}
      <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-white border-b border-zinc-800 pb-3">
          6. Search Engine Optimization (SEO)
        </h3>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">SEO Title</label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="e.g. Royal Antique Gold Rani Haar | Royal Shine Jewellery"
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">SEO Meta Description</label>
            <textarea
              rows={2}
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="Meta description for Google search previews..."
              className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end gap-4">
        <Link
          href="/admin/products"
          className="px-6 py-2.5 border border-zinc-700 text-zinc-300 text-xs rounded-sm hover:bg-zinc-800"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-[#C5A265] hover:bg-[#AA874C] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-lg"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
