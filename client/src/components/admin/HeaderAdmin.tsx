"use client";

import React from "react";
import { Menu, LogOut} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderAdminProps {
  onMenuClick?: () => void;
  username?: string;
  onLogout?: () => void;
}

export default function HeaderAdmin({
  onMenuClick,
  username = "Admin",
  onLogout,
}: HeaderAdminProps) {
  return (
    <header className="w-full flex items-center justify-between bg-white px-4 sm:px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-700">
          Panel de Administración
        </h1>
      </div>

      <div className="md:flex hidden items-center gap-4">
        <span className="text-sm text-gray-600 hidden md:block">{username}</span>
        <Button variant="destructive" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Cerrar sesión</span>
        </Button>
      </div>
    </header>
  );
}
