import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default async function AboutPage() {

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

      {/* Team teaser */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="section-tag mb-2">Our Specialists</div>
            <h2 className="text-2xl font-bold">Meet the MindWell Team</h2>
            <p className="text-slate-500 mt-1 text-sm">Board-certified psychiatrists and psychologists, here for you.</p>
          </div>
          <Link href="/team" className="btn btn-primary shrink-0">Meet Our Specialists →</Link>
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
