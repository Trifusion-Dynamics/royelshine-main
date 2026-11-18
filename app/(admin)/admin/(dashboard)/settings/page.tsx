import { prisma } from "@/lib/db/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.websiteSettings.findUnique({
    where: { id: "default" },
  });

  const initialSettings = settings || {
    brandName: "Royal Shine Jewellery",
    tagLine: "Timeless Elegance & Exquisite Craftsmanship",
    logoUrl: "/images/Royal-Shine-Logo.png",
    contactEmail: "enquiries@royalshinejewellery.com",
    phone: "+91 98765 43210",
    whatsappNumber: "+919876543210",
    showroomAddress: "Royal Shine Flagship Boutique, Luxury Diamond Souk, Bandra West, Mumbai 400050, India",
    businessHours: "Monday – Saturday: 10:30 AM – 8:30 PM | Sunday: By Private Appointment",
    instagramUrl: "https://instagram.com/royalshinejewellery",
    facebookUrl: "https://facebook.com/royalshinejewellery",
    youtubeUrl: "https://youtube.com/@royalshinejewellery",
    defaultCurrency: "INR",
    defaultSeoTitle: "Royal Shine Jewellery — Premium Diamond & Gold Jewellery",
    defaultSeoDescription: "Discover the timeless elegance of Royal Shine Jewellery. Handcrafted 22K gold, diamond, polki and silver masterpieces.",
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Global Configuration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Website Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure showroom contact details, WhatsApp concierge lines, address, and global SEO metadata.
        </p>
      </div>

      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}
