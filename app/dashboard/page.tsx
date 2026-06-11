import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CancelBookingBtn from "./CancelBookingBtn";
import CrisisBanner from "@/components/layout/CrisisBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Appointments" };

export default async function DashboardPage() {
  const session = await requireAuth();
  if (!session) redirect("/login?callbackUrl=/dashboard");
  if (session.user.role === "ADMIN") redirect("/admin/dashboard");

  const [user, appointments] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.appointment.findMany({
      where: { userId: session.user.id },
      include: { doctor: { select: { name: true, role: true, initials: true } } },
      orderBy: [{ date: "desc" }, { time: "asc" }],
    }),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = appointments.filter(a => a.date >= today && a.status === "CONFIRMED");
  const past = appointments.filter(a => a.date < today || a.status === "COMPLETED" || a.status === "CANCELLED");

  function fmt(ds: string) {
    return new Date(ds + "T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"});
  }

  return (
    <>
      <CrisisBanner/>
      <Navbar/>
      <main className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
              <p className="text-slate-500 mt-1">Welcome back, {user?.firstName}.</p>
            </div>
            <Link href="/book" className="btn btn-primary">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
              Book New Appointment
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label:"Upcoming", value: upcoming.length, color:"text-blue-600" },
              { label:"Total Booked", value: appointments.filter(a=>a.status==="CONFIRMED"||a.status==="COMPLETED").length, color:"text-green-600" },
              { label:"Completed", value: appointments.filter(a=>a.status==="COMPLETED").length, color:"text-slate-600" },
              { label:"Cancelled", value: appointments.filter(a=>a.status==="CANCELLED").length, color:"text-red-500" },
            ].map(s=>(
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Upcoming */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Upcoming Appointments</h2>
              <span className="badge badge-confirmed">{upcoming.length}</span>
            </div>
            {upcoming.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                </div>
                <p className="font-medium">No upcoming appointments.</p>
                <Link href="/book" className="btn btn-primary btn-sm mt-4">Book an Appointment</Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcoming.map(a=>(
                  <div key={a.id} className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">{a.doctor.initials}</div>
                      <div>
                        <p className="font-semibold text-sm">{a.doctor.name}</p>
                        <p className="text-xs text-blue-600">{a.doctor.role}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{fmt(a.date)} · {a.time} · {a.sessionType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge badge-confirmed">{a.status}</span>
                      <CancelBookingBtn id={a.id}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          {past.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-semibold text-lg">Past Appointments</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {past.map(a=>(
                  <div key={a.id} className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">{a.doctor.initials}</div>
                      <div>
                        <p className="font-semibold text-sm text-slate-700">{a.doctor.name}</p>
                        <p className="text-xs text-slate-500">{fmt(a.date)} · {a.time}</p>
                      </div>
                    </div>
                    <span className={`badge ${a.status==="CANCELLED"?"badge-cancelled":a.status==="COMPLETED"?"badge-completed":"badge-pending"}`}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { iconKey:"file-text", label:"Intake Forms", desc:"Complete before your first visit.", href:"/resources#forms" },
              { iconKey:"help-circle", label:"FAQ", desc:"Answers to common questions.", href:"/resources#faq" },
              { iconKey:"alert-circle", label:"Crisis Resources", desc:"24/7 support lines.", href:"/resources#crisis" },
            ].map(q=>(
              <Link key={q.label} href={q.href} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    {q.iconKey==="file-text" && <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></>}
                    {q.iconKey==="help-circle" && <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
                    {q.iconKey==="alert-circle" && <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}
                  </svg>
                </div>
                <div><p className="font-semibold text-sm">{q.label}</p><p className="text-xs text-slate-500 mt-1">{q.desc}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
