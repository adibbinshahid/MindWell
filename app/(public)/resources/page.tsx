"use client";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  { q:"How do I book an appointment?", a:'Use our online booking system — click "Book Appointment" in the navigation, select your specialist, choose a date and time, and confirm. You will receive an email confirmation instantly.' },
  { q:"Do I need a referral to book?", a:"No referral is needed. You can self-refer to any of our therapists or psychiatrists directly through our online booking system." },
  { q:"What is the difference between a therapist and a psychiatrist?", a:"Therapists (psychologists, licensed counsellors) provide talk therapy and behavioural interventions. Psychiatrists are medical doctors who can prescribe medication and also provide therapy. Many patients benefit from both working together." },
  { q:"How long is a typical session?", a:"Initial evaluations are 60–90 minutes. Therapy sessions are typically 50 minutes. Medication management follow-ups are 30 minutes. Couples and family sessions are 75 minutes." },
  { q:"Is telehealth as effective as in-person therapy?", a:"Yes. Research shows telehealth therapy achieves outcomes equivalent to in-person sessions for most conditions. Our platform is HIPAA-compliant and uses end-to-end encryption." },
  { q:"How do I cancel or reschedule my appointment?", a:"Log into your patient dashboard and manage appointments from there. We ask for at least 24 hours notice to avoid a late-cancellation fee." },
  { q:"What if I'm in crisis?", a:"Please call 988 (Suicide & Crisis Lifeline), text HOME to 741741 (Crisis Text Line), or call 911. Do not wait for a scheduled appointment — these services are available 24/7." },
  { q:"Is my information kept confidential?", a:"Yes. We are fully HIPAA compliant. Your health information is never shared without your written consent except in legally mandated situations (e.g., imminent risk of harm)." },
  { q:"Do you offer sliding scale fees?", a:"Yes. We offer reduced fees based on financial need. Please contact us to discuss. We want cost to never be a barrier to care." },
  { q:"What should I do before my first appointment?", a:"Complete the online intake form (see Patient Forms below), have your insurance card ready, find a private space if using telehealth, and note any questions or concerns you want to raise." },
];

const INSURANCE = [
  { name:"Aetna", covered:"Therapy + Psychiatry" },
  { name:"BlueCross BlueShield", covered:"Therapy + Psychiatry" },
  { name:"Cigna", covered:"Therapy" },
  { name:"United HealthCare", covered:"Therapy + Psychiatry" },
  { name:"Medicare", covered:"Psychiatry" },
  { name:"Medicaid (NY)", covered:"Psychiatry" },
];

const FORM_CARDS = [
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
      </svg>
    ),
    title: "New Patient Intake Form",
    desc: "Demographics, medical history, current symptoms, and goals of care.",
    badge: "Required — New Patients",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
    title: "Medication History Form",
    desc: "List of current and past medications, dosages, and any reported side effects.",
    badge: "Psychiatric Patients",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    title: "Insurance Verification Form",
    desc: "Provide your insurance information so we can verify coverage before your visit.",
    badge: "All Patients",
  },
];

const RESOURCE_CARDS = [
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    name: "988 Suicide & Crisis Lifeline",
    desc: "Free, confidential 24/7 support for people in distress.",
    tag: "Crisis",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    name: "Crisis Text Line",
    desc: "Text HOME to 741741 to connect with a trained crisis counsellor.",
    tag: "Crisis",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    name: "NAMI (National Alliance on Mental Illness)",
    desc: "Education, advocacy, and support for mental illness.",
    tag: "Education",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    ),
    name: "Mental Health America",
    desc: "Screening tools and resources for mental health conditions.",
    tag: "Self-Help",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    ),
    name: "NIMH (National Institute of Mental Health)",
    desc: "Research-backed information on mental health topics.",
    tag: "Research",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    name: "Headspace & Calm Apps",
    desc: "Guided meditation and mindfulness for daily stress management.",
    tag: "Self-Help",
  },
];

const ACCESSIBILITY_BADGES = [
  "Wheelchair Access",
  "Accessible Parking",
  "Elevator",
  "Hearing Loop",
  "Screen Reader Compatible",
  "Large Print Available",
];

