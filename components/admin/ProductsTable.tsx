"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Search, Plus, Sparkles, Check, X, AlertCircle } from "lucide-react";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price?: unknown;
  discountedPrice?: unknown;
  mainImage: string;
  material?: string | null;
  purity?: string | null;
  weight?: string | null;
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  category?: { id: string; name: string } | null;
}

interface ProductsTableProps {
  initialProducts: ProductRow[];
  categories: { id: string; name: string }[];
}

export default function ProductsTable({ initialProducts, categories }: ProductsTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || p.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    setDeleting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Failed to delete product.");
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setDeleteId(null);
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error deleting product.");
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (val: unknown) => {
    if (val == null) return "—";
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(num)) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-lg">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, SKU..."
              className="w-full bg-[#1A1A1A] border border-zinc-700 rounded-sm py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#C5A265]"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#1A1A1A] border border-zinc-700 rounded-sm py-2 px-3 text-xs text-zinc-300 focus:outline-none focus:border-[#C5A265]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C5A265] hover:bg-[#AA874C] text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#1A1A1A] border border-zinc-800 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider bg-zinc-900/60">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Purity & Specs</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No jewellery products match your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0">
                          <Image src={p.mainImage} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <span className="font-semibold text-white block truncate" title={p.name}>
                            {p.name}
                          </span>
                          <span className="text-[11px] text-zinc-400 block mt-0.5">
                            SKU: {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      {p.category?.name || "Uncategorized"}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      <span>{p.purity || p.material || "22K Gold"}</span>
                      {p.weight && (
                        <span className="block text-[11px] text-zinc-500">{p.weight}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-white">
                      {formatPrice(p.discountedPrice || p.price)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {p.isPublished ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold rounded-xs">
                            PUBLISHED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-semibold rounded-xs">
                            DRAFT
                          </span>
                        )}
                        {p.isFeatured && (
                          <span className="text-[10px] text-[#C5A265] flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> Featured
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-zinc-400 hover:text-[#C5A265] hover:bg-zinc-800 rounded transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#1A1A1A] border border-zinc-800 rounded-sm p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-white">Confirm Product Deletion</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to delete this piece from the catalogue? This will also remove its
              gallery images and collection associations.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-zinc-700 text-zinc-300 text-xs rounded-sm hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-sm disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
