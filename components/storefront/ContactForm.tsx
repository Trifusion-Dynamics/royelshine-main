"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";

interface ContactFormProps {
  whatsappNumber?: string;
}

export default function ContactForm({ whatsappNumber = "+919876543210" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    preferredMethod: "WHATSAPP",
    message: "",
    honeypot: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sourceUrl: typeof window !== "undefined" ? window.location.href : "/contact",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.errors) {
          setFieldErrors(data.errors);
        } else {
          setErrorMsg(data.message || "Failed to submit enquiry. Please try again.");
        }
      } else {
        setSuccess(true);
      }
    } catch {
      setErrorMsg("Network error. Please try again or reach us directly on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");

  if (success) {
    return (
      <div className="bg-white border border-[#EAE4D9] p-8 sm:p-10 rounded-sm text-center space-y-4 shadow-sm animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
          Consultation Request Received
        </h3>
        <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to Royal Shine Jewellery. Our private jewellery concierge has
          received your details and will get in touch with you shortly.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
              "Hello Royal Shine Jewellery, I recently submitted a consultation request on your website."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-emerald-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Connect on WhatsApp
          </a>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                customerName: "",
                email: "",
                phone: "",
                preferredMethod: "WHATSAPP",
                message: "",
                honeypot: "",
              });
            }}
            className="w-full sm:w-auto px-6 py-2.5 border border-zinc-300 text-zinc-700 text-xs uppercase tracking-wider rounded-sm hover:bg-zinc-100"
          >
            Send Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#EAE4D9] p-6 sm:p-10 rounded-sm shadow-sm">
      <div className="mb-6">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Private Appointments & Enquiries
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-1">
          Send Us an Enquiry
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Whether you seek a bespoke wedding set or a private viewing, our concierge is at your service.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Anti-spam honeypot */}
        <input
          type="text"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
        />

        <div>
          <label className="block font-medium text-[#1A1A1A] mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            placeholder="e.g. Radhika Mittal"
            className="w-full bg-[#FAF8F5] border border-[#EAE4D9] rounded-sm p-3 text-[#1A1A1A] focus:outline-none focus:border-[#C5A265] focus:bg-white"
          />
          {fieldErrors.customerName && (
            <p className="text-red-500 text-[11px] mt-1">{fieldErrors.customerName[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-[#1A1A1A] mb-1">
              Contact Phone / WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full bg-[#FAF8F5] border border-[#EAE4D9] rounded-sm p-3 text-[#1A1A1A] focus:outline-none focus:border-[#C5A265] focus:bg-white"
            />
            {fieldErrors.phone && (
              <p className="text-red-500 text-[11px] mt-1">{fieldErrors.phone[0]}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-[#1A1A1A] mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="radhika@example.com"
              className="w-full bg-[#FAF8F5] border border-[#EAE4D9] rounded-sm p-3 text-[#1A1A1A] focus:outline-none focus:border-[#C5A265] focus:bg-white"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-[11px] mt-1">{fieldErrors.email[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium text-[#1A1A1A] mb-1">
            Preferred Communication Channel
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "WHATSAPP", label: "WhatsApp" },
              { id: "PHONE", label: "Phone Call" },
              { id: "EMAIL", label: "Email" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setFormData({ ...formData, preferredMethod: m.id })}
                className={`py-2.5 px-3 border text-center text-xs rounded-sm transition-all ${
                  formData.preferredMethod === m.id
                    ? "border-[#C5A265] bg-[#C5A265]/10 text-[#9A7737] font-semibold"
                    : "border-[#EAE4D9] bg-[#FAF8F5] text-zinc-600 hover:border-zinc-400"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium text-[#1A1A1A] mb-1">
            Message / Jewellery Interest <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us about the piece you are looking for (e.g., bridal choker, solitaire diamond ring, preferred gold purity, wedding timeline)..."
            className="w-full bg-[#FAF8F5] border border-[#EAE4D9] rounded-sm p-3 text-[#1A1A1A] focus:outline-none focus:border-[#C5A265] focus:bg-white"
          />
          {fieldErrors.message && (
            <p className="text-red-500 text-[11px] mt-1">{fieldErrors.message[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#C5A265] hover:bg-[#AA874C] disabled:opacity-50 text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? "Submitting..." : "Submit Enquiry"}</span>
        </button>
      </form>
    </div>
  );
}
