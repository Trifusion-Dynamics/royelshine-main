import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { collectionSchema } from "@/lib/validations/admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const collections = await prisma.collection.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return NextResponse.json({ success: true, collections });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = collectionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, slug, description, bannerImage, isFeatured, isPublished, displayOrder, productIds } =
      result.data;

    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, message: "A collection with this slug already exists." }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: { name, slug, description, bannerImage, isFeatured, isPublished, displayOrder },
    });

    if (productIds && productIds.length > 0) {
      for (let i = 0; i < productIds.length; i++) {
        await prisma.collectionProduct.create({
          data: {
            collectionId: collection.id,
            productId: productIds[i],
            sortOrder: i,
          },
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "COLLECTION_CREATED",
        entityType: "Collection",
        entityId: collection.id,
        details: `Created collection ${collection.name}.`,
      },
    });

    return NextResponse.json({ success: true, collection }, { status: 201 });
  } catch (error) {
    console.error("Failed to create collection:", error);
    return NextResponse.json({ success: false, message: "Server error creating collection." }, { status: 500 });
  }
}
