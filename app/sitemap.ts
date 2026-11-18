import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://royalshinejewellery.com";

  // Static routes
  const staticRoutes = [
    "",
    "/products",
    "/collections",
    "/about",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic products
  let products: { slug: string; updatedAt: Date }[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.error("Sitemap product fetch error:", error);
  }

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Dynamic collections
  let collections: { slug: string; updatedAt: Date }[] = [];
  try {
    collections = await prisma.collection.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.error("Sitemap collection fetch error:", error);
  }

  const collectionRoutes = collections.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Dynamic categories
  let categories: { slug: string; updatedAt: Date }[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { isVisible: true },
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.error("Sitemap category fetch error:", error);
  }

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes, ...categoryRoutes];
}
