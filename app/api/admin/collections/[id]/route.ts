import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { collectionSchema } from "@/lib/validations/admin";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

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

    const conflict = await prisma.collection.findFirst({
      where: { id: { not: id }, slug },
    });
    if (conflict) {
      return NextResponse.json({ success: false, message: "A collection with this slug already exists." }, { status: 400 });
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: { name, slug, description, bannerImage, isFeatured, isPublished, displayOrder },
    });

    if (productIds !== undefined) {
      await prisma.collectionProduct.deleteMany({ where: { collectionId: id } });
      for (let i = 0; i < productIds.length; i++) {
        await prisma.collectionProduct.create({
          data: { collectionId: id, productId: productIds[i], sortOrder: i },
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "COLLECTION_UPDATED",
        entityType: "Collection",
        entityId: id,
        details: `Updated collection ${updated.name}.`,
      },
    });

    return NextResponse.json({ success: true, collection: updated });
  } catch (error) {
    console.error("Failed to update collection:", error);
    return NextResponse.json({ success: false, message: "Server error updating collection." }, { status: 500 });
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
    const existing = await prisma.collection.findUnique({ where: { id } });
    await prisma.collection.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "COLLECTION_DELETED",
        entityType: "Collection",
        entityId: id,
        details: `Deleted collection ${existing?.name || id}.`,
      },
    });

    return NextResponse.json({ success: true, message: "Collection deleted successfully." });
  } catch (error) {
    console.error("Failed to delete collection:", error);
    return NextResponse.json({ success: false, message: "Failed to delete collection." }, { status: 500 });
  }
}
