import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog & Articles" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category)))];

  return (
    <>
      <div className="page-hero">
        <div className="max-w-6xl mx-auto px-6">
          <h1>Mental Health Articles</h1>
          <p>Evidence-based tips, insights, and guidance from our team of specialists.</p>
        </div>
      </div>
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <div className="text-5xl mb-4">📖</div>
              <p>No articles published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover overflow-hidden">
                  <div className="h-44 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-5xl">📖</div>
                  <div className="p-5">
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100 mb-3">{post.category}</span>
                    <h3 className="font-semibold text-slate-900 leading-snug mb-2">{post.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{post.author}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-xl">Get Articles in Your Inbox</h3>
            <p className="text-slate-500 mt-1">Weekly mental health tips from our specialists.</p>
          </div>
          <form action="/api/newsletter" method="POST" className="flex gap-3 w-full sm:w-auto flex-wrap">
            <input type="email" name="email" placeholder="Your email address" required className="form-control w-full sm:w-64"/>
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
