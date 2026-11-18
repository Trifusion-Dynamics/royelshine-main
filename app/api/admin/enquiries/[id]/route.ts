import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { enquiryUpdateSchema } from "@/lib/validations/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: {
      product: true,
      activities: {
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { fullName: true } } },
      },
    },
  });

  if (!enquiry) return NextResponse.json({ success: false, message: "Enquiry not found." }, { status: 404 });

  return NextResponse.json({ success: true, enquiry });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const result = enquiryUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, internalNotes } = result.data;
    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Enquiry not found." }, { status: 404 });

    const previousStatus = existing.status;
    const updated = await prisma.enquiry.update({
      where: { id },
      data: { status, internalNotes },
    });

    // Create EnquiryActivity log
    if (previousStatus !== status || internalNotes) {
      await prisma.enquiryActivity.create({
        data: {
          enquiryId: id,
          adminId: session.userId,
          action: previousStatus !== status ? `STATUS_CHANGED_TO_${status}` : "NOTE_UPDATED",
          previousStatus,
          newStatus: status,
          notes: internalNotes,
        },
      });
    }

    // Log admin activity
    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "ENQUIRY_UPDATED",
        entityType: "Enquiry",
        entityId: id,
        details: `Updated enquiry for ${existing.customerName} to status ${status}.`,
      },
    });

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    console.error("Failed to update enquiry:", error);
    return NextResponse.json({ success: false, message: "Server error updating enquiry." }, { status: 500 });
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
    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Enquiry not found." }, { status: 404 });

    await prisma.enquiry.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: session.userId,
        action: "ENQUIRY_DELETED",
        entityType: "Enquiry",
        entityId: id,
        details: `Deleted enquiry from ${existing.customerName}.`,
      },
    });

    return NextResponse.json({ success: true, message: "Enquiry deleted successfully." });
  } catch (error) {
    console.error("Failed to delete enquiry:", error);
    return NextResponse.json({ success: false, message: "Failed to delete enquiry." }, { status: 500 });
  }
}
