"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Plus, User, Shield } from "lucide-react";

interface AdminTopbarProps {
  user: {
    fullName: string;
    email: string;
    role: string;
  };
}

export default function AdminTopbar({ user }: AdminTopbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="h-16 bg-[#1A1A1A] border-b border-zinc-800 px-6 flex items-center justify-between text-white sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-wider text-zinc-400 hidden sm:inline">
          Catalogue & Concierge Console
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Add Product Button */}
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C5A265] hover:bg-[#AA874C] text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Product</span>
        </Link>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-zinc-700">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-white block">{user.fullName}</span>
            <span className="text-[10px] text-[#C5A265] uppercase tracking-wider font-medium">
              {user.role}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#C5A265]">
            <User className="w-4 h-4" />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
