"use client";

import Footer from "@/components/user/Footer";
import { useAdminSplash } from "@/hook/useAdminSplash";
import AdminAccessDeniedScreen from "@/components/admin/AdminDeniedScreen";
import { usePathname } from "next/navigation";
import AdminSplashScreen from "@/components/admin/AdminSplashScreen"
import { Header } from "@/components/user/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { showSplash, user } = useAdminSplash();
  const pathname = usePathname();

  const splashShown = typeof window !== "undefined"
    ? sessionStorage.getItem("adminSplashShown") === "true"
    : false;

  const adminOnPublicPage =
    user?.role === "admin" &&
    pathname === "/" &&
    !showSplash &&
    splashShown;

  if (showSplash) return <AdminSplashScreen name={user?.name} />;

  if (adminOnPublicPage) return <AdminAccessDeniedScreen />;

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
      <main className="relative z-10 mx-auto w-full max-w-7xl md:px-6 px-0 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
