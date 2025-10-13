import Footer from "@/components/Footer";
import { Header } from "@/components/Header";

import React from "react";


export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8">{children}</main>
      <Footer />
    </div>
  );
}
