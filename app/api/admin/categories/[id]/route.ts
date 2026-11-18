import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { categorySchema } from "@/lib/validations/admin";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const result = categorySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, slug, description, image, heroBanner, displayOrder, isVisible } = result.data;

    const conflict = await prisma.category.findFirst({
      where: { id: { not: id }, slug },
    });
    if (conflict) {
      return NextResponse.json({ success: false, message: "A category with this slug already exists." }, { status: 400 });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name, slug, description, image, heroBanner, displayOrder, isVisible },
    });

    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "CATEGORY_UPDATED",
        entityType: "Category",
        entityId: id,
        details: `Updated category ${updated.name}.`,
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json({ success: false, message: "Server error updating category." }, { status: 500 });
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
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category: it is assigned to ${count} products. Reassign or delete the products first.`,
        },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    await prisma.category.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "CATEGORY_DELETED",
        entityType: "Category",
        entityId: id,
        details: `Deleted category ${existing?.name || id}.`,
      },
    });

    return NextResponse.json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json({ success: false, message: "Failed to delete category." }, { status: 500 });
  }
}
