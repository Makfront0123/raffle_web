// src/layouts/UserLayout.tsx
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import React from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Diagonal Stripes Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, #f3f4f6 2px, #f3f4f6 4px)",
        }}
      />
      <Header /> {/* Client Component */}
      <main className="flex-1 p-8 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
