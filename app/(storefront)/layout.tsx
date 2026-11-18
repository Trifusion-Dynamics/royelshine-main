import { prisma } from "@/lib/db/prisma";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import FloatingWhatsApp from "@/components/storefront/FloatingWhatsApp";



export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await prisma.websiteSettings.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error("Could not fetch website settings:", error);
  }

  const sanitizedSettings = settings
    ? {
        brandName: settings.brandName,
        phone: settings.phone,
        whatsappNumber: settings.whatsappNumber,
        contactEmail: settings.contactEmail,
        showroomAddress: settings.showroomAddress,
        businessHours: settings.businessHours,
        instagramUrl: settings.instagramUrl || undefined,
        facebookUrl: settings.facebookUrl || undefined,
        youtubeUrl: settings.youtubeUrl || undefined,
      }
    : undefined;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Header settings={sanitizedSettings} />
      <main className="flex-1">{children}</main>
      <Footer settings={sanitizedSettings} />
      <FloatingWhatsApp whatsappNumber={sanitizedSettings?.whatsappNumber} />
    </div>
  );
}
