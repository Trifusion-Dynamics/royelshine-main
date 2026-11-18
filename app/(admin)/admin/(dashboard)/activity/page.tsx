import { prisma } from "@/lib/db/prisma";
import { Activity, Clock, ShieldCheck, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const activities = await prisma.activityLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      admin: { select: { fullName: true, email: true, role: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A265]">
          Compliance & Security
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
          Activity & Audit Logs
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Tamper-evident record of administrator actions, inventory updates, and login sessions.
        </p>
      </div>

      <div className="bg-[#1A1A1A] border border-zinc-800 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider bg-zinc-900/60">
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] font-semibold text-[#C5A265]">
                        {act.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-200 max-w-sm truncate" title={act.details || ""}>
                      {act.details || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{act.entityType}</td>
                    <td className="py-3.5 px-4">
                      {act.admin ? (
                        <div>
                          <span className="text-white font-medium block">{act.admin.fullName}</span>
                          <span className="text-[10px] text-zinc-500">{act.admin.email}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic">System Event</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                      {act.ipAddress || "local"}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[11px] text-zinc-400 whitespace-nowrap">
                      {new Date(act.createdAt).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
