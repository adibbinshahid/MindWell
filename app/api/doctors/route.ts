import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(doctors);
}
