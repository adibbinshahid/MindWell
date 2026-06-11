import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");

  const where: { doctorId?: string; date?: string } = {};
  if (doctorId) where.doctorId = doctorId;
  if (date) where.date = date;

  const blocked = await prisma.blockedSlot.findMany({ where });
  return NextResponse.json(blocked);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { doctorId, date, time, reason } = await req.json();
  const slot = await prisma.blockedSlot.upsert({
    where: { doctorId_date_time: { doctorId, date, time } },
    create: { doctorId, date, time, reason: reason ?? "blocked" },
    update: { reason: reason ?? "blocked" },
  });
  return NextResponse.json(slot, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { doctorId, date, time } = await req.json();
  await prisma.blockedSlot.deleteMany({ where: { doctorId, date, time } });
  return NextResponse.json({ ok: true });
}
