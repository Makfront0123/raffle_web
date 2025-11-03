"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/routes/AppRoutes";
import { AuthDialog } from "./AuthDialog";
import { useAuth } from "@/hook/useAuth";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const mainRoutes = appRoutes[0]?.children || [];

export function Header() {
  const { user, logout } = useAuth();
  const [openAuth, setOpenAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="w-full relative z-50 bg-white shadow-sm">
      <nav className="w-full animate-bottom-fade-in p-4 md:p-6 flex justify-between items-center text-black">
        {/* 🔹 Logo */}
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-xl md:text-2xl">ICON</h1>
        </div>

        {/* 🔹 Desktop Menu */}
        <div className="hidden md:flex justify-center gap-x-10">
          {mainRoutes.map((route) => {
            const isProtected = route.protected;

            const handleClick = (e: React.MouseEvent) => {
              if (isProtected && !user) {
                e.preventDefault();
                setOpenAuth(true);
              }
            };

            return (
              <Link
                key={route.path}
                href={isProtected && !user ? "#" : route.path}
                onClick={handleClick}
                className="text-black hover:text-purple-600 font-medium transition-all hover:scale-105 text-md"
              >
                {route.name}
              </Link>
            );
          })}
        </div>

        {/* 🔹 Right Side (desktop) */}
        <div className="hidden md:flex items-center gap-x-6">
         
          {user ? (
            <div className="flex items-center gap-2">
              <Badge className="text-white bg-blue-500">Hola {user.name}</Badge>
              <Button
                onClick={logout}
                className="text-xs bg-slate-700 hover:bg-slate-800"
              >
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div
              onClick={() => setOpenAuth(true)}
              className="rounded-full p-1 bg-purple-600 cursor-pointer hover:bg-purple-700 transition-all"
            >
              <img
                src="/icons/mynaui--user.png"
                className="w-8 h-8 p-1"
                alt="user"
              />
            </div>
          )}
        </div>

        {/* 🔹 Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Sheet open={openMenu} onOpenChange={setOpenMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6 text-black" />
              </Button>
            </SheetTrigger>

            {/* 🔹 Drawer content */}
            <SheetContent side="right" className="bg-white px-10">
              <SheetHeader>
                <SheetTitle className="text-lg font-bold">Menú</SheetTitle>
                <SheetDescription>Explora las secciones</SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-6">
                {mainRoutes.map((route) => {
                  const isProtected = route.protected;

                  const handleClick = (e: React.MouseEvent) => {
                    if (isProtected && !user) {
                      e.preventDefault();
                      setOpenAuth(true);
                    }
                    setOpenMenu(false);
                  };

                  return (
                    <Link
                      key={route.path}
                      href={isProtected && !user ? "#" : route.path}
                      onClick={handleClick}
                      className="text-lg text-black font-medium hover:text-purple-600 transition-all"
                    >
                      {route.name}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 border-t pt-4 flex flex-col gap-4 px-10">
                {user ? (
                  <>
                    <p className="text-sm text-gray-600">Hola {user.name}</p>
                    <Button
                      onClick={() => {
                        logout();
                        setOpenMenu(false);
                      }}
                      className="bg-slate-700 hover:bg-slate-800 "
                    >
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setOpenAuth(true);
                      setOpenMenu(false);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 w-full"
                  >
                    Iniciar sesión
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Auth dialog */}
      <AuthDialog open={openAuth} onOpenChange={setOpenAuth} />
    </header>
  );
}
