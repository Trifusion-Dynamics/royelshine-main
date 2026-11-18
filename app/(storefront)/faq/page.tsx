import Link from "next/link";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions | Royal Shine Jewellery",
  description: "Answers to common questions regarding gold hallmarking, certified diamonds, bespoke orders, and private showroom visits.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What certifications and hallmarking do Royal Shine Jewellery pieces carry?",
      a: "Every single piece of gold jewellery created by Royal Shine carries the mandatory Bureau of Indian Standards (BIS) Hallmark with the 6-digit Hallmark Unique Identification (HUID) laser inscription, guaranteeing exact 22K (916) or 18K (750) purity. All solitaire diamonds above 0.30 carats are independently certified by the Gemological Institute of America (GIA) or International Gemological Institute (IGI).",
    },
    {
      q: "Can I customize a bridal set or solitaire ring according to my budget and preferences?",
      a: "Yes, bespoke haute joaillerie is our hallmark specialty. You can work directly with our design atelier to customize metal purity (22K, 18K Yellow/Rose/White Gold, or Platinum 950), diamond carat weight, cut, and clarity specifications, as well as incorporate family gemstones into new heirloom settings.",
    },
    {
      q: "How does the enquiry and purchasing process work?",
      a: "Royal Shine operates as an exclusive high jewellery catalogue and private concierge service. When you submit an enquiry online or via WhatsApp, a dedicated personal jewellery consultant is assigned to you. We provide high-definition video previews, exact weight and purity breakdowns, customized quotations, and assist you in either scheduling a private showroom viewing or arranging fully insured doorstep transit.",
    },
    {
      q: "Do you offer private viewing consultations?",
      a: "Yes. We host private, discreet appointments at our flagship Mumbai boutique in dedicated VIP viewing salons. We also conduct secure high-definition virtual video appointments for patrons across India and internationally.",
    },
    {
      q: "How should I care for my 22K gold, polki, and diamond jewellery?",
      a: "Fine jewellery should be protected from harsh chemicals, perfumes, and sudden impact. Kundan and Polki jewellery should never be immersed in water as the gold foil backing can be affected; wipe gently with a soft microfibre cloth. Royal Shine provides lifetime complimentary ultrasonic cleaning and inspection for all our creations.",
    },
    {
      q: "Is insured delivery available across India?",
      a: "Yes. All bespoke orders dispatched by Royal Shine are fully transit-insured by armored logistics partners (such as Sequel Logistics and BVC Logistics) and hand-delivered securely with tamper-evident security seals.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A265]">
          Client Guidance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1A1A] mt-2">
          Frequently Asked Questions
        </h1>
        <div className="w-16 h-[1.5px] bg-[#C5A265] mx-auto mt-4" />
        <p className="text-xs sm:text-sm text-zinc-600 mt-4 leading-relaxed font-light">
          Everything you need to know about our certifications, hallmarking, bespoke appointments, and
          haute joaillerie service.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-[#EAE4D9] rounded-sm p-6 space-y-2.5 shadow-2xs"
          >
            <h3 className="font-serif text-base font-bold text-[#1A1A1A] flex items-start gap-3">
              <span className="text-[#C5A265] font-sans text-xs mt-1">0{index + 1}.</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 pl-7 leading-relaxed font-light">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 p-8 bg-[#FAF8F5] border border-[#C5A265]/40 rounded-sm text-center space-y-3">
        <Sparkles className="w-5 h-5 text-[#C5A265] mx-auto" />
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
          Have a specific enquiry or custom request?
        </h3>
        <p className="text-xs text-zinc-600 max-w-md mx-auto">
          Our jewellery concierge is readily available to answer your questions and arrange private viewings.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex px-6 py-2.5 bg-[#C5A265] hover:bg-[#AA874C] text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors"
          >
            Contact Concierge
          </Link>
        </div>
      </div>
    </div>
  );
}
