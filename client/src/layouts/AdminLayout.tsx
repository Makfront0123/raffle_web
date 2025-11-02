"use client";

import React, { useState } from "react";
import { useAuth } from "@/hook/useAuth";

import HeaderAdmin from "@/components/HeaderAdmin";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/Sidebar";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar visible solo en desktop */}
      <aside className="hidden md:flex">
        <Sidebar />
      </aside>

      {/* Sheet (sidebar móvil) */}
      <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <HeaderAdmin onMenuClick={() => setOpenSidebar(true)} onLogout={logout} />
        <main className="flex-1 md:p-6 p-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
