import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { productSchema } from "@/lib/validations/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      collections: { select: { collectionId: true } },
    },
  });

  if (!product) {
    return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, product });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

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

    // Check slug and SKU uniqueness
    const conflict = await prisma.product.findFirst({
      where: {
        id: { not: id },
        OR: [{ slug }, { sku }],
      },
    });

    if (conflict) {
      return NextResponse.json(
        {
          success: false,
          message: conflict.slug === slug ? "A product with this slug already exists." : "SKU must be unique.",
        },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
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

    // Update gallery images if provided
    if (galleryImages) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.create({
        data: {
          productId: id,
          url: mainImage,
          sortOrder: 0,
          isThumbnail: true,
        },
      });

      for (let i = 0; i < galleryImages.length; i++) {
        if (galleryImages[i] !== mainImage) {
          await prisma.productImage.create({
            data: {
              productId: id,
              url: galleryImages[i],
              sortOrder: i + 1,
            },
          });
        }
      }
    }

    // Update collections
    if (collectionIds !== undefined) {
      await prisma.collectionProduct.deleteMany({ where: { productId: id } });
      for (const colId of collectionIds) {
        await prisma.collectionProduct.create({
          data: { productId: id, collectionId: colId },
        });
      }
    }

    // Log admin activity
    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "PRODUCT_UPDATED",
        entityType: "Product",
        entityId: id,
        details: `Updated product ${updated.name} (${updated.sku}).`,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ success: false, message: "Server error updating product." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "PRODUCT_DELETED",
        entityType: "Product",
        entityId: id,
        details: `Deleted product ${existing.name} (${existing.sku}).`,
      },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product." }, { status: 500 });
  }
}
