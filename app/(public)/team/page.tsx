import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Specialists" };

export default async function TeamPage() {
  const doctors = await prisma.doctor.findMany({ where: { active: true }, orderBy: { name: "asc" } });

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
        {/* Background dots */}
        <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage:"radial-gradient(circle, #60a5fa 1px, transparent 1px)", backgroundSize:"32px 32px"}}/>
        {/* Blue glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 rounded-full blur-3xl"/>
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/25 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Board-Certified Specialists
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Meet Our <span className="text-blue-400">Expert Team</span>
          </h1>
          <p className="text-blue-100/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Compassionate, evidence-based care from clinicians who genuinely care about your wellbeing.
          </p>
          <Link href="/book" className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all shadow-xl shadow-blue-900/40 hover:-translate-y-0.5">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Book an Appointment
          </Link>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: `${doctors.length}`, label: "Specialists" },
              { value: "500+", label: "Patients Helped" },
              { value: "4.9★", label: "Average Rating" },
              { value: "10+", label: "Years Experience" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</div>
                <div className="text-blue-300/70 text-xs font-medium mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation strip */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-center gap-8 flex-wrap">
          {["APA Member", "HIPAA Compliant", "Board Certified", "NY State Licensed", "Telehealth Certified"].map(label => (
            <div key={label} className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-blue-500"><polyline points="20,6 9,17 4,12"/></svg>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Team grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {doctors.map(doc => {
              const tags: string[] = JSON.parse(doc.tags || "[]");
              const langs: string[] = JSON.parse(doc.languages || "[]");
              const days: string[] = JSON.parse(doc.availableDays || "[]");
              const photoUrl = (doc as { photoUrl?: string }).photoUrl;

              return (
                <div key={doc.id} className="group relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  {/* Top accent */}
                  <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-400"/>

                  <div className="p-7">
                    <div className="flex gap-5 items-start">
                      {/* Photo */}
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 shadow-md">
                          {photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={photoUrl} alt={doc.name} className="w-full h-full object-cover object-top" />
                          ) : (
                            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                              {doc.initials}
                            </div>
                          )}
                        </div>
                        {/* Rating badge */}
                        <div className="absolute -bottom-2 -right-2 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 flex items-center gap-1 shadow-sm">
                          <svg width="10" height="10" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          <span className="text-[11px] font-bold text-slate-700">{doc.rating}</span>
                        </div>
                      </div>

                      {/* Identity */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-xl text-slate-900 leading-tight">{doc.name}</h3>
                          <span className="shrink-0 text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-0.5 rounded-full">
                            {doc.role}
                          </span>
                        </div>
                        <p className="text-blue-600 font-semibold text-sm mb-2">{doc.title}</p>

                        {/* Specialty tags */}
                        <div className="flex gap-1.5 flex-wrap">
                          {tags.slice(0, 4).map(t => (
                            <span key={t} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-medium">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-slate-600 text-sm leading-relaxed mt-5 line-clamp-3">{doc.bio}</p>

                    {/* Meta row */}
                    <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-blue-500"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Availability</div>
                          <div className="text-xs text-slate-700 font-medium mt-0.5">{days.join(", ")}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-blue-500"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Languages</div>
                          <div className="text-xs text-slate-700 font-medium mt-0.5">{langs.join(", ")}</div>
                        </div>
                      </div>
                    </div>

                    {/* Patients count */}
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex -space-x-1.5">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"/>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500"><strong className="text-slate-700">{doc.patientCount}+</strong> patients helped</span>
                    </div>
                  </div>

                  {/* Book button */}
                  <div className="px-7 pb-7">
                    <Link
                      href={`/book?doctor=${doc.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm transition-all group-hover:shadow-lg group-hover:shadow-blue-500/25"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      Book with {doc.name}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why our team */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-tag mb-2">Why Choose MindWell</div>
            <h2 className="text-3xl font-bold">What Sets Our Team Apart</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Board Certified", desc: "Every clinician holds active board certification in their specialty." },
              { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "Trauma-Informed", desc: "All staff trained in trauma-sensitive approaches and inclusive care." },
              { icon: "M15 10l4.553-2.069A1 1 0 0121 8.82V15a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z", title: "Telehealth Ready", desc: "Secure video sessions available from anywhere, any device." },
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "HIPAA Compliant", desc: "Your privacy is protected at every step of your care journey." },
            ].map(f => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-blue-600">
                    <path d={f.icon}/>
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle, white 1px, transparent 1px)", backgroundSize:"28px 28px"}}/>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to Take the First Step?</h2>
          <p className="text-blue-100/80 text-lg mb-8">Book a session with one of our specialists — same-week appointments available.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/book" className="btn btn-white btn-lg">Book Appointment</Link>
            <Link href="/contact" className="btn btn-lg border-2 border-white/40 text-white hover:bg-white/10">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
