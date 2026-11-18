import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { bannerSchema } from "@/lib/validations/admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const banners = await prisma.banner.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ success: true, banners });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = bannerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: result.data,
    });

    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "BANNER_CREATED",
        entityType: "Banner",
        entityId: banner.id,
        details: `Created banner ${banner.title}.`,
      },
    });

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error) {
    console.error("Failed to create banner:", error);
    return NextResponse.json({ success: false, message: "Server error creating banner." }, { status: 500 });
  }
}
