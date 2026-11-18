import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { bannerSchema } from "@/lib/validations/admin";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const result = bannerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const updated = await prisma.banner.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ success: true, banner: updated });
  } catch (error) {
    console.error("Failed to update banner:", error);
    return NextResponse.json({ success: false, message: "Failed to update banner." }, { status: 500 });
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
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Banner deleted." });
  } catch (error) {
    console.error("Failed to delete banner:", error);
    return NextResponse.json({ success: false, message: "Failed to delete banner." }, { status: 500 });
  }
}
