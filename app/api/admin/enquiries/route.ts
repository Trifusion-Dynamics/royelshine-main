import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { EnquiryStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const where: Prisma.EnquiryWhereInput = {};
  if (status && Object.values(EnquiryStatus).includes(status as EnquiryStatus)) {
    where.status = status as EnquiryStatus;
  }
  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ];
  }

  const enquiries = await prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: { id: true, name: true, sku: true, mainImage: true },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { fullName: true } } },
      },
    },
  });

  return NextResponse.json({ success: true, enquiries });
}
