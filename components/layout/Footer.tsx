import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="text-white" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
                </svg>
              </div>
              <span className="font-bold text-white">MindWell</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">Compassionate, evidence-based mental health care for individuals, couples, and families.</p>
            <div className="bg-red-900/30 border border-red-800/40 rounded-xl p-4">
              <p className="text-red-400 text-sm font-semibold mb-1 flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Crisis Line 24/7
              </p>
              <p className="text-sm">Call or text <strong className="text-white">988</strong> for immediate support</p>
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[["Home","/"],["About Us","/about"],["Services","/services"],["Conditions Treated","/conditions"],["Book Appointment","/book"]].map(([label,href])=>(
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              {[["Intake Forms","/resources#forms"],["FAQ","/resources#faq"],["Insurance & Fees","/resources#insurance"],["Crisis Resources","/resources#crisis"],["Blog & Articles","/blog"]].map(([label,href])=>(
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2"><span className="shrink-0 text-slate-400"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></span><span>123 Healing Lane, Suite 400<br/>New York, NY 10001</span></li>
              <li className="flex items-start gap-2"><span className="shrink-0 text-slate-400"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.08 2.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></span><span><a href="tel:+12125550100" className="hover:text-white transition-colors">(212) 555-0100</a></span></li>
              <li className="flex items-start gap-2"><span className="shrink-0 text-slate-400"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span><span><a href="mailto:hello@mindwellclinic.com" className="hover:text-white transition-colors">hello@mindwellclinic.com</a></span></li>
              <li className="flex items-start gap-2"><span className="shrink-0 text-slate-400"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg></span><span>Mon–Fri: 8AM–7PM<br/>Sat: 9AM–3PM</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2024 MindWell Psychiatrist & Psychologist Clinic. All rights reserved.</p>
          <div className="flex gap-5 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/privacy#hipaa" className="hover:text-white transition-colors">HIPAA Notice</Link>
            <Link href="/resources#accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
