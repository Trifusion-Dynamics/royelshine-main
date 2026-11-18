import { prisma } from "@/lib/db/prisma";
import { Users, Shield, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Access Control
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Administrator Profiles
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Authorized personnel with access to product management, CRM client data, and catalogue operations.
        </p>
      </div>

      <div className="bg-[#1A1A1A] border border-zinc-800 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider bg-zinc-900/60">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Login</th>
              <th className="py-3 px-4 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#C5A265] font-semibold">
                      {u.fullName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-white block">{u.fullName}</span>
                      <span className="text-[11px] text-zinc-400">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-[#C5A265]/10 text-[#DFCA9B] border border-[#C5A265]/30 text-[10px] font-semibold rounded-xs">
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  {u.isActive ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-xs">Inactive</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-zinc-400">
                  {u.lastLoginAt
                    ? new Date(u.lastLoginAt).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Never"}
                </td>
                <td className="py-3.5 px-4 text-right text-zinc-500">
                  {new Date(u.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
