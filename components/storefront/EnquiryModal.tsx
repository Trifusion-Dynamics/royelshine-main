"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Send, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";

interface ProductEnquiryData {
  id?: string;
  name?: string;
  sku?: string;
  mainImage?: string;
  purity?: string | null;
  material?: string | null;
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductEnquiryData | null;
  whatsappNumber?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  product,
  whatsappNumber = "+919876543210",
}: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    preferredMethod: "WHATSAPP",
    message: product
      ? `Hello, I would like to enquire about ${product.name} (SKU: ${product.sku}). Please share availability and customization options.`
      : "Hello, I would like to schedule a private viewing consultation.",
    honeypot: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  if (!isOpen) return null;

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
          productId: product?.id || null,
          sourceUrl: typeof window !== "undefined" ? window.location.href : null,
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
      setErrorMsg("Network error. Please try again or message us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappPreFilled = encodeURIComponent(
    product
      ? `Hello Royal Shine, I am interested in ${product.name} (SKU: ${product.sku}). Can you share more details?`
      : "Hello Royal Shine, I would like to enquire about your jewellery collections."
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#EAE4D9] shadow-2xl rounded-sm p-6 sm:p-8 z-10 animate-fade-in my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Enquiry Received
            </h3>
            <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
              Thank you for choosing Royal Shine Jewellery. Our private jewellery concierge has
              received your request and will contact you via your preferred channel within 2 hours.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${whatsappPreFilled}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp Now
              </a>
              <button
                onClick={() => {
                  setSuccess(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 border border-zinc-300 text-zinc-800 text-xs uppercase tracking-wider rounded-sm hover:bg-zinc-100"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="border-b border-[#EAE4D9] pb-4 mb-5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
                Private Concierge Enquiry
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-1">
                {product ? "Request Product Details" : "Book a Private Consultation"}
              </h3>

              {/* Product preview banner if opened for a specific product */}
              {product && (
                <div className="mt-3 flex items-center gap-3 p-2.5 bg-white border border-[#EAE4D9] rounded-sm">
                  {product.mainImage && (
                    <div className="relative w-12 h-12 flex-shrink-0 bg-[#FAF8F5] rounded overflow-hidden">
                      <Image
                        src={product.mainImage}
                        alt={product.name || "Jewellery"}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#1A1A1A] truncate">{product.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                      <span>SKU: {product.sku}</span>
                      {product.purity && <span>• {product.purity}</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Honeypot field for bot defense */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
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
                  placeholder="e.g. Maharani Radhika Singh"
                  className="w-full bg-white border border-[#EAE4D9] rounded-sm p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C5A265]"
                />
                {fieldErrors.customerName && (
                  <p className="text-red-500 text-[11px] mt-1">{fieldErrors.customerName[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1A1A1A] mb-1">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-[#EAE4D9] rounded-sm p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C5A265]"
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
                    placeholder="name@domain.com"
                    className="w-full bg-white border border-[#EAE4D9] rounded-sm p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C5A265]"
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-[11px] mt-1">{fieldErrors.email[0]}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">
                  Preferred Contact Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "WHATSAPP", label: "WhatsApp" },
                    { id: "PHONE", label: "Phone Call" },
                    { id: "EMAIL", label: "Email" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredMethod: method.id })}
                      className={`py-2 px-3 border text-center text-xs rounded-sm transition-all ${
                        formData.preferredMethod === method.id
                          ? "border-[#C5A265] bg-[#C5A265]/10 text-[#9A7737] font-semibold"
                          : "border-[#EAE4D9] bg-white text-zinc-600 hover:border-zinc-400"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">
                  Message / Special Request
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border border-[#EAE4D9] rounded-sm p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C5A265]"
                />
                {fieldErrors.message && (
                  <p className="text-red-500 text-[11px] mt-1">{fieldErrors.message[0]}</p>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#C5A265] text-white text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#AA874C] disabled:opacity-50 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  {loading ? "Submitting..." : "Submit Enquiry"}
                </button>

                <div className="relative flex items-center justify-center my-1">
                  <div className="border-t border-[#EAE4D9] w-full" />
                  <span className="bg-[#FAF8F5] px-3 text-[11px] text-zinc-400 uppercase tracking-wider">
                    Or
                  </span>
                </div>

                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${whatsappPreFilled}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 border border-emerald-600 text-emerald-700 bg-emerald-50/50 text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-emerald-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  Instant WhatsApp Enquiry
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
