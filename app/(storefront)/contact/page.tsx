import { prisma } from "@/lib/db/prisma";
import ContactForm from "@/components/storefront/ContactForm";
import { MapPin, Phone, Mail, Clock, MessageCircle, Sparkles } from "lucide-react";

export const metadata = {
  title: "Contact Us & Book Private Viewing | Royal Shine Jewellery",
  description:
    "Visit our flagship Mumbai boutique or schedule a private virtual consultation with our master jewellery concierge.",
};

export default async function ContactPage() {
  const settings = await prisma.websiteSettings.findUnique({
    where: { id: "default" },
  });

  const phone = settings?.phone || "+91 98765 43210";
  const whatsappNumber = settings?.whatsappNumber || "+919876543210";
  const email = settings?.contactEmail || "enquiries@royalshinejewellery.com";
  const address =
    settings?.showroomAddress ||
    "Royal Shine Flagship Boutique, Luxury Diamond Souk, Bandra West, Mumbai 400050, India";
  const hours =
    settings?.businessHours ||
    "Monday – Saturday: 10:30 AM – 8:30 PM | Sunday: By Private Appointment";

  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
          Private Consultations & Showroom
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1A1A] mt-2">
          Connect With Us
        </h1>
        <div className="w-16 h-[1.5px] bg-[#C5A265] mx-auto mt-4" />
        <p className="text-xs sm:text-sm text-zinc-600 mt-4 leading-relaxed font-light">
          Whether you seek a bespoke wedding set, wish to view our certified diamond solitaires, or
          desire to learn more about our 22K gold heirlooms, our private jewellery concierge welcomes you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info & Showroom Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1A1A1A] text-white p-8 sm:p-10 rounded-sm space-y-6 shadow-xl border border-zinc-800">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A265] font-semibold block">
                Flagship Boutique
              </span>
              <h2 className="font-serif text-2xl font-bold text-white mt-1">
                Royal Shine Showroom
              </h2>
            </div>

            <div className="space-y-5 text-xs text-zinc-300">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#C5A265] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Address</span>
                  <span className="leading-relaxed mt-0.5 block">{address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#C5A265] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Direct Concierge</span>
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-[#C5A265]">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#C5A265] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Email Enquiries</span>
                  <a href={`mailto:${email}`} className="hover:text-[#C5A265]">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#C5A265] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Visiting Hours</span>
                  <span className="leading-relaxed mt-0.5 block">{hours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                  "Hello Royal Shine Jewellery, I would like to schedule a private consultation."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Concierge</span>
              </a>
            </div>
          </div>

          {/* Hallmarking note */}
          <div className="p-6 bg-[#F5F2EB] border border-[#EAE4D9] rounded-sm flex items-start gap-3.5">
            <Sparkles className="w-5 h-5 text-[#C5A265] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-600 leading-relaxed">
              <strong className="text-[#1A1A1A] block font-serif text-sm">
                Strict Privacy & Discreet Appointments
              </strong>
              For high-value bridal and diamond suites, we offer dedicated private viewing chambers
              with personal gemological demonstrations.
            </div>
          </div>
        </div>

        {/* Contact Enquiry Form */}
        <div className="lg:col-span-7">
          <ContactForm whatsappNumber={whatsappNumber} />
        </div>
      </div>
    </div>
  );
}
