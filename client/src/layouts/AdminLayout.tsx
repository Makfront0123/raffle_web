"use client";
import HeaderAdmin from "@/components/HeaderAdmin";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hook/useAuth";

import React from "react";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <HeaderAdmin onLogout={logout} />


        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
