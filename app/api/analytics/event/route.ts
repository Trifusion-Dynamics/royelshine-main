import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { EventType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, entityId, path, referrer, sessionId } = body;

    if (!eventType || !path) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || undefined;
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    await prisma.analyticsEvent.create({
      data: {
        eventType: eventType as EventType,
        entityId: entityId || null,
        path,
        referrer: referrer || null,
        userAgent,
        ipHash: ip !== "unknown" ? Buffer.from(ip).toString("base64").slice(0, 16) : null,
        sessionId: sessionId || null,
        metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to record analytics event:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
