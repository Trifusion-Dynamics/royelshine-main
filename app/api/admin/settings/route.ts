import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { websiteSettingsSchema } from "@/lib/validations/admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const settings = await prisma.websiteSettings.findUnique({
    where: { id: "default" },
  });

  return NextResponse.json({ success: true, settings });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = websiteSettingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.websiteSettings.upsert({
      where: { id: "default" },
      update: result.data,
      create: {
        id: "default",
        ...result.data,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "SETTINGS_UPDATED",
        entityType: "WebsiteSettings",
        entityId: "default",
        details: "Updated core website settings, contact information and SEO defaults.",
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Failed to update website settings:", error);
    return NextResponse.json({ success: false, message: "Failed to update settings." }, { status: 500 });
  }
}
