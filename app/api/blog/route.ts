import { NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminMode = searchParams.get("admin") === "1";
  const session = await getSession();

  if (adminMode) {
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(posts);
  }

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, category: true, excerpt: true, author: true, createdAt: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, category, excerpt, body, published } = await req.json();
  const slug = slugify(title);

  const post = await prisma.blogPost.create({
    data: { title, slug, category, excerpt, body, published: published ?? false, author: session.user.name },
  });
  return NextResponse.json(post, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, title, category, excerpt, body, published } = await req.json();
  const post = await prisma.blogPost.update({
    where: { id },
    data: { title, category, excerpt, body, published },
  });
  return NextResponse.json(post);
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
