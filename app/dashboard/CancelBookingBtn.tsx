"use client";
import { useRouter } from "next/navigation";

export default function CancelBookingBtn({ id }: { id: string }) {
  const router = useRouter();

  async function cancel() {
    if (!confirm("Cancel this appointment? This cannot be undone.")) return;
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    router.refresh();
  }

  return (
    <button onClick={cancel} className="text-red-500 hover:text-red-700 text-xs font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
      Cancel
    </button>
  );
}
