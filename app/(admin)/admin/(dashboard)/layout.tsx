import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { EnquiryStatus } from "@prisma/client";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Get live pending enquiries count
  let pendingCount = 0;
  try {
    pendingCount = await prisma.enquiry.count({
      where: { status: EnquiryStatus.NEW },
    });
  } catch (error) {
    console.error("Failed to query pending enquiries count:", error);
  }

  return (
    <div className="min-h-screen bg-[#111111] text-zinc-100 flex flex-col md:flex-row">
      <AdminSidebar pendingEnquiriesCount={pendingCount} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar user={session} />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
