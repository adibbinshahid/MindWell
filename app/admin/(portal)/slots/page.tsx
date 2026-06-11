import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SlotsClient from "./SlotsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage Slots – Admin" };

export default async function SlotsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin");

  const doctors = await prisma.doctor.findMany({ where: { active: true } });

  return (
    <>
      <header className="bg-white border-b border-slate-200 pl-16 pr-4 lg:px-7 h-16 flex items-center sticky top-0 z-10">
        <h1 className="font-semibold text-lg">Manage Availability Slots</h1>
      </header>
      <div className="p-4 sm:p-7">
        <SlotsClient doctors={JSON.parse(JSON.stringify(doctors))} />
      </div>
    </>
  );
}
