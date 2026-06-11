import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Services" };

const THERAPY_CARDS = [
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: "Individual Therapy",
    desc: "One-on-one sessions using CBT, ACT, mindfulness, and psychodynamic approaches.",
    features: ["50-minute sessions","Weekly or bi-weekly","In-person and telehealth","Sliding scale available"],
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: "Couples Therapy",
    desc: "Strengthen your relationship using the Gottman Method and evidence-based techniques.",
    features: ["75-minute joint sessions","Communication skills training","Conflict resolution","Pre-marital available"],
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    title: "Family Therapy",
    desc: "Address family dynamics, parent-child conflict, and systemic issues.",
    features: ["Multi-generational approach","Adolescent specialisation","Structured sessions","Home environment support"],
  },
];

const APPROACH_CARDS = [
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    ),
    name: "Cognitive Behavioural Therapy (CBT)",
    desc: "Gold standard for anxiety and depression.",
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polyline points="23,4 23,11 16,11"/>
        <polyline points="1,20 1,13 8,13"/>
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 11M1 13l4.64 4.36A9 9 0 0020.49 15"/>
      </svg>
    ),
    name: "Dialectical Behaviour Therapy (DBT)",
    desc: "Emotional regulation and distress tolerance.",
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    name: "EMDR Therapy",
    desc: "Evidence-based trauma processing technique.",
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/>
        <line x1="16" y1="8" x2="2" y2="22"/>
        <line x1="17.5" y1="15" x2="9" y2="15"/>
      </svg>
    ),
    name: "Acceptance & Commitment (ACT)",
    desc: "Mindfulness-based values-driven therapy.",
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    name: "Gottman Method",
    desc: "Research-based couples therapy.",
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    name: "Psychodynamic Therapy",
    desc: "Explores unconscious patterns and past experiences.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <div className="page-hero">
        <div className="max-w-6xl mx-auto px-6">
          <h1>Our Services</h1>
          <p>Comprehensive mental health care for individuals, couples, and families.</p>
        </div>
      </div>

      {/* Therapy */}
      <section className="py-20" id="therapy">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-tag">Psychological Services</div>
          <h2 className="text-3xl font-bold mt-2 mb-10">Therapy & Counselling</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {THERAPY_CARDS.map(s=>(
              <div key={s.title} className="card p-7">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">{s.desc}</p>
                <ul className="space-y-2 mb-6">
                  {s.features.map(f=><li key={f} className="text-sm text-slate-700 flex items-center gap-2"><span className="text-green-500">✓</span>{f}</li>)}
                </ul>
                <Link href="/book" className="btn btn-primary btn-sm w-full justify-center">Book Now</Link>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-8">
            <h3 className="font-bold text-xl mb-6">Therapy Approaches We Use</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {APPROACH_CARDS.map(t=>(
                <div key={t.name} className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-2">
                    {t.icon}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Psychiatry */}
      <section className="py-20 bg-slate-50" id="psychiatry">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-tag">Psychiatric Services</div>
          <h2 className="text-3xl font-bold mt-2 mb-10">Psychiatry & Medication Management</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="card p-7">
                <h3 className="font-bold text-lg mb-3">Initial Psychiatric Evaluation</h3>
                <p className="text-sm text-slate-600 leading-relaxed">A comprehensive 90-minute assessment including detailed history, symptom review, and diagnosis. Your psychiatrist will develop a personalised treatment plan that may include therapy, medication, or both.</p>
              </div>
              <div className="card p-7">
                <h3 className="font-bold text-lg mb-3">Ongoing Medication Management</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Regular 30-minute follow-ups to monitor effectiveness, adjust dosages, manage side effects, and renew prescriptions.</p>
              </div>
            </div>
            <div className="card p-7">
              <h3 className="font-bold mb-5">Conditions We Medically Treat</h3>
              {[["Major Depressive Disorder","Antidepressants"],["Generalised Anxiety","Anxiolytics"],["ADHD / ADD","Stimulants"],["Bipolar Disorder","Mood Stabilisers"],["OCD","SSRIs"],["PTSD","Multiple Options"],["Schizophrenia","Antipsychotics"]].map(([cond,med])=>(
                <div key={cond} className="flex justify-between py-3 border-b border-slate-100 last:border-0 text-sm">
                  <span className="text-slate-700">{cond}</span>
                  <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-medium">{med}</span>
                </div>
              ))}
              <Link href="/book" className="btn btn-primary btn-sm w-full justify-center mt-5">Book Evaluation</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Telehealth */}
      <section className="py-20" id="telehealth">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-tag">Online Care</div>
          <h2 className="text-3xl font-bold mt-2 mb-10">Telehealth Sessions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[["1","Book Online","Select your specialist and choose a telehealth slot."],["2","Get the Link","Receive a secure HIPAA-compliant video link by email."],["3","Join Session","Connect from phone, tablet, or computer — no app needed."],["4","Follow Up","Receive your session summary and next appointment."]].map(([n,title,desc])=>(
              <div key={n} className="text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{n}</div>
                <h4 className="font-semibold mb-2">{title}</h4>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-7">
              <h3 className="font-bold mb-4">What Telehealth Includes</h3>
              {["All therapy types (CBT, DBT, couples)","Psychiatric evaluations","Medication management follow-ups","Prescription renewal (where permitted)","Encrypted, HIPAA-compliant platform","Same rates as in-person"].map(f=>(
                <div key={f} className="flex items-center gap-2 text-sm text-slate-700 py-1.5 border-b border-blue-100 last:border-0">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-600 shrink-0" viewBox="0 0 24 24">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  {f}
                </div>
              ))}
            </div>
            <div className="card p-7">
              <h3 className="font-bold mb-4">Requirements</h3>
              {[
                "Device with camera and microphone",
                "Stable internet (4 Mbps+)",
                "Private, quiet space",
                "Valid email for link delivery",
              ].map(r=>(
                <div key={r} className="flex items-center gap-2 text-sm text-slate-700 py-1.5 border-b border-slate-100 last:border-0">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-600 shrink-0" viewBox="0 0 24 24">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  {r}
                </div>
              ))}
              <Link href="/book" className="btn btn-primary btn-sm w-full justify-center mt-5">Book Telehealth</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
