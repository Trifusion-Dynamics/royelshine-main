"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Copy, Check, ExternalLink, Image as ImageIcon } from "lucide-react";

interface MediaAssetItem {
  id: string;
  name: string;
  url: string;
  category: string;
  size?: string;
}

interface MediaLibraryProps {
  initialAssets: MediaAssetItem[];
}

export default function MediaLibrary({ initialAssets }: MediaLibraryProps) {
  const [assets, setAssets] = useState<MediaAssetItem[]>(initialAssets);
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("ALL");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const folders = [
    "ALL",
    "necklaces",
    "rings",
    "bangles",
    "earrings",
    "bridal",
    "mangalsutra",
    "payal",
    "silver",
    "general",
  ];

  const filtered = assets.filter((a) => {
    const matchesFolder =
      selectedFolder === "ALL" || a.category.toLowerCase().includes(selectedFolder.toLowerCase());
    const matchesSearch =
      search === "" ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.url.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Search & Folder Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by file name or path..."
            className="w-full bg-[#1A1A1A] border border-zinc-700 rounded-sm py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#C5A265]"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1.5 rounded-sm capitalize transition-colors ${
                selectedFolder === f
                  ? "bg-[#C5A265] text-white font-semibold"
                  : "bg-[#1A1A1A] border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 bg-[#1A1A1A] border border-zinc-800 rounded-sm text-center text-zinc-500">
            No media assets found matching the query.
          </div>
        ) : (
          filtered.map((asset) => {
            const isCopied = copiedUrl === asset.url;
            return (
              <div
                key={asset.id}
                className="group relative bg-[#1A1A1A] border border-zinc-800 rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#C5A265] transition-all"
              >
                <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
                  <Image
                    src={asset.url}
                    alt={asset.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Copy overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <button
                      onClick={() => handleCopy(asset.url)}
                      className="px-3 py-1.5 bg-[#C5A265] text-white text-[11px] font-semibold rounded-xs shadow flex items-center gap-1"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Path</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-2.5">
                  <span className="text-[11px] text-white font-medium block truncate" title={asset.name}>
                    {asset.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-0.5">
                    {asset.category}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
