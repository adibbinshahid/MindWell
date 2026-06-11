import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default async function AboutPage() {
  const doctors = await prisma.doctor.findMany({ where: { active: true }, orderBy: { name: "asc" } });

  return (
    <>
      <div className="page-hero">
        <div className="max-w-6xl mx-auto px-6">
          <h1>About MindWell</h1>
          <p>Our mission is to make quality mental health care accessible, compassionate, and effective.</p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-tag">Our Story</div>
            <h2 className="text-3xl font-bold mt-2 mb-5">Founded on Compassion,<br/>Built on Evidence</h2>
            <p className="text-slate-600 leading-relaxed mb-4">MindWell was founded in 2013 by Dr. Sarah Mitchell and Dr. James Okafor with a simple but powerful mission: to provide world-class mental health care in a warm, non-judgmental environment.</p>
            <p className="text-slate-600 leading-relaxed mb-4">After years of working in hospital settings, our founders saw how many people fell through the gaps. They set out to create something different: a clinic where every patient is treated as an individual, and where the therapeutic relationship comes first.</p>
            <p className="text-slate-600 leading-relaxed mb-8">Today, MindWell has helped over 500 patients across New York and beyond, with in-person and telehealth sessions available.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[["Compassion First","Every patient deserves to feel heard."],["Evidence-Based","Proven, research-backed treatments only."],["Total Confidentiality","HIPAA-compliant at every step."],["Inclusive Care","All backgrounds, identities, and needs welcome."]].map(([title,desc])=>(
                <div key={title} className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">✓</div>
                  <div><h4 className="font-semibold text-sm">{title}</h4><p className="text-xs text-slate-500 mt-0.5">{desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl p-10 text-center">
            <div className="text-5xl font-extrabold text-blue-600 mb-2">2013</div>
            <p className="text-slate-500 text-sm mb-8">Founded in New York City</p>
            <div className="grid grid-cols-2 gap-4">
              {[["500+","Patients Helped"],["4","Specialists"],["4.9★","Avg. Rating"],["10+","Years Exp."]].map(([num,label])=>(
                <div key={label} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-xl font-bold text-blue-600">{num}</div>
                  <div className="text-xs text-slate-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <div className="bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-10 flex-wrap">
          {["APA Member","HIPAA Compliant","Board Certified","NY State Licensed","Telehealth Certified"].map((label)=>(
            <div key={label} className="text-center">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>
              </div>
              <div className="text-xs font-semibold text-slate-600">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <section className="py-20" id="team">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-tag">Our Specialists</div>
            <h2 className="text-3xl font-bold mt-2">Meet the MindWell Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {doctors.map(doc => {
              const tags: string[] = JSON.parse(doc.tags || "[]");
              const langs: string[] = JSON.parse(doc.languages || "[]");
              const days: string[] = JSON.parse(doc.availableDays || "[]");
              return (
                <div key={doc.id} className="card overflow-hidden hover:shadow-lg transition-all">
                  <div className="flex gap-5 p-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-blue-600 flex items-center justify-center">
                      {(doc as {photoUrl?: string}).photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={(doc as {photoUrl?: string}).photoUrl!} alt={doc.name} className="w-full h-full object-cover"/>
                      ) : (
                        <span className="text-white text-2xl font-bold">{doc.initials}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-lg">{doc.name}</h3>
                          <p className="text-blue-600 text-sm font-medium">{doc.title}</p>
                        </div>
                        <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold shrink-0">{doc.role}</span>
                      </div>
                      <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-3">{doc.bio}</p>
                      <div className="flex gap-2 flex-wrap mt-3">
                        {tags.map(t=><span key={t} className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-medium">{t}</span>)}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                          {days.join(", ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                          {langs.join(", ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          {doc.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-5">
                    <Link href="/book" className="btn btn-primary btn-sm w-full justify-center">Book with {doc.name.split(" ")[0]} {doc.name.split(" ")[1]}</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-8">Book an appointment with one of our specialists today.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/book" className="btn btn-white btn-lg">Book Appointment</Link>
            <Link href="/contact" className="btn btn-lg border-2 border-white/40 text-white hover:bg-white/10">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
