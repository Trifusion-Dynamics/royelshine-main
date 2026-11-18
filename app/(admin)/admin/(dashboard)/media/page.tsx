import { prisma } from "@/lib/db/prisma";
import MediaLibrary from "@/components/admin/MediaLibrary";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const imagesDir = path.join(process.cwd(), "public", "images");
  const mediaList: { id: string; name: string; url: string; category: string }[] = [];

  try {
    const scanDir = (dir: string, baseCat: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath, entry.name);
        } else if (/\.(png|jpe?g|webp|svg)$/i.test(entry.name)) {
          const relPath = fullPath
            .replace(path.join(process.cwd(), "public"), "")
            .replace(/\\/g, "/");
          mediaList.push({
            id: relPath,
            name: entry.name.replace(/\.[^/.]+$/, "").replace(/royal-shine-|-original/g, " "),
            url: relPath,
            category: baseCat || "general",
          });
        }
      }
    };

    if (fs.existsSync(imagesDir)) {
      scanDir(imagesDir, "general");
    }
  } catch (error) {
    console.error("Error reading public/images:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Asset Management
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Media Library & Photography
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Explore and 1-click copy asset URLs for high jewellery products, collections, and campaign banners.
        </p>
      </div>

      <MediaLibrary initialAssets={mediaList} />
    </div>
  );
}
