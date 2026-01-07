import Footer from "@/components/user/Footer";
import { Header } from "@/components/user/Header";

import React from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-black relative">

      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
