import { NextResponse } from "next/server";
import { clearAdminSessionCookie, getAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST() {
  try {
    const session = await getAdminSession();
    if (session) {
      await prisma.activityLog.create({
        data: {
          adminId: session.userId,
          action: "ADMIN_LOGOUT",
          entityType: "AdminUser",
          entityId: session.userId,
          details: `Administrator ${session.fullName} logged out.`,
        },
      });
    }

    await clearAdminSessionCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
