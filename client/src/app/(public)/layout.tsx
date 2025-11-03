// app/(public)/layout.tsx
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 2px, #f3f4f6 2px, #f3f4f6 4px)",
        }}
      />
      <Header />
      <main className="flex-1 p-8 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
