import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const email = params.get("email") || (await req.json().catch(() => ({}))).email;

  if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  // Redirect back for HTML form POST
  return NextResponse.redirect(new URL("/?subscribed=1", req.url), 303);
}
