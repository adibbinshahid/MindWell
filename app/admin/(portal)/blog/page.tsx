import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BlogAdminClient from "./BlogAdminClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog Editor" };

export default async function AdminBlogPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin");

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <header className="bg-white border-b border-slate-200 pl-16 pr-4 lg:px-7 h-16 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-semibold text-lg">Blog Editor</h1>
      </header>
      <div className="p-4 sm:p-7">
        <BlogAdminClient initialPosts={JSON.parse(JSON.stringify(posts))} />
      </div>
    </>
  );
}
