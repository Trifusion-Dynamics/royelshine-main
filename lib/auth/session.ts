import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "royal-shine-super-secret-jwt-key-32-characters-min";
const key = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE_NAME || "royal_shine_admin_session";

export interface AdminSessionPayload {
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

export async function createAdminToken(payload: AdminSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyAdminToken(token);
    if (!payload) return null;

    // Verify user is still active in database
    const user = await prisma.adminUser.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, fullName: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) return null;

    return {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  } catch (error) {
    console.error("Failed to verify admin session:", error);
    return null;
  }
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
