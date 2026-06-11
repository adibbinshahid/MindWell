import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getDoctors() {
  return prisma.doctor.findMany({ where: { active: true }, take: 4 });
}

async function getLatestPosts() {
  return prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 });
}

async function getHeroImage() {
  const rec = await prisma.siteContent.findUnique({ where: { key: "hero_main" } });
  return rec?.value ?? null;
}

export default async function HomePage() {
  const [doctors, posts, heroImage] = await Promise.all([getDoctors(), getLatestPosts(), getHeroImage()]);

  return (
    <div className="slides-wrapper">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="slide-section relative overflow-hidden">
        {/* Background */}
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900" aria-hidden="true">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" aria-hidden="true" />

        {/* Content — flex-1 fills available height, centers content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-full text-sm font-medium border border-white/20 mb-6">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            Compassionate Care. Lasting Change.
          </div>
          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
            Your Mental Health<br/>
            Is <span className="text-blue-300">Our Priority</span>
          </h1>
          {/* Subtitle */}
          <p className="text-base sm:text-xl text-white/75 max-w-2xl mx-auto mb-8 leading-relaxed">
            We provide personalized care for a healthier mind and a better tomorrow. Our team of psychiatrists and psychologists is here to support you.
          </p>
          {/* CTAs */}
          <div className="flex gap-3 sm:gap-4 flex-wrap justify-center mb-10">
            <Link href="/book" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-xl shadow-blue-900/40 hover:-translate-y-0.5">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Book Appointment
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all border border-white/30 hover:-translate-y-0.5">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
              Meet Our Team
            </Link>
          </div>
          {/* Trust badges */}
          <div className="flex gap-5 sm:gap-10 flex-wrap justify-center">
            {([
              ["shield","Confidential & Safe"],
              ["users","Expert Specialists"],
              ["heart","Personalized Care"],
            ] as [string,string][]).map(([iconKey,label])=>(
              <div key={label} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/70">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-blue-300 shrink-0">
                  {iconKey==="shield" && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
                  {iconKey==="users" && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>}
                  {iconKey==="heart" && <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>}
                </svg>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator pinned to bottom */}
        <div className="relative z-10 flex flex-col items-center gap-2 pb-6 text-white/40 select-none">
          <span className="text-[9px] tracking-[0.25em] uppercase font-medium">Scroll to know more</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────────── */}
      <section className="slide-section bg-slate-50">
        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="text-center mb-8">
              <div className="section-tag">What We Offer</div>
              <h2 className="text-3xl font-bold mt-2">Our Services</h2>
              <p className="text-slate-500 mt-2">Comprehensive mental health care tailored to your unique needs.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { iconKey:"activity", title:"Psychiatric Evaluation", desc:"Comprehensive diagnosis and treatment planning.", href:"/services#psychiatry" },
                { iconKey:"message", title:"Individual Therapy", desc:"One-on-one sessions with a licensed psychologist.", href:"/services#therapy" },
                { iconKey:"users", title:"Couples Therapy", desc:"Strengthen your relationship with professional support.", href:"/services#therapy" },
                { iconKey:"video", title:"Telehealth Sessions", desc:"Secure video sessions from anywhere.", href:"/services#telehealth" },
                { iconKey:"plus-circle", title:"Medication Management", desc:"Careful psychiatric medication monitoring.", href:"/services#psychiatry" },
                { iconKey:"clipboard", title:"Conditions Treated", desc:"Anxiety, depression, ADHD, OCD, PTSD & more.", href:"/conditions" },
                { iconKey:"wind", title:"Stress & Anxiety", desc:"Evidence-based strategies using CBT and mindfulness.", href:"/services#therapy" },
                { iconKey:"file-text", title:"New Patient Intake", desc:"Complete forms online before your first visit.", href:"/resources#forms" },
              ].map((s)=>(
                <Link key={s.title} href={s.href} className="card-hover p-4 group">
                  <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      {s.iconKey==="activity" && <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>}
                      {s.iconKey==="message" && <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>}
                      {s.iconKey==="users" && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>}
                      {s.iconKey==="video" && <><polygon points="23,7 16,12 23,17 23,7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>}
                      {s.iconKey==="plus-circle" && <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>}
                      {s.iconKey==="clipboard" && <><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></>}
                      {s.iconKey==="wind" && <><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></>}
                      {s.iconKey==="file-text" && <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></>}
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-sm">{s.title}</h3>
                  <p className="text-xs text-slate-500 mb-2 leading-relaxed">{s.desc}</p>
                  <span className="text-blue-600 text-xs font-semibold">Learn More →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Us ────────────────────────────────────────────────────── */}
      <section className="slide-section">
        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="text-center mb-10">
              <div className="section-tag">Why MindWell</div>
              <h2 className="text-3xl font-bold mt-2">Care You Can Trust</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { iconKey:"award", title:"Experienced Professionals", desc:"Licensed psychiatrists and psychologists with 10+ years experience." },
                { iconKey:"lock", title:"Confidential & Secure", desc:"Your privacy is our highest priority. Fully HIPAA-compliant." },
                { iconKey:"shield-check", title:"Evidence-Based Care", desc:"Proven treatments including CBT, DBT, and medication management." },
                { iconKey:"calendar", title:"Easy Booking", desc:"Book online in minutes. In-person or telehealth available." },
              ].map((w)=>(
                <div key={w.title} className="text-center p-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      {w.iconKey==="award" && <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>}
                      {w.iconKey==="lock" && <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>}
                      {w.iconKey==="shield-check" && <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/></>}
                      {w.iconKey==="calendar" && <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>}
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2">{w.title}</h4>
                  <p className="text-sm text-slate-500">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Specialists ───────────────────────────────────────────────── */}
      <section className="slide-section bg-slate-50">
        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="text-center mb-8">
              <div className="section-tag">Our Team</div>
              <h2 className="text-3xl font-bold mt-2">Meet Our Specialists</h2>
              <p className="text-slate-500 mt-2">Board-certified psychiatrists and licensed psychologists.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {doctors.map((doc) => {
                const tags: string[] = JSON.parse(doc.tags || "[]");
                return (
                  <div key={doc.id} className="card-hover overflow-hidden">
                    <div className="h-44 bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden">
                      {(doc as {photoUrl?: string}).photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={(doc as {photoUrl?: string}).photoUrl!}
                          alt={doc.name}
                          className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {doc.initials}
                          </div>
                        </div>
                      )}
                      <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {doc.role}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-base mb-1">{doc.name}</h3>
                      <p className="text-blue-600 text-xs font-medium mb-2">{doc.title}</p>
                      <div className="flex gap-1.5 flex-wrap mb-3">
                        {tags.slice(0,2).map((t) => (
                          <span key={t} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">{t}</span>
                        ))}
                      </div>
                      <Link href="/book" className="btn btn-outline btn-sm w-full justify-center">Book</Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-7">
              <Link href="/about#team" className="btn btn-outline">View All Specialists</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="slide-section">
        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="text-center mb-10">
              <div className="section-tag">Patient Voices</div>
              <h2 className="text-3xl font-bold mt-2">What Our Patients Say</h2>
              <p className="text-slate-500 mt-2">Anonymous reviews shared with consent.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { text:"Coming to MindWell was the best decision I ever made. Dr. Mitchell helped me understand my anxiety and gave me real tools to manage it. I feel like myself again.", by:"A.T.", label:"Anxiety & Depression · 8 months" },
                { text:"Dr. Okafor took the time to really listen. The medication he prescribed has changed my life. I finally feel stable after years of struggling.", by:"M.R.", label:"Bipolar Disorder · 1 year" },
                { text:"The telehealth option made it possible for me to get help. Dr. Nair is incredibly warm and skilled. My relationship has improved so much since we started couples therapy.", by:"S.K.", label:"Couples Therapy · 6 months" },
              ].map((t)=>(
                <div key={t.by} className="card p-6">
                  <div className="flex gap-1 text-amber-400 mb-3">{"★★★★★".split("").map((s,i)=><span key={i}>{s}</span>)}</div>
                  <p className="text-slate-700 italic leading-relaxed mb-5 text-sm">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">{t.by}</div>
                    <div>
                      <div className="font-semibold text-sm">Anonymous Patient</div>
                      <div className="text-xs text-slate-500">{t.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog ──────────────────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="slide-section bg-slate-50">
          <div className="flex-1 flex flex-col justify-center py-8">
            <div className="max-w-6xl mx-auto px-6 w-full">
              <div className="text-center mb-8">
                <div className="section-tag">From Our Specialists</div>
                <h2 className="text-3xl font-bold mt-2">Mental Health Articles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover overflow-hidden">
                    <div className="h-36 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-400">
                      <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                    </div>
                    <div className="p-4">
                      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100 mb-2">{post.category}</span>
                      <h3 className="font-semibold text-slate-900 mb-1 leading-snug text-sm">{post.title}</h3>
                      <p className="text-xs text-slate-500">{post.excerpt}</p>
                      <div className="mt-3 flex justify-between text-xs text-slate-400">
                        <span>{post.author}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-7">
                <Link href="/blog" className="btn btn-outline">View All Articles</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="slide-section bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="max-w-6xl mx-auto px-6 w-full text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Take the First Step?</h2>
            <p className="text-blue-100 text-lg mb-10">Book your appointment today. Telehealth and in-person sessions available.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/book" className="btn btn-white btn-lg">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                Book Appointment
              </Link>
              <Link href="/contact" className="btn btn-lg border-2 border-white/40 text-white hover:bg-white/10">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
