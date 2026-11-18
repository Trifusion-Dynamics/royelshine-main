"use client";

import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
}

export default function FloatingWhatsApp({
  whatsappNumber = "+919876543210",
}: FloatingWhatsAppProps) {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const defaultMessage = encodeURIComponent(
    "Hello Royal Shine Jewellery, I would like to enquire about your fine jewellery collections."
  );

  const handleClick = () => {
    // Optionally fire an analytics event
    try {
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "WHATSAPP_CLICK",
          path: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });
    } catch {
      // non-blocking
    }
  };

  return (
    <aside aria-label="Customer Support">
      <a
        href={`https://wa.me/${cleanNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group border border-white/20"
        aria-label="Direct WhatsApp Concierge"
      >
        <MessageCircle className="w-5 h-5 text-white animate-pulse" />
        <span className="text-xs uppercase tracking-wider font-semibold hidden md:inline">
          Jewellery Concierge
        </span>
      </a>
    </aside>
  );
}
