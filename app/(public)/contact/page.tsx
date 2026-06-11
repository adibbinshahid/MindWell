"use client";
import { useState } from "react";
import type { Metadata } from "next";

export default function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", topic:"General Inquiry", message:"", consent:false });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const up = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(p=>({...p,[k]:e.target.value}));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) { setError("Please confirm you understand the privacy note."); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/contact",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ name:form.name, email:form.email, phone:form.phone||undefined, topic:form.topic, message:form.message }),
    });
    setLoading(false);
    if (res.ok) { setSent(true); }
    else { const d=await res.json(); setError(d.error??"Failed to send."); }
  }

  return (
    <>
      <div className="page-hero">
        <div className="max-w-6xl mx-auto px-6">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Reach out by phone, email, or the secure form below.</p>
        </div>
      </div>
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="alert alert-warning mb-8 max-w-2xl">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span><strong>Privacy:</strong> Do not include sensitive medical information here. Use our <a href="/resources#forms" className="underline font-semibold">secure intake forms</a> or call us directly.</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
              {[
                { iconKey:"pin", title:"Address", info:"123 Healing Lane, Suite 400\nNew York, NY 10001" },
                { iconKey:"phone", title:"Phone", info:"(212) 555-0100\nNot a crisis line — call 988 for emergencies" },
                { iconKey:"mail", title:"Email", info:"hello@mindwellclinic.com" },
                { iconKey:"clock", title:"Hours", info:"Mon–Fri: 8:00 AM – 7:00 PM\nSat: 9:00 AM – 3:00 PM\nSun: Closed" },
              ].map(item=>(
                <div key={item.title} className="flex gap-4 mb-6">
                  <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      {item.iconKey==="pin" && <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>}
                      {item.iconKey==="phone" && <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.18 2 2 0 015.05 7h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 14a16 16 0 006.29 6.29l1.06-1.26a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>}
                      {item.iconKey==="mail" && <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>}
                      {item.iconKey==="clock" && <><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></>}
                    </svg>
                  </div>
                  <div><h4 className="font-semibold text-sm mb-1">{item.title}</h4><p className="text-sm text-slate-500 whitespace-pre-line">{item.info}</p></div>
                </div>
              ))}
              <div className="bg-slate-100 rounded-2xl h-48 flex items-center justify-center flex-col gap-2 text-slate-400 mt-4">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                <p className="font-medium text-sm">123 Healing Lane, Suite 400</p>
                <p className="text-xs">Near Penn Station · Accessible entrance</p>
              </div>
            </div>

            {/* Form */}
            <div className="card p-8">
              <h2 className="text-xl font-bold mb-2">Send a Message</h2>
              <p className="text-slate-500 text-sm mb-6">General questions only. No private health information.</p>

              {sent ? (
                <div className="alert alert-success">
                  <span>✓</span>
                  <div><strong>Message sent!</strong><br/><span className="text-sm">We'll respond within 1 business day. For urgent matters, call (212) 555-0100.</span></div>
                </div>
              ) : (
                <>
                  {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="form-label">Name *</label><input className="form-control" required value={form.name} onChange={up("name")} placeholder="Jane Smith"/></div>
                      <div><label className="form-label">Email *</label><input type="email" className="form-control" required value={form.email} onChange={up("email")} placeholder="jane@email.com"/></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={up("phone")} placeholder="(212) 555-0100"/></div>
                      <div><label className="form-label">Topic</label>
                        <select className="form-control" value={form.topic} onChange={up("topic")}>
                          {["General Inquiry","Appointment / Booking","Insurance Question","Telehealth Help","Feedback","Other"].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label className="form-label">Message *</label>
                      <textarea className="form-control" rows={5} required value={form.message} onChange={up("message")} placeholder="How can we help? (general questions only)"/>
                    </div>
                    <label className="flex gap-3 items-start cursor-pointer text-sm">
                      <input type="checkbox" checked={form.consent} onChange={e=>setForm(p=>({...p,consent:e.target.checked}))} className="mt-1 accent-blue-600"/>
                      <span className="text-slate-600">I understand this form is for general enquiries only. I have read the <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>.</span>
                    </label>
                    <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
                      {loading ? "Sending…" : "Send Message"}
                    </button>
                  </form>
                </>
              )}

              <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Want to book an appointment?</p>
                  <p className="text-xs text-slate-500 mt-0.5">Use our online booking — done in 2 minutes.</p>
                </div>
                <a href="/book" className="btn btn-primary btn-sm shrink-0">Book Now</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-red-50 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-red-700 flex items-center justify-center gap-2 flex-wrap">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <strong>Not a crisis line.</strong> If you're in immediate danger, call <strong>988</strong> or <strong>911</strong>, or go to your nearest emergency room.
          </p>
        </div>
      </section>
    </>
  );
}
