"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gem,
  Layers,
  Sparkles,
  Inbox,
  Image as ImageIcon,
  Sliders,
  FileText,
  Activity,
  Users,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface AdminSidebarProps {
  pendingEnquiriesCount?: number;
}

export default function AdminSidebar({ pendingEnquiriesCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Gem },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Collections", href: "/admin/collections", icon: Sparkles },
    {
      label: "Enquiries",
      href: "/admin/enquiries",
      icon: Inbox,
      badge: pendingEnquiriesCount > 0 ? pendingEnquiriesCount : undefined,
    },
    { label: "CMS & Banners", href: "/admin/cms", icon: FileText },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Website Settings", href: "/admin/settings", icon: Sliders },
    { label: "Activity Logs", href: "/admin/activity", icon: Activity },
    { label: "Admin Users", href: "/admin/users", icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#141414] border-r border-zinc-800 flex flex-col justify-between flex-shrink-0 min-h-screen text-zinc-300">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center gap-3">
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image
              src="/images/Royal-Shine-Logo.png"
              alt="Royal Shine"
              fill
              sizes="36px"
              className="object-contain invert brightness-200"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-sm font-bold tracking-tight text-[#FAF8F5]">
              ROYAL SHINE
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#C5A265] font-semibold">
              Admin Suite
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm transition-all duration-200 ${
                  isActive
                    ? "bg-[#C5A265] text-white font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? "bg-white text-[#9A7737]" : "bg-[#C5A265] text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Live Site Link */}
      <div className="p-4 border-t border-zinc-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 rounded-sm border border-zinc-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A265]" />
            <span>Public Storefront</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        </Link>
      </div>
    </aside>
  );
}
