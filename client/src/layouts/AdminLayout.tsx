"use client";

import React, { useState } from "react";
import { useAuth } from "@/hook/useAuth";
import HeaderAdmin from "@/components/admin/HeaderAdmin";
import { Sidebar } from "@/components/admin/Sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const [openSidebar, setOpenSidebar] = useState(false);
  

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <aside className="hidden md:flex">
        <Sidebar />
      </aside>

      <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-lg font-bold">Menú</SheetTitle>
            <SheetDescription>Accede a las secciones del panel de administración</SheetDescription>
          </SheetHeader>
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1">
        <HeaderAdmin onMenuClick={() => setOpenSidebar(true)} onLogout={logout} />
        <main className="flex-1 md:p-6 p-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
