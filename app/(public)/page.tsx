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
    <>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col overflow-hidden"
        style={{ minHeight: "calc(100svh - 108px)" }}
      >
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
        {/* Layered overlays: base dark + center-weighted radial for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" aria-hidden="true" />
        <div className="absolute inset-0" style={{background:"radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 100%)"}} aria-hidden="true" />

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-full text-sm font-medium border border-white/20 mb-6">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            Compassionate Care. Lasting Change.
          </div>
          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight drop-shadow-lg">
            Your Mental Health<br/>
            Is <span className="text-blue-500">Our Priority</span>
          </h1>
          {/* Subtitle */}
          <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow">
            We provide personalized care for a healthier mind and a better tomorrow. Our team of psychiatrists and psychologists is here to support you.
          </p>
          {/* CTAs */}
          <div className="flex gap-3 sm:gap-4 flex-wrap justify-center mb-10">
            <Link href="/book" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-xl shadow-blue-900/40 hover:-translate-y-0.5">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Book Appointment
            </Link>
            <Link href="/team" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all border border-white/35 hover:-translate-y-0.5">
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
              <div key={label} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/75 drop-shadow">
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

        {/* Floating pills – lower left */}
        <div
          className="fixed left-4 sm:left-6 z-[9985] hidden sm:flex flex-col gap-2.5"
          style={{bottom:24}}
        >
          {/* Admin Panel */}
          <a
            href="https://mind-well-plum.vercel.app/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 pl-2 pr-4 py-2 transition-all duration-250 hover:scale-[1.03] hover:shadow-lg"
            style={{
              background:"rgba(238,232,218,0.92)",
              backdropFilter:"blur(24px) saturate(160%)",
              WebkitBackdropFilter:"blur(24px) saturate(160%)",
              border:"1px solid rgba(255,255,255,0.80)",
              borderRadius:999,
              boxShadow:"0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.90) inset",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{background:"rgba(201,168,76,0.90)",boxShadow:"0 2px 8px rgba(201,168,76,0.45)"}}
            >
              <svg width="17" height="17" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9,12 11,14 15,10"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(0,0,0,0.55)",lineHeight:1.2,fontWeight:700}}>Experience the</p>
              <p style={{fontSize:13,fontWeight:800,color:"rgba(0,0,0,0.88)",lineHeight:1.3,letterSpacing:"0.01em"}}>Admin Panel</p>
            </div>
            <svg width="13" height="13" fill="none" stroke="rgba(0,0,0,0.40)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="ml-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform duration-200">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          {/* Fiverr */}
          <a
            href="https://www.fiverr.com/adib_bin_shahid"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 pl-2 pr-4 py-2 transition-all duration-250 hover:scale-[1.03] hover:shadow-lg"
            style={{
              background:"rgba(238,232,218,0.92)",
              backdropFilter:"blur(24px) saturate(160%)",
              WebkitBackdropFilter:"blur(24px) saturate(160%)",
              border:"1px solid rgba(255,255,255,0.80)",
              borderRadius:999,
              boxShadow:"0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.90) inset",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{background:"#1DBF73",boxShadow:"0 2px 8px rgba(29,191,115,0.45)"}}
            >
              <span style={{fontSize:9,fontWeight:800,color:"#fff",letterSpacing:"-0.03em",lineHeight:1}}>
                fiverr<span style={{fontSize:12}}>.</span>
              </span>
            </div>
            <div className="min-w-0">
              <p style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(0,0,0,0.55)",lineHeight:1.2,fontWeight:700}}>Contact us on</p>
              <p style={{fontSize:13,fontWeight:800,color:"rgba(0,0,0,0.88)",lineHeight:1.3,letterSpacing:"0.01em"}}>Fiverr</p>
            </div>
            <svg width="13" height="13" fill="none" stroke="rgba(0,0,0,0.40)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="ml-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform duration-200">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
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
      <section className="bg-slate-50 py-20">
        <div>
          <div className="max-w-6xl mx-auto px-6 w-full">

            {/* Header row + clinic stats */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
              <div>
                <div className="section-tag">What We Offer</div>
                <h2 className="text-3xl font-bold mt-1">Our Services</h2>
                <p className="text-slate-500 mt-1 text-sm">Comprehensive mental health care for every stage of your journey.</p>
              </div>
              <div className="flex gap-5 shrink-0">
                {[["500+","Patients Helped"],["4.9★","Avg Rating"],["10+","Yrs Experience"],["HIPAA","Certified"]].map(([v,l])=>(
                  <div key={l} className="text-center">
                    <div className="font-extrabold text-blue-600 text-lg leading-none">{v}</div>
                    <div className="text-slate-400 text-[10px] mt-0.5 leading-none">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2-col layout: featured cards left + service list right */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

              {/* Featured services — 2 tall cards */}
              <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-3">
                <Link href="/services#psychiatry" className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white hover:-translate-y-0.5 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
                    </div>
                    <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">MOST POPULAR</span>
                  </div>
                  <h3 className="font-bold text-base mb-1">Psychiatric Evaluation</h3>
                  <p className="text-blue-100 text-xs mb-3 leading-relaxed">Comprehensive mental health assessment, diagnosis, and personalized treatment planning by board-certified psychiatrists.</p>
                  <div className="flex flex-wrap gap-1">
                    {["Anxiety","Depression","ADHD","Bipolar"].map(t=><span key={t} className="bg-white/15 text-[10px] px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-blue-200">
                    <span>In-Person &amp; Telehealth</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
                <Link href="/services#therapy" className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white hover:-translate-y-0.5 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    </div>
                    <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">EVIDENCE-BASED</span>
                  </div>
                  <h3 className="font-bold text-base mb-1">Individual Therapy</h3>
                  <p className="text-slate-300 text-xs mb-3 leading-relaxed">One-on-one sessions using CBT, DBT, and mindfulness techniques tailored to your specific goals.</p>
                  <div className="flex flex-wrap gap-1">
                    {["CBT","DBT","Trauma","PTSD"].map(t=><span key={t} className="bg-white/10 text-[10px] px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>50-min sessions</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              </div>

              {/* 6 compact services — 2-col grid */}
              <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { iconKey:"users",       title:"Couples Therapy",      desc:"Rebuild trust and communication.", tags:["Relationships","Conflict"], href:"/services#therapy" },
                  { iconKey:"video",       title:"Telehealth",            desc:"Secure video from anywhere.",     tags:["Remote","Same-day"],        href:"/services#telehealth" },
                  { iconKey:"plus-circle", title:"Medication Mgmt",       desc:"Psychiatric medication review.",  tags:["Monitoring","Refills"],      href:"/services#psychiatry" },
                  { iconKey:"clipboard",   title:"Conditions Treated",    desc:"Anxiety, OCD, PTSD & more.",     tags:["Diagnosis","Treatment"],     href:"/conditions" },
                  { iconKey:"wind",        title:"Stress & Anxiety",      desc:"CBT-based coping strategies.",   tags:["CBT","Mindfulness"],         href:"/services#therapy" },
                  { iconKey:"file-text",   title:"New Patient Intake",    desc:"Online forms before first visit.",tags:["Quick","Paperless"],        href:"/resources#forms" },
                ].map((s)=>(
                  <Link key={s.title} href={s.href} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col items-center text-center">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-2.5">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        {s.iconKey==="users"       && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>}
                        {s.iconKey==="video"       && <><polygon points="23,7 16,12 23,17 23,7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>}
                        {s.iconKey==="plus-circle" && <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>}
                        {s.iconKey==="clipboard"   && <><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></>}
                        {s.iconKey==="wind"        && <><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></>}
                        {s.iconKey==="file-text"   && <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>}
                      </svg>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-xs mb-1 leading-snug">{s.title}</h4>
                    <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">{s.desc}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {s.tags.map(t=><span key={t} className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded-full font-medium">{t}</span>)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Why Us ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div>
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

              {/* Left: header + stat boxes */}
              <div className="lg:col-span-2">
                <div className="section-tag mb-2">Why MindWell</div>
                <h2 className="text-3xl font-bold mb-1">Care You<br/>Can Trust</h2>
                <p className="text-slate-500 text-sm mb-5">Every decision we make is guided by clinical excellence, patient dignity, and lasting results.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-600 text-white rounded-2xl p-4">
                    <div className="text-3xl font-extrabold leading-none">500+</div>
                    <div className="text-blue-200 text-xs mt-1">Patients Helped</div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-2xl p-4">
                    <div className="text-3xl font-extrabold leading-none">4.9<span className="text-amber-400 text-xl">★</span></div>
                    <div className="text-slate-400 text-xs mt-1">Average Rating</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <div className="text-3xl font-extrabold leading-none text-blue-700">10+</div>
                    <div className="text-slate-500 text-xs mt-1">Years in Practice</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                    <div className="text-2xl font-extrabold leading-none text-emerald-700">HIPAA</div>
                    <div className="text-slate-500 text-xs mt-1">100% Compliant</div>
                  </div>
                </div>
              </div>

              {/* Right: 2×2 feature cards */}
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    iconKey:"award",
                    accent:"bg-blue-600 text-white",
                    title:"Board-Certified Specialists",
                    points:["Licensed psychiatrists & psychologists with 10+ years","Ongoing training in latest evidence-based protocols","Specialized in anxiety, mood disorders, trauma & ADHD"],
                  },
                  {
                    iconKey:"lock",
                    accent:"bg-slate-800 text-white",
                    title:"Complete Privacy & Confidentiality",
                    points:["HIPAA-compliant encrypted patient records","Anonymous scheduling available on request","Zero data sharing — your story stays with us"],
                  },
                  {
                    iconKey:"shield-check",
                    accent:"bg-blue-600 text-white",
                    title:"Evidence-Based Treatment Methods",
                    points:["CBT, DBT, EMDR, and mindfulness-based therapies","Medication management with continuous monitoring","Outcome tracking every 4 weeks to measure progress"],
                  },
                  {
                    iconKey:"calendar",
                    accent:"bg-emerald-600 text-white",
                    title:"Accessible & Flexible Care",
                    points:["In-person and telehealth — same week availability","Most major insurance plans accepted","Sliding scale fees for those with financial need"],
                  },
                ].map((w)=>(
                  <div key={w.title} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${w.accent}`}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        {w.iconKey==="award"        && <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>}
                        {w.iconKey==="lock"         && <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>}
                        {w.iconKey==="shield-check" && <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/></>}
                        {w.iconKey==="calendar"     && <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>}
                      </svg>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-2.5">{w.title}</h4>
                    <ul className="space-y-1.5">
                      {w.points.map(pt=>(
                        <li key={pt} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 shrink-0 mt-0.5"><polyline points="20,6 9,17 4,12"/></svg>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Specialists ───────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div>
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
                      <Link href={`/book?doctor=${doc.id}`} className="btn btn-outline btn-sm w-full justify-center">Book</Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-7">
              <Link href="/team" className="btn btn-outline">View All Specialists</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"/>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"/>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[260px] font-serif text-white/[0.02] leading-none select-none">"</div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="inline-block bg-white/10 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border border-white/10 mb-3">Patient Voices</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">What Our<br/>Patients Say</h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xs">Anonymous reviews shared with full consent. Real stories, real change.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Featured */}
            <div className="lg:col-span-3 bg-gradient-to-br from-blue-600/25 to-indigo-600/15 border border-blue-500/25 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-0.5 mb-5">
                  {"★★★★★".split("").map((s,i)=><span key={i} className="text-amber-400 text-xl">{s}</span>)}
                </div>
                <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="text-blue-400/40 mb-4"><path d="M0 30V18C0 8.4 5.6 2.4 16.8 0L18.4 3.2C13.2 4.8 10 8 9.6 12H16V30H0ZM24 30V18C24 8.4 29.6 2.4 40.8 0L42.4 3.2C37.2 4.8 34 8 33.6 12H40V30H24Z" fill="currentColor"/></svg>
                <p className="text-white text-lg sm:text-xl leading-relaxed font-light">
                  Coming to MindWell was the best decision I ever made. Dr. Mitchell helped me understand my anxiety and gave me real tools to manage it. I feel like myself again.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://i.pravatar.cc/96?img=47" alt="Patient" className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-blue-400/40"/>
                <div>
                  <div className="text-white font-semibold text-sm">Anonymous Patient</div>
                  <div className="text-blue-300 text-xs mt-0.5">Anxiety &amp; Depression · 8 months</div>
                </div>
                <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">Verified</span>
              </div>
            </div>

            {/* Two side testimonials */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {[
                { text:"Dr. Okafor took the time to really listen. The medication he prescribed has changed my life. I finally feel stable after years of struggling.", avatar:"https://i.pravatar.cc/96?img=11", label:"Bipolar Disorder · 1 year", color:"from-indigo-600/20 to-violet-600/10", border:"border-indigo-500/20" },
                { text:"The telehealth option made it possible for me to get help. Dr. Nair is incredibly warm and skilled. My relationship has improved so much.", avatar:"https://i.pravatar.cc/96?img=9", label:"Couples Therapy · 6 months", color:"from-violet-600/20 to-pink-600/10", border:"border-violet-500/20" },
              ].map((t)=>(
                <div key={t.label} className={`bg-gradient-to-br ${t.color} border ${t.border} rounded-2xl p-6 flex flex-col justify-between flex-1`}>
                  <div>
                    <div className="flex gap-0.5 mb-3">
                      {"★★★★★".split("").map((s,i)=><span key={i} className="text-amber-400 text-sm">{s}</span>)}
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">"{t.text}"</p>
                  </div>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.avatar} alt="Patient" className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-white/20"/>
                    <div className="text-xs">
                      <div className="text-white font-medium">Anonymous Patient</div>
                      <div className="text-slate-500 mt-0.5">{t.label}</div>
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
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="section-tag">From Our Specialists</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2 leading-tight">Mental Health<br/>Articles</h2>
              </div>
              <Link href="/blog" className="btn btn-outline shrink-0">View All Articles →</Link>
            </div>

            {posts.length >= 3 ? (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Featured article */}
                <Link href={`/blog/${posts[0].slug}`} className="lg:col-span-3 group rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="relative h-56 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
                    {posts[0].imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={posts[0].imageUrl} alt={posts[0].title} className="absolute inset-0 w-full h-full object-cover"/>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <svg width="120" height="120" fill="none" stroke="white" strokeWidth="1" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="inline-block bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{posts[0].category}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">{posts[0].title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed flex-1">{posts[0].excerpt}</p>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{posts[0].author[0]}</div>
                        <span className="text-xs font-medium text-slate-600">{posts[0].author}</span>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(posts[0].createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
                    </div>
                  </div>
                </Link>

                {/* 2 compact articles */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                  {posts.slice(1,3).map((post,i)=>(
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 p-4 overflow-hidden flex-1">
                      <div className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br ${i===0?"from-indigo-100 to-purple-100":"from-emerald-100 to-teal-100"} flex items-center justify-center`}>
                        {post.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover"/>
                        ) : (
                          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" className={i===0?"text-indigo-400":"text-emerald-500"} viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                        )}
                      </div>
                      <div className="flex flex-col justify-between min-w-0">
                        <div>
                          <span className="inline-block text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">{post.category}</span>
                          <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                          <span>{post.author}</span>
                          <span>·</span>
                          <span>{new Date(post.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post)=>(
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-300 overflow-hidden relative">
                      {post.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover"/>
                      ) : (
                        <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{post.category}</span>
                      <h3 className="font-semibold text-slate-900 mt-1 text-sm leading-snug group-hover:text-blue-600 transition-colors">{post.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"/>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4"/>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: main content */}
            <div>
              <span className="inline-block bg-white/10 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border border-white/10 mb-6">Get Started Today</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
                Ready to Take<br/>
                <span className="text-blue-400">the First Step?</span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-md">
                Your mental health journey starts with one appointment. Same-week availability, telehealth and in-person options.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/book" className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all shadow-xl shadow-blue-900/50 hover:-translate-y-0.5">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Book Appointment
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/15 text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all border border-white/20 hover:-translate-y-0.5">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  Talk to Us
                </Link>
              </div>
              {/* Trust row */}
              <div className="flex flex-wrap gap-5 text-sm text-slate-400">
                {[["shield","HIPAA Certified"],["lock","100% Confidential"],["calendar","Same-week Appts"]].map(([icon,label])=>(
                  <div key={label} className="flex items-center gap-1.5">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-blue-400">
                      {icon==="shield"   && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
                      {icon==="lock"     && <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>}
                      {icon==="calendar" && <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>}
                    </svg>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating stat cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value:"500+", label:"Patients Helped", sub:"Since 2014", color:"from-blue-600/30 to-blue-800/20", border:"border-blue-500/20", accent:"text-blue-300" },
                { value:"4.9★", label:"Patient Rating",  sub:"Based on 200+ reviews", color:"from-amber-500/20 to-orange-600/10", border:"border-amber-500/20", accent:"text-amber-300" },
                { value:"10+",  label:"Years Experience", sub:"Board-certified team", color:"from-indigo-600/25 to-violet-600/15", border:"border-indigo-500/20", accent:"text-indigo-300" },
                { value:"2×",   label:"Weekly Intake",   sub:"New patient slots open", color:"from-emerald-600/20 to-teal-600/10", border:"border-emerald-500/20", accent:"text-emerald-300" },
              ].map((s)=>(
                <div key={s.label} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-5`}>
                  <div className={`text-3xl font-extrabold ${s.accent} leading-none mb-1`}>{s.value}</div>
                  <div className="text-white text-sm font-semibold">{s.label}</div>
                  <div className="text-slate-500 text-xs mt-1">{s.sub}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

    </>
  );
}
