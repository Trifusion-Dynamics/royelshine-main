import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { categorySchema } from "@/lib/validations/admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return NextResponse.json({ success: true, categories });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

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

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, message: "A category with this slug already exists." }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name, slug, description, image, heroBanner, displayOrder, isVisible },
    });

    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "CATEGORY_CREATED",
        entityType: "Category",
        entityId: category.id,
        details: `Created category ${category.name}.`,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json({ success: false, message: "Server error creating category." }, { status: 500 });
  }
}
