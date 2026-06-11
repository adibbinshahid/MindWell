"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Post = { id: string; title: string; slug: string; category: string; excerpt: string; body: string; author: string; published: boolean; createdAt: string };
type View = "list" | "editor";

const CATEGORIES = ["Anxiety","Depression","General","Therapy","Relationships","ADHD","Trauma"];

export default function BlogAdminClient({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const [view, setView] = useState<View>("list");
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [saving, setSaving] = useState(false);

  function newPost() {
    setEditing({ title:"", category:"General", excerpt:"", body:"", published:false });
    setView("editor");
  }
  function editPost(p: Post) {
    setEditing({ ...p });
    setView("editor");
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const method = editing.id ? "PATCH" : "POST";
    await fetch("/api/blog", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setView("list");
    router.refresh();
  }

  async function del(id: string) {
    if (!confirm("Delete this article?")) return;
    await fetch("/api/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  async function toggle(p: Post) {
    await fetch("/api/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, title: p.title, category: p.category, excerpt: p.excerpt, body: p.body, published: !p.published }),
    });
    router.refresh();
  }

  const up = (k: keyof Post) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setEditing(prev => prev ? { ...prev, [k]: e.target.value } : prev);

  if (view === "editor" && editing !== null) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView("list")} className="btn btn-outline btn-sm">← Back</button>
          <h2 className="font-semibold text-lg">{editing.id ? "Edit Article" : "New Article"}</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div>
              <label className="form-label">Title *</label>
              <input className="form-control text-lg font-semibold" value={editing.title ?? ""} onChange={up("title")} placeholder="Article title"/>
            </div>
            <div>
              <label className="form-label">Excerpt *</label>
              <textarea className="form-control" rows={2} value={editing.excerpt ?? ""} onChange={up("excerpt")} placeholder="Short summary shown on the blog index"/>
            </div>
            <div>
              <label className="form-label">Body *</label>
              <p className="text-xs text-slate-400 mb-2">HTML is supported (h2, h3, p, strong, em, ul, li)</p>
              <textarea className="form-control font-mono text-sm" rows={16} value={editing.body ?? ""} onChange={up("body")} placeholder="<p>Article content…</p>"/>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold mb-4 text-sm">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-control" value={editing.category ?? "General"} onChange={up("category")}>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!editing.published}
                    onChange={e => setEditing(p => p ? { ...p, published: e.target.checked } : p)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm font-medium">Published (visible on site)</span>
                </label>
              </div>
            </div>
            <button onClick={save} disabled={saving || !editing.title || !editing.body} className="btn btn-primary w-full justify-center">
              {saving ? "Saving…" : editing.id ? "Save Changes" : "Publish Article"}
            </button>
            <button onClick={() => setView("list")} className="btn btn-outline w-full justify-center">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-500 text-sm">{initialPosts.length} articles</p>
        <button onClick={newPost} className="btn btn-primary btn-sm">+ New Article</button>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 font-semibold">
            <tr>
              <th className="text-left px-5 py-3">Title</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Author</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialPosts.map(p=>(
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 font-medium max-w-xs"><span className="truncate block">{p.title}</span></td>
                <td className="px-5 py-3.5"><span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">{p.category}</span></td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">{p.author}</td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggle(p)} className={`badge cursor-pointer transition-colors ${p.published ? "badge-confirmed hover:bg-red-50 hover:text-red-600" : "badge-pending hover:bg-green-50 hover:text-green-600"}`}>
                    {p.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-5 py-3.5 flex gap-2">
                  <button onClick={() => editPost(p)} className="text-xs text-blue-600 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 font-medium transition-colors">Edit</button>
                  <button onClick={() => del(p.id)} className="text-xs text-red-500 border border-red-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50 font-medium transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {initialPosts.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <div className="text-4xl mb-3">✍️</div>
            <p>No articles yet. <button onClick={newPost} className="text-blue-600 underline">Write your first one.</button></p>
          </div>
        )}
      </div>
    </div>
  );
}
