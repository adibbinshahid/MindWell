import CrisisBanner from "@/components/layout/CrisisBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CrisisBanner />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
