"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Download,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { EnquiryStatus } from "@prisma/client";

interface EnquiryItem {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  status: EnquiryStatus;
  preferredMethod: string;
  internalNotes?: string | null;
  sourceUrl?: string | null;
  createdAt: string | Date;
  product?: {
    id: string;
    name: string;
    sku: string;
    mainImage: string;
  } | null;
}

interface EnquiriesCRMProps {
  initialEnquiries: EnquiryItem[];
}

export default function EnquiriesCRM({ initialEnquiries }: EnquiriesCRMProps) {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [activeEnquiry, setActiveEnquiry] = useState<EnquiryItem | null>(null);
  const [notes, setNotes] = useState("");
  const [statusVal, setStatusVal] = useState<EnquiryStatus>(EnquiryStatus.NEW);
  const [saving, setSaving] = useState(false);

  const statuses: { label: string; value: string }[] = [
    { label: "All Enquiries", value: "ALL" },
    { label: "New (Action Req.)", value: "NEW" },
    { label: "Contacted", value: "CONTACTED" },
    { label: "Follow Up", value: "FOLLOW_UP" },
    { label: "Resolved", value: "RESOLVED" },
    { label: "Closed", value: "CLOSED" },
    { label: "Spam", value: "SPAM" },
  ];

  const filtered = enquiries.filter((e) => {
    const matchesStatus = selectedStatus === "ALL" || e.status === selectedStatus;
    const query = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      e.customerName.toLowerCase().includes(query) ||
      e.email.toLowerCase().includes(query) ||
      e.phone.toLowerCase().includes(query) ||
      e.message.toLowerCase().includes(query) ||
      (e.product?.name && e.product.name.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const handleOpenDetail = (e: EnquiryItem) => {
    setActiveEnquiry(e);
    setNotes(e.internalNotes || "");
    setStatusVal(e.status);
  };

  const handleUpdate = async () => {
    if (!activeEnquiry) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/enquiries/${activeEnquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusVal, internalNotes: notes }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries((prev) =>
          prev.map((item) =>
            item.id === activeEnquiry.id ? { ...item, status: statusVal, internalNotes: notes } : item
          )
        );
        setActiveEnquiry(null);
        router.refresh();
      }
    } catch {
      alert("Error updating enquiry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry record?")) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
        if (activeEnquiry?.id === id) setActiveEnquiry(null);
        router.refresh();
      }
    } catch {
      alert("Error deleting enquiry.");
    }
  };

  const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, "");

  return (
    <div className="space-y-6">
      {/* Filter Tabs & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {statuses.map((st) => (
            <button
              key={st.value}
              onClick={() => setSelectedStatus(st.value)}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                selectedStatus === st.value
                  ? "bg-[#C5A265] text-white font-semibold"
                  : "bg-[#1A1A1A] border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/enquiries/export"
            download
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-sm border border-zinc-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A265]" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, phone, email, product..."
          className="w-full bg-[#1A1A1A] border border-zinc-700 rounded-sm py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#C5A265]"
        />
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
      </div>

      {/* Enquiries Master Table */}
      <div className="bg-[#1A1A1A] border border-zinc-800 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider bg-zinc-900/60">
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Product Interest</th>
                <th className="py-3 px-4">Message Snippet</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No customer enquiries found matching the filters.
                  </td>
                </tr>
              ) : (
                filtered.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => handleOpenDetail(enq)}
                    className="hover:bg-zinc-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block hover:text-[#C5A265]">
                        {enq.customerName}
                      </span>
                      <span className="text-[11px] text-zinc-400 block">{enq.email}</span>
                      <span className="text-[11px] text-[#C5A265] block">{enq.phone}</span>
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      {enq.product ? (
                        <div className="flex items-center gap-2">
                          {enq.product.mainImage && (
                            <div className="relative w-8 h-8 rounded bg-zinc-900 overflow-hidden flex-shrink-0">
                              <Image
                                src={enq.product.mainImage}
                                alt={enq.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-white font-medium block truncate" title={enq.product.name}>
                              {enq.product.name}
                            </span>
                            <span className="text-[10px] text-zinc-400">{enq.product.sku}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic">General Consultation</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs text-zinc-300">
                      <p className="line-clamp-2 text-[11px] leading-relaxed">{enq.message}</p>
                      {enq.internalNotes && (
                        <span className="text-[10px] text-amber-400/90 block mt-1 truncate">
                          Note: {enq.internalNotes}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 font-medium">
                      {enq.preferredMethod}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs border ${
                          enq.status === "NEW"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : enq.status === "CONTACTED"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : enq.status === "RESOLVED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-zinc-400 whitespace-nowrap">
                      {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={`https://wa.me/${cleanPhone(enq.phone)}?text=${encodeURIComponent(
                            `Hello ${enq.customerName}, this is Royal Shine Jewellery regarding your enquiry.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-400 hover:bg-emerald-950/60 rounded"
                          title="WhatsApp Client"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${cleanPhone(enq.phone)}`}
                          className="p-1.5 text-blue-400 hover:bg-blue-950/60 rounded"
                          title="Call Client"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={`mailto:${enq.email}`}
                          className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded"
                          title="Email Client"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail & Internal Notes Drawer Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#1A1A1A] border border-zinc-800 rounded-sm p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A265] font-semibold">
                  Client Profile
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                  {activeEnquiry.customerName}
                </h3>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 bg-zinc-800 rounded"
              >
                Close
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-900 p-4 rounded-sm border border-zinc-800">
              <div>
                <span className="text-zinc-500 block text-[11px]">Phone / WhatsApp</span>
                <span className="text-white font-medium">{activeEnquiry.phone}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Email</span>
                <span className="text-white font-medium">{activeEnquiry.email}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Preferred Channel</span>
                <span className="text-[#C5A265] font-medium">{activeEnquiry.preferredMethod}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Date Received</span>
                <span className="text-zinc-300">
                  {new Date(activeEnquiry.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Requested Product */}
            {activeEnquiry.product && (
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center gap-3">
                {activeEnquiry.product.mainImage && (
                  <div className="relative w-12 h-12 rounded bg-black overflow-hidden flex-shrink-0">
                    <Image
                      src={activeEnquiry.product.mainImage}
                      alt={activeEnquiry.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {activeEnquiry.product.name}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    SKU: {activeEnquiry.product.sku}
                  </span>
                </div>
              </div>
            )}

            {/* Client Message */}
            <div className="text-xs space-y-1">
              <span className="text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">
                Customer Message
              </span>
              <p className="p-3 bg-[#141414] border border-zinc-800 rounded-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                {activeEnquiry.message}
              </p>
            </div>

            {/* CRM Status & Internal Notes Form */}
            <div className="space-y-3 pt-2 text-xs border-t border-zinc-800">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Update Enquiry Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as EnquiryStatus)}
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2 text-white focus:outline-none focus:border-[#C5A265]"
                >
                  <option value="NEW">NEW (Action Required)</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="FOLLOW_UP">FOLLOW UP</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="SPAM">SPAM</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Internal Concierge Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record customer budget, wedding date, custom modifications discussed..."
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm p-2 text-white focus:outline-none focus:border-[#C5A265]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => handleDelete(activeEnquiry.id)}
                className="px-3 py-1.5 text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Enquiry</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveEnquiry(null)}
                  className="px-4 py-2 border border-zinc-700 text-zinc-300 text-xs rounded-sm hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-[#C5A265] hover:bg-[#AA874C] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save CRM Status"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
