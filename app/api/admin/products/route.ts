import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { productSchema } from "@/lib/validations/admin";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";

  const where: Prisma.ProductWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true } },
      images: { select: { id: true, url: true } },
      collections: {
        include: { collection: { select: { id: true, name: true } } },
      },
    },
  });

  return NextResponse.json({ success: true, products });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = productSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      name,
      slug,
      sku,
      categoryId,
      shortDescription,
      description,
      price,
      discountedPrice,
      currency,
      mainImage,
      galleryImages,
      material,
      purity,
      weight,
      stoneDetails,
      dimensions,
      inStock,
      isFeatured,
      isNewArrival,
      isPublished,
      collectionIds,
      seoTitle,
      seoDescription,
    } = result.data;

    // Check slug and sku uniqueness
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { sku }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: existing.slug === slug ? "A product with this slug already exists." : "SKU must be unique.",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        categoryId,
        shortDescription,
        description,
        price,
        discountedPrice,
        currency,
        mainImage,
        material,
        purity,
        weight,
        stoneDetails,
        dimensions,
        inStock,
        isFeatured,
        isNewArrival,
        isPublished,
        seoTitle,
        seoDescription,
      },
    });

    // Create gallery images
    if (galleryImages && galleryImages.length > 0) {
      for (let i = 0; i < galleryImages.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: galleryImages[i],
            sortOrder: i + 1,
          },
        });
      }
    } else {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: mainImage,
          sortOrder: 0,
          isThumbnail: true,
        },
      });
    }

    // Connect to collections
    if (collectionIds && collectionIds.length > 0) {
      for (const colId of collectionIds) {
        await prisma.collectionProduct.create({
          data: {
            productId: product.id,
            collectionId: colId,
          },
        });
      }
    }

    // Log admin activity
    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "PRODUCT_CREATED",
        entityType: "Product",
        entityId: product.id,
        details: `Created product ${product.name} (${product.sku}).`,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { success: false, message: "Server error creating product." },
      { status: 500 }
    );
  }
}
