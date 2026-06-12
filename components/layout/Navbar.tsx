"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  {
    label: "Services",
    href: "/services",
    children: [
      { href: "/services#therapy", label: "Therapy" },
      { href: "/services#psychiatry", label: "Psychiatry" },
      { href: "/services#telehealth", label: "Telehealth" },
      { href: "/conditions", label: "Conditions Treated" },
    ],
  },
  { href: "/team", label: "Specialists" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { href: "/resources#forms", label: "Intake Forms" },
      { href: "/resources#faq", label: "FAQ" },
      { href: "/resources#insurance", label: "Insurance & Fees" },
      { href: "/resources#crisis", label: "Crisis Help" },
    ],
  },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-[72px] gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="MindWell Psychological Clinic" className="h-[42px] w-auto" />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link) =>
              link.children ? (
                <li key={link.label} className="relative group">
                  <Link
                    href={link.href}
                    className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
                      pathname.startsWith(link.href) ? "text-blue-600 bg-blue-50 font-semibold" : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {link.label} ▾
                  </Link>
                  {/* Invisible bridge keeps hover active across the gap */}
                  <div className="absolute top-full left-0 w-full h-3" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white border border-slate-200 rounded-xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)))
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            {session ? (
              <>
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                  className="btn btn-ghost btn-sm"
                >
                  {session.user.role === "ADMIN" ? "Admin Panel" : "My Appointments"}
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="btn btn-outline btn-sm">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-outline btn-sm whitespace-nowrap">Sign In</Link>
            )}
            <Link href="/book" className="btn btn-primary btn-sm whitespace-nowrap">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Book Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {open ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-100 pt-3 mt-2 flex flex-col gap-2">
            {session ? (
              <>
                <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} className="btn btn-outline btn-sm justify-center" onClick={() => setOpen(false)}>
                  {session.user.role === "ADMIN" ? "Admin Panel" : "My Appointments"}
                </Link>
                <button onClick={() => signOut()} className="btn btn-ghost btn-sm justify-center">Sign Out</button>
              </>
            ) : (
              <Link href="/login" className="btn btn-outline btn-sm justify-center" onClick={() => setOpen(false)}>Sign In</Link>
            )}
            <Link href="/book" className="btn btn-primary justify-center" onClick={() => setOpen(false)}>Book Appointment</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
