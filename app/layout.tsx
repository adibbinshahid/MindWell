import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "MindWell – Psychiatrist & Psychologist Clinic", template: "%s – MindWell" },
  description: "Compassionate, evidence-based mental health care. Book with our psychiatrists and psychologists in New York or via telehealth.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
