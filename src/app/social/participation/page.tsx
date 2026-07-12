import { prisma } from "@/lib/db";
import { CheckCircle2, XCircle, Clock, Search, Filter } from "lucide-react";
import { revalidatePath } from "next/cache";

export const revalidate = 0; // Disable caching

async function approveAction(formData: FormData) {
  "use server";
  const id = formData.get("id");
  if (id) {
    const p = await prisma.employeeParticipation.findUnique({
      where: { id: Number(id) },
      include: { activity: true }
    });
    if (p) {
      await prisma.employeeParticipation.update({
        where: { id: p.id },
        data: { 
          approvalStatus: "APPROVED",
          approvalDate: new Date(),
          approvedBy: "Admin",
          pointsEarned: p.activity.xpReward ?? 0
        }
      });
      revalidatePath("/social/participation");
      revalidatePath("/social");
    }
  }
}

async function rejectAction(formData: FormData) {
  "use server";
  const id = formData.get("id");
  if (id) {
    await prisma.employeeParticipation.update({
      where: { id: Number(id) },
      data: { 
        approvalStatus: "REJECTED",
        rejectionReason: "Declined by Admin"
      }
    });
    revalidatePath("/social/participation");
    revalidatePath("/social");
  }
}

export default async function ParticipationPage() {
  const participations = await prisma.employeeParticipation.findMany({
    include: {
      employee: {
        include: {
          department: true,
        },
      },
      activity: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <h3 className="text-xl font-bold text-white">Employee Participation</h3>
        <p className="text-slate-400 text-sm mt-1">Review and manage employee CSR and activity participations.</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-black/20">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg font-medium">Employee Name</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Activity</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">XP Reward</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 rounded-tr-lg text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {participations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                    No participations found.
                  </td>
                </tr>
              ) : participations.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {p.employee?.firstName} {p.employee?.lastName}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {p.employee?.department?.name || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {p.activity?.title}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {new Date(p.registeredAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    +{p.pointsEarned || p.activity?.xpReward} XP
                  </td>
                  <td className="px-6 py-4">
                    {p.approvalStatus === 'PENDING' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                    {p.approvalStatus === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </span>
                    )}
                    {p.approvalStatus === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <XCircle className="h-3 w-3" />
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.approvalStatus === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <form action={approveAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button 
                            type="submit"
                            className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        </form>
                        <form action={rejectAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button 
                            type="submit"
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-xs italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
