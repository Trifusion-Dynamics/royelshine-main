import { prisma } from "@/lib/db/prisma";
import CMSManager from "@/components/admin/CMSManager";

export const dynamic = "force-dynamic";

export default async function AdminCMSPage() {
  const [banners, testimonials] = await Promise.all([
    prisma.banner.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Content & Storytelling
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          CMS & Media Campaign Manager
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage promotional hero banners, campaign imagery, and client testimonials.
        </p>
      </div>

      <CMSManager initialBanners={banners} initialTestimonials={testimonials} />
    </div>
  );
}
