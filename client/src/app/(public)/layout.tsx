import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#0B0B0B] text-white relative">
      <div
        className="absolute inset-0 z-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,215,0,0.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(255,215,0,0.1), transparent 70%)",
        }}
      />

      <Header />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
