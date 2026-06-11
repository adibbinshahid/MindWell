import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug, published: true } });
  if (!post) notFound();

  return (
    <>
      <div className="page-hero text-left">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="text-blue-200 text-sm hover:text-white mb-4 inline-flex items-center gap-1">← All Articles</Link>
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">{post.category}</span>
          <h1 className="text-left">{post.title}</h1>
          <div className="flex gap-4 mt-4 text-blue-100 text-sm">
            <span>By {post.author}</span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</span>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-bold text-lg">Ready to take the next step?</h3>
                <p className="text-slate-600 text-sm mt-1">Book an appointment with one of our specialists today.</p>
              </div>
              <Link href="/book" className="btn btn-primary shrink-0">Book Appointment</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
