import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { adminLoginSchema } from "@/lib/validations/admin";
import { createAdminToken, setAdminSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = adminLoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid administrator credentials." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid administrator credentials." },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = await createAdminToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    // Set HTTP-only Cookie
    await setAdminSessionCookie(token);

    // Update last login
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Record activity log
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        action: "ADMIN_LOGIN",
        entityType: "AdminUser",
        entityId: user.id,
        details: `Administrator ${user.fullName} logged in successfully.`,
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
