import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const token = process.env.KEEP_ALIVE_TOKEN;

  if (!token || auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await prisma.doctor.count();

  return NextResponse.json({ ok: true, doctors: count, ts: new Date().toISOString() });
}
