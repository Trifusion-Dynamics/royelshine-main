import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowRight, Phone } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "Enquiry Received | Royal Shine Jewellery",
  description: "Thank you for your enquiry with Royal Shine Jewellery.",
};

export default async function EnquirySuccessPage() {
  const settings = await prisma.websiteSettings.findUnique({ where: { id: "default" } });
  const whatsappNumber = settings?.whatsappNumber || "+919876543210";
  const phone = settings?.phone || "+91 98765 43210";
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 animate-fade-in">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265] block">
        Royal Shine Concierge
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
        Your Enquiry Has Been Received
      </h1>

      <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light max-w-lg mx-auto">
        Thank you for your appreciation of our fine jewellery. A dedicated private concierge will review
        your request and reach out via your preferred communication channel within 2 hours.
      </p>

      <div className="p-6 bg-white border border-[#EAE4D9] rounded-sm text-xs text-zinc-600 space-y-2 max-w-md mx-auto">
        <p className="font-medium text-[#1A1A1A]">Need immediate assistance?</p>
        <p>Our flagship Mumbai boutique concierge desk is open:</p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 text-[#C5A265] font-semibold hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{phone}</span>
          </a>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
            "Hello Royal Shine Jewellery, I recently submitted an enquiry on your website and would like to follow up."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>

        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
