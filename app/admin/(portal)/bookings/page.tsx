import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BookingActions from "./BookingActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "All Bookings" };

export default async function AdminBookingsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin");

  const bookings = await prisma.appointment.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true, phone: true } },
      doctor: { select: { name: true, role: true } },
    },
    orderBy: [{ date: "desc" }, { time: "asc" }],
  });

  function fmt(ds: string) {
    return new Date(ds + "T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
  }

  const statusBadge: Record<string,string> = {
    CONFIRMED:"badge-confirmed", CANCELLED:"badge-cancelled", COMPLETED:"badge-completed", PENDING:"badge-pending"
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 pl-16 pr-4 lg:px-7 h-16 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-semibold text-lg">All Bookings</h1>
        <span className="text-sm text-slate-500">{bookings.length} total</span>
      </header>
      <div className="p-4 sm:p-7">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 font-semibold">
                <tr>
                  <th className="text-left px-5 py-3">Patient</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Doctor</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Time</th>
                  <th className="text-left px-5 py-3">Session</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(b=>(
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium">{b.user.firstName} {b.user.lastName}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{b.user.email}</td>
                    <td className="px-5 py-3.5">{b.doctor.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{fmt(b.date)}</td>
                    <td className="px-5 py-3.5 text-slate-600">{b.time}</td>
                    <td className="px-5 py-3.5 text-slate-600">{b.sessionType}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${statusBadge[b.status] ?? "badge-pending"}`}>{b.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <BookingActions id={b.id} status={b.status}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
