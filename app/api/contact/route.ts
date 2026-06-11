import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email, phone, topic, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }
  await prisma.contactMessage.create({ data: { name, email, phone, topic, message } });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  // Admin only — checked in page server component via requireAdmin
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(messages);
}
