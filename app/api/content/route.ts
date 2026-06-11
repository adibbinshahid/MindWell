import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [siteContent, doctors] = await Promise.all([
    prisma.siteContent.findMany({ orderBy: { section: "asc" } }),
    prisma.doctor.findMany({
      where: { active: true },
      select: { id: true, name: true, title: true, credentials: true, bio: true, initials: true, photoUrl: true, availableDays: true, rating: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return NextResponse.json({ siteContent, doctors });
}

export async function PUT(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Doctor update (photo + optional detail fields)
  if (body.doctorId !== undefined) {
    const data: Record<string, unknown> = {};
    if ("photoUrl"     in body) data.photoUrl     = body.photoUrl || null;
    if ("name"         in body) data.name         = body.name;
    if ("title"        in body) data.title        = body.title;
    if ("credentials"  in body) data.credentials  = body.credentials;
    if ("bio"          in body) data.bio          = body.bio;
    if ("availableDays" in body) data.availableDays = body.availableDays;
    const updated = await prisma.doctor.update({
      where: { id: body.doctorId },
      data,
    });
    return NextResponse.json(updated);
  }

  // Site content update (upsert by key)
  if (body.key !== undefined) {
    const updated = await prisma.siteContent.upsert({
      where: { key: body.key },
      update: { value: body.value ?? "" },
      create: {
        key: body.key,
        value: body.value ?? "",
        label: body.label ?? body.key,
        section: body.section ?? "general",
      },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
}
