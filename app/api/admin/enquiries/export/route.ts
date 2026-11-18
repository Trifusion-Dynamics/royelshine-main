import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true, sku: true } },
    },
  });

  // Build CSV
  const headers = [
    "ID",
    "Customer Name",
    "Email",
    "Phone",
    "Preferred Method",
    "Status",
    "Requested Product",
    "Product SKU",
    "Message",
    "Internal Notes",
    "Date Created",
  ];

  const escapeCsv = (str: string | null | undefined) => {
    if (!str) return '""';
    const clean = str.replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = enquiries.map((e) => [
    e.id,
    escapeCsv(e.customerName),
    escapeCsv(e.email),
    escapeCsv(e.phone),
    e.preferredMethod,
    e.status,
    escapeCsv(e.product?.name || "General"),
    escapeCsv(e.product?.sku || ""),
    escapeCsv(e.message),
    escapeCsv(e.internalNotes || ""),
    new Date(e.createdAt).toISOString(),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="royal_shine_enquiries_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