export default function ResourcesPage() {
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  return (
    <>
      <div className="page-hero">
        <div className="max-w-6xl mx-auto px-6">
          <h1>Patient Resources</h1>
          <p>Everything you need to prepare for and manage your care at MindWell.</p>
        </div>
      </div>

      {/* Crisis Banner */}
      <div className="bg-red-600 text-white py-5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-semibold flex items-center justify-center gap-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            If you are in crisis or immediate danger:
          </p>
          <div className="flex gap-6 justify-center mt-2 text-sm flex-wrap">
            <span><strong>988</strong> — Suicide & Crisis Lifeline (call or text)</span>
            <span><strong>Text HOME to 741741</strong> — Crisis Text Line</span>
            <span><strong>911</strong> — Emergency Services</span>
          </div>
        </div>
      </div>

      {/* Patient Forms */}
      <section className="py-16" id="forms">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-tag">Intake Forms</div>
          <h2 className="text-3xl font-bold mt-2 mb-3">Patient Forms</h2>
          <p className="text-slate-500 mb-8">Complete these before your first appointment to save time and help us prepare. All forms are securely encrypted.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FORM_CARDS.map(f=>(
              <div key={f.title} className="card p-6">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">{f.badge}</span>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">{f.desc}</p>
                <a href="#" className="btn btn-primary btn-sm w-full justify-center">Download PDF</a>
              </div>
            ))}
          </div>
          <div className="alert alert-info mt-6 text-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>Forms are also available at the front desk. If you need assistance completing them, call <strong>(212) 555-0100</strong>.</span>
          </div>
        </div>
      </section>

      {/* Insurance & Fees */}
      <section className="py-16 bg-slate-50" id="insurance">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-tag">Coverage & Pricing</div>
          <h2 className="text-3xl font-bold mt-2 mb-10">Insurance & Fees</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h3 className="font-bold text-lg mb-5">Accepted Insurance Plans</h3>
              <div className="card divide-y divide-slate-100">
                {INSURANCE.map(ins=>(
                  <div key={ins.name} className="flex justify-between items-center px-5 py-3.5 text-sm">
                    <span className="font-medium text-slate-800">{ins.name}</span>
                    <span className="text-slate-500">{ins.covered}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-3">Don't see your insurer? Call us — we may still be able to accept it or provide a super-bill for out-of-network reimbursement.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-5">Self-Pay Fees</h3>
              <div className="card divide-y divide-slate-100 mb-5">
                {[
                  ["Initial Psychiatric Evaluation (90 min)","$350"],
                  ["Therapy Session (50 min)","$150"],
                  ["Couples / Family Session (75 min)","$200"],
                  ["Medication Management Follow-Up (30 min)","$120"],
                  ["Telehealth Session","Same as in-person"],
                ].map(([service,fee])=>(
                  <div key={service} className="flex justify-between items-center px-5 py-3.5 text-sm">
                    <span className="text-slate-700">{service}</span>
                    <span className="font-semibold text-slate-900">{fee}</span>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm">
                <p className="font-semibold text-green-800 mb-1">Sliding Scale Available</p>
                <p className="text-green-700">We offer reduced fees based on household income. Contact us to enquire — cost should never be a barrier to care.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" id="faq">
        <div className="max-w-3xl mx-auto px-6">
          <div className="section-tag">Common Questions</div>
          <h2 className="text-3xl font-bold mt-2 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((item,i)=>(
              <div key={i} className={`card overflow-hidden transition-all ${openFaq===i ? "border-blue-300" : ""}`}>
                <button onClick={()=>setOpenFaq(openFaq===i ? null : i)}
                  className="w-full text-left flex justify-between items-start gap-4 p-5">
                  <span className="font-semibold text-slate-900 text-sm leading-snug">{item.q}</span>
                  <span className="text-blue-600 text-xl font-light shrink-0 mt-0.5">{openFaq===i ? "−" : "+"}</span>
                </button>
                {openFaq===i && (
                  <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mental Health Resources */}
      <section className="py-16 bg-slate-50" id="external">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-tag">Helpful Links</div>
          <h2 className="text-3xl font-bold mt-2 mb-10">Mental Health Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {RESOURCE_CARDS.map(r=>(
              <div key={r.name} className="card p-6">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                  {r.icon}
                </div>
                <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">{r.tag}</span>
                <h4 className="font-bold text-sm mb-2">{r.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
            <h3 className="font-bold text-xl mb-4">Accessibility Statement</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">MindWell is committed to providing accessible services to all patients regardless of ability. Our office building features wheelchair access, elevator, and accessible parking. Our telehealth platform supports screen readers and keyboard navigation.</p>
            <div className="flex gap-4 flex-wrap">
              {ACCESSIBILITY_BADGES.map(a=>(
                <span key={a} className="bg-white border border-blue-200 text-slate-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  {a}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-4">Need a specific accommodation? Contact us at <strong>(212) 555-0100</strong> or <strong>hello@mindwellclinic.com</strong>.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-14">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to take the first step?</h2>
          <p className="text-blue-100 mb-7">Book an appointment online in under 2 minutes.</p>
          <Link href="/book" className="btn btn-white btn-lg">Book Appointment</Link>
        </div>
      </section>
    </>
  );
}
