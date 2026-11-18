"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Sparkles, X, AlertCircle } from "lucide-react";

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  bannerImage?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  _count?: { products: number };
}

interface CollectionsManagerProps {
  initialCollections: CollectionItem[];
}

export default function CollectionsManager({ initialCollections }: CollectionsManagerProps) {
  const router = useRouter();
  const [collections, setCollections] = useState<CollectionItem[]>(initialCollections);
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    bannerImage: "",
    isFeatured: false,
    isPublished: true,
    displayOrder: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpenNew = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      bannerImage: "",
      isFeatured: false,
      isPublished: true,
      displayOrder: collections.length + 1,
    });
    setEditingCollection(null);
    setIsNew(true);
    setErrorMsg("");
  };

  const handleOpenEdit = (col: CollectionItem) => {
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description || "",
      bannerImage: col.bannerImage || "",
      isFeatured: col.isFeatured,
      isPublished: col.isPublished,
      displayOrder: col.displayOrder,
    });
    setEditingCollection(col);
    setIsNew(false);
    setErrorMsg("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const endpoint = isNew
      ? "/api/admin/collections"
      : `/api/admin/collections/${editingCollection?.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Failed to save collection.");
      } else {
        if (isNew) {
          setCollections((prev) => [...prev, data.collection]);
        } else {
          setCollections((prev) =>
            prev.map((c) => (c.id === data.collection.id ? { ...c, ...data.collection } : c))
          );
        }
        setIsNew(false);
        setEditingCollection(null);
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error saving collection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;

    try {
      const res = await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete collection.");
      } else {
        setCollections((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      }
    } catch {
      alert("Network error.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C5A265] hover:bg-[#AA874C] text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Collection</span>
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-zinc-800 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider bg-zinc-900/60">
              <th className="py-3 px-4">Collection</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Pieces</th>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {collections.map((col) => (
              <tr key={col.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {col.bannerImage ? (
                      <div className="relative w-12 h-10 rounded bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0">
                        <Image src={col.bannerImage} alt={col.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-white block">{col.name}</span>
                      <span className="text-[11px] text-zinc-400 line-clamp-1 max-w-xs">
                        {col.description || "No description provided"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-[#C5A265]">
                  /collections/{col.slug}
                </td>
                <td className="py-3.5 px-4 text-zinc-300">
                  {col._count?.products || 0} pieces
                </td>
                <td className="py-3.5 px-4 text-zinc-400">{col.displayOrder}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    {col.isPublished ? (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold rounded-xs">
                        PUBLISHED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-semibold rounded-xs">
                        DRAFT
                      </span>
                    )}
                    {col.isFeatured && (
                      <span className="text-[10px] text-[#C5A265] font-semibold">Featured</span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(col)}
                      className="p-1.5 text-zinc-400 hover:text-[#C5A265] hover:bg-zinc-800 rounded transition-colors"
                      title="Edit Collection"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(col.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / New Modal */}
      {(isNew || editingCollection) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#1A1A1A] border border-zinc-800 rounded-sm p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">
                {isNew ? "Create Signature Collection" : `Edit: ${editingCollection?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsNew(false);
                  setEditingCollection(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      slug: isNew
                        ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
                        : prev.slug,
                    }));
                  }}
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Banner Image URL / Path</label>
                <input
                  type="text"
                  value={formData.bannerImage}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  placeholder="e.g. /images/Bridal-jewellery/royal-shine-bridal-jewellery-collection-hero.webp"
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2.5 text-white focus:outline-none focus:border-[#C5A265]"
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded bg-zinc-800 border-zinc-700 text-[#C5A265] focus:ring-0"
                    />
                    <span>Published</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded bg-zinc-800 border-zinc-700 text-[#C5A265] focus:ring-0"
                    />
                    <span>Featured on Home</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsNew(false);
                    setEditingCollection(null);
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
                  {loading ? "Saving..." : "Save Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
