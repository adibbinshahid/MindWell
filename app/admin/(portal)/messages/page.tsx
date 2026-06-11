import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages – Admin" };

export default async function MessagesPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin");

  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <header className="bg-white border-b border-slate-200 pl-16 pr-4 lg:px-7 h-16 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-semibold text-lg">Contact Messages</h1>
        <span className="text-sm text-slate-500">{messages.filter(m=>!m.read).length} unread</span>
      </header>
      <div className="p-4 sm:p-7">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">📭</div>
              <p>No messages yet.</p>
            </div>
          )}
          {messages.map(m=>(
            <div key={m.id} className={`bg-white border rounded-2xl p-6 ${m.read ? "border-slate-200" : "border-blue-200 shadow-sm"}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold">{m.name}</span>
                    {!m.read && <span className="badge badge-confirmed text-xs">New</span>}
                    <span className="text-xs text-slate-400">{m.topic}</span>
                  </div>
                  <div className="text-sm text-slate-500 mb-3">
                    <a href={`mailto:${m.email}`} className="text-blue-600 hover:underline">{m.email}</a>
                    {m.phone && <> · {m.phone}</>}
                    <span className="ml-3">{new Date(m.createdAt).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{m.message}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={`mailto:${m.email}?subject=Re: ${m.topic}`} className="btn btn-primary btn-sm">Reply</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
