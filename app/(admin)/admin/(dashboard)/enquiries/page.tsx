import { prisma } from "@/lib/db/prisma";
import EnquiriesCRM from "@/components/admin/EnquiriesCRM";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: { id: true, name: true, sku: true, mainImage: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Client Relationship Management
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Enquiries & Leads CRM
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Track prospect leads, update consultation statuses, record concierge notes, and export to CSV.
        </p>
      </div>

      <EnquiriesCRM initialEnquiries={enquiries} />
    </div>
  );
}
