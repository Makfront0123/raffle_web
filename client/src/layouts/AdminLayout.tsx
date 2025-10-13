import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Puedes agregar un sidebar específico del admin si quieres */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
