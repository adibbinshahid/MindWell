import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // The body stream can only be read once, so read it as text and parse it
  // according to the content type rather than calling req.json() as well.
  const body = await req.text();
  const isJson = (req.headers.get("content-type") ?? "").includes("application/json");

  let email: string | undefined;
  if (isJson) {
    try {
      const parsed = JSON.parse(body || "{}");
      if (typeof parsed?.email === "string") email = parsed.email;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
  } else {
    email = new URLSearchParams(body).get("email") ?? undefined;
  }
  email = email?.trim();

  if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  if (isJson) return NextResponse.json({ ok: true });

  // Redirect back for HTML form POST
  return NextResponse.redirect(new URL("/?subscribed=1", req.url), 303);
}
