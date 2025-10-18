import React from "react";
import { Menu, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderAdminProps {
  onMenuClick?: () => void;
  username?: string;
  onLogout?: () => void;
}

export default function HeaderAdmin({ onMenuClick, username = "Admin", onLogout }: HeaderAdminProps) {
  return (
    <header className="w-full flex items-center justify-between bg-white border-b px-6 py-4 shadow-sm sticky top-0 z-50">
      {/* Botón menú móvil */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-700">Panel de Administración</h1>
      </div>

      {/* Sección derecha */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <span className="text-sm text-gray-600 hidden md:block">{username}</span>
        <Button variant="destructive" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-1" /> Cerrar sesión
        </Button>
      </div>
    </header>
  );
}