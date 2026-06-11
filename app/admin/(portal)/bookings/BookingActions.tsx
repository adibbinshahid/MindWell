"use client";
import { useRouter } from "next/navigation";

export default function BookingActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();

  async function update(newStatus: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  async function del() {
    if (!confirm("Permanently delete this booking record?")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex gap-2 items-center">
      {status === "CONFIRMED" && (
        <>
          <button onClick={() => update("COMPLETED")} className="text-xs text-green-600 border border-green-200 px-2.5 py-1.5 rounded-lg hover:bg-green-50 font-medium transition-colors">Complete</button>
          <button onClick={() => update("CANCELLED")} className="text-xs text-red-500 border border-red-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50 font-medium transition-colors">Cancel</button>
        </>
      )}
      {status === "CANCELLED" && (
        <button onClick={() => update("CONFIRMED")} className="text-xs text-blue-600 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 font-medium transition-colors">Restore</button>
      )}
      <button onClick={del} className="text-xs text-slate-400 hover:text-red-500 px-2 py-1 transition-colors">🗑</button>
    </div>
  );
}
