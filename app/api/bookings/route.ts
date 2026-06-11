import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TIME_SLOTS = [
  "9:00 AM","10:30 AM","12:00 PM","1:30 PM","3:00 PM","4:30 PM"
];

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");

  // Availability check
  if (doctorId && date) {
    const [booked, blocked] = await Promise.all([
      prisma.appointment.findMany({
        where: { doctorId, date, status: { not: "CANCELLED" } },
        select: {
          time: true,
          sessionType: true,
          patientType: true,
          user: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.blockedSlot.findMany({
        where: { doctorId, date },
        select: { time: true },
      }),
    ]);
    const unavailable = [...booked.map(b => b.time), ...blocked.map(b => b.time)];
    const bookingDetails: Record<string, { patientName: string; sessionType: string; patientType: string }> = {};
    booked.forEach(b => {
      bookingDetails[b.time] = {
        patientName: `${b.user.firstName} ${b.user.lastName}`,
        sessionType: b.sessionType,
        patientType: b.patientType,
      };
    });
    return NextResponse.json({
      available: TIME_SLOTS.filter(t => !unavailable.includes(t)),
      booked: booked.map(b => b.time),
      blocked: blocked.map(b => b.time),
      bookingDetails,
    });
  }

  // Admin: all bookings; Patient: own bookings
  if (session.user.role === "ADMIN") {
    const bookings = await prisma.appointment.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        doctor: { select: { name: true, role: true } },
      },
      orderBy: [{ date: "desc" }, { time: "asc" }],
      take: 100,
    });
    return NextResponse.json(bookings);
  }

  const bookings = await prisma.appointment.findMany({
    where: { userId: session.user.id },
    include: { doctor: { select: { name: true, role: true, initials: true } } },
    orderBy: [{ date: "desc" }, { time: "asc" }],
  });
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required to book." }, { status: 401 });

  const { doctorId, date, time, sessionType, patientType, notes, insurance } = await req.json();

  if (!doctorId || !date || !time) {
    return NextResponse.json({ error: "Doctor, date, and time are required." }, { status: 400 });
  }

  // Check slot is available
  const conflict = await prisma.appointment.findFirst({
    where: { doctorId, date, time, status: { not: "CANCELLED" } },
  });
  if (conflict) return NextResponse.json({ error: "Slot no longer available." }, { status: 409 });

  const blocked = await prisma.blockedSlot.findFirst({ where: { doctorId, date, time } });
  if (blocked) return NextResponse.json({ error: "Slot is blocked." }, { status: 409 });

  const appointment = await prisma.appointment.create({
    data: {
      userId: session.user.id,
      doctorId,
      date,
      time,
      sessionType: sessionType ?? "In-Person",
      patientType: patientType ?? "New Patient",
      notes: notes ?? null,
      insurance: insurance ?? null,
      status: "CONFIRMED",
    },
    include: { doctor: { select: { name: true } } },
  });

  return NextResponse.json(appointment, { status: 201 });
}
