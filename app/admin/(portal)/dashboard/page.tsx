import React from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const session = await requireAdmin();
  if (!session) redirect("/admin");

  const today = new Date().toISOString().split("T")[0];

  const [total, todayCount, cancelled, messages, posts, unread] = await Promise.all([
    prisma.appointment.count({ where: { status: { in: ["CONFIRMED","COMPLETED"] } } }),
    prisma.appointment.count({ where: { date: today, status: "CONFIRMED" } }),
    prisma.appointment.count({ where: { status: "CANCELLED" } }),
    prisma.contactMessage.count(),
    prisma.blogPost.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const thisMonthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];

  const [thisMonthCount, lastMonthCount, completedAllTime, doctorStats] = await Promise.all([
    prisma.appointment.count({
      where: { status: { in: ["CONFIRMED", "COMPLETED"] }, date: { gte: thisMonthStart, lte: thisMonthEnd } },
    }),
    prisma.appointment.count({
      where: { status: { in: ["CONFIRMED", "COMPLETED"] }, date: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.appointment.groupBy({
      by: ["doctorId"],
      where: { status: { in: ["CONFIRMED", "COMPLETED"] }, date: { gte: thisMonthStart, lte: thisMonthEnd } },
      _count: { id: true },
    }),
  ]);

  const doctors = await prisma.doctor.findMany({ select: { id: true, name: true, initials: true } });
  const doctorMap = Object.fromEntries(doctors.map(d => [d.id, d]));

  const RATE = 200;
  const thisMonthRevenue = thisMonthCount * RATE;
  const lastMonthRevenue = lastMonthCount * RATE;
  const revenueChange    = lastMonthRevenue > 0
    ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : 0;
  const maxDoctorCount   = Math.max(...doctorStats.map(d => d._count.id), 1);
  const monthName        = now.toLocaleDateString("en-US", { month: "long" });

  const recentBookings = await prisma.appointment.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      doctor: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
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
        <h1 className="font-semibold text-lg">Dashboard</h1>
        <div className="text-sm text-slate-500">{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
      </header>

      <div className="p-4 sm:p-7">
        {/* Stats */}
        {(()=>{
          const STAT_ICONS: Record<string, React.ReactNode> = {
            "calendar": <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
            "check": <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>,
            "x": <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
            "mail": <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
            "dollar": <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
          };
          return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-7">
              {[
                { label:"Today's Appointments", value: todayCount, icon:"calendar", color:"bg-blue-50 text-blue-600", change:"+2 from yesterday" },
                { label:"This Month Confirmed",  value: thisMonthCount, icon:"check", color:"bg-green-50 text-green-600", change: monthName },
                { label:"Cancellations",         value: cancelled, icon:"x", color:"bg-red-50 text-red-500", change:"all time" },
                { label:"Unread Messages",       value: unread, icon:"mail", color:"bg-amber-50 text-amber-600", change:`${messages} total` },
                { label:"Monthly Revenue",       value:`$${thisMonthRevenue.toLocaleString()}`, icon:"dollar", color:"bg-emerald-50 text-emerald-600", change: revenueChange >= 0 ? `+${revenueChange}% vs last month` : `${revenueChange}% vs last month` },
              ].map(s=>(
                <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>{STAT_ICONS[s.icon]}</div>
                    <span className="text-xs text-slate-400">{s.change}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Quick actions */}
        {(()=>{
          const ACTION_ICONS: Record<string, React.ReactNode> = {
            "list": <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
            "clock": <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
            "edit": <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
            "inbox": <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22,12 16,12 14,15 10,15 8,12 2,12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
            "image": <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>,
          };
          return (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-7">
              {[
                { href:"/admin/bookings", label:"All Bookings", icon:"list" },
                { href:"/admin/slots", label:"Manage Slots", icon:"clock" },
                { href:"/admin/blog", label:"New Article", icon:"edit" },
                { href:"/admin/messages", label:"Messages" + (unread>0?` (${unread})`:""), icon:"inbox" },
                { href:"/admin/content", label:"Content / Images", icon:"image" },
              ].map(q=>(
                <a key={q.href} href={q.href} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 hover:border-blue-300 hover:shadow-md transition-all text-sm font-medium">
                  {ACTION_ICONS[q.icon]}
                  {q.label}
                </a>
              ))}
            </div>
          );
        })()}

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-7">
          {/* Monthly Revenue Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Revenue — {monthName}</h2>
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">
                ${RATE}/session
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              ${thisMonthRevenue.toLocaleString()}
            </div>
            <div className={`text-sm font-medium mb-4 ${revenueChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {revenueChange >= 0 ? "↑" : "↓"} {Math.abs(revenueChange)}% vs last month (${lastMonthRevenue.toLocaleString()})
            </div>
            <div className="space-y-1 text-sm text-slate-500">
              <div className="flex justify-between">
                <span>Confirmed this month</span>
                <span className="font-semibold text-slate-700">{thisMonthCount} sessions</span>
              </div>
              <div className="flex justify-between">
                <span>Completed all time</span>
                <span className="font-semibold text-slate-700">{completedAllTime} sessions</span>
              </div>
              <div className="flex justify-between">
                <span>Total earned (completed)</span>
                <span className="font-semibold text-slate-700">${(completedAllTime * RATE).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Revenue by Doctor */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Revenue by Doctor — {monthName}</h2>
            {doctorStats.length === 0 ? (
              <p className="text-sm text-slate-400">No confirmed sessions this month.</p>
            ) : (
              <div className="space-y-3">
                {doctorStats
                  .sort((a, b) => b._count.id - a._count.id)
                  .map(ds => {
                    const doc     = doctorMap[ds.doctorId];
                    const count   = ds._count.id;
                    const revenue = count * RATE;
                    const pct     = Math.round((count / maxDoctorCount) * 100);
                    return (
                      <div key={ds.doctorId}>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                              {doc?.initials ?? "??"}
                            </div>
                            <span className="font-medium text-slate-700">{doc?.name ?? ds.doctorId}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-slate-800">${revenue.toLocaleString()}</span>
                            <span className="text-slate-400 ml-1.5 text-xs">({count} sessions)</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold">Recent Bookings</h2>
            <a href="/admin/bookings" className="text-blue-600 text-sm font-medium hover:underline">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 font-semibold">
                <tr>
                  <th className="text-left px-5 py-3">Patient</th>
                  <th className="text-left px-5 py-3">Doctor</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Time</th>
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map(b=>(
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium">{b.user.firstName} {b.user.lastName}</td>
                    <td className="px-5 py-3.5 text-slate-600">{b.doctor.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{fmt(b.date)}</td>
                    <td className="px-5 py-3.5 text-slate-600">{b.time}</td>
                    <td className="px-5 py-3.5 text-slate-600">{b.sessionType}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${statusBadge[b.status] ?? "badge-pending"}`}>{b.status}</span>
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
