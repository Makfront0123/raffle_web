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
import { usePathname } from "next/navigation";

const mainRoutes = appRoutes[0]?.children || [];

export function Header() {
  const pathName = usePathname();
  const isHome = pathName === "/";
  console.log("isHome:", isHome ?? true);
  const { user, logout } = useAuth();
  const [openAuth, setOpenAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  console.log("user.picture:", user?.picture);

  return (
    <header
      className={`
    w-full sticky top-0 z-50 
    bg-[#0B0B0B]/80 backdrop-blur-xl 
    border-b border-yellow-500/20 shadow-lg
    ${isHome ? "premium-led-border" : ""}
  `}
    >
      <nav className="w-full px-6 py-4 flex justify-between items-center text-white max-w-7xl mx-auto">

        {/* 🔹 Logo */}
        <div className="flex items-center gap-2">
          <h1 className="font-extrabold text-2xl tracking-widest text-yellow-400">
            ICON
          </h1>
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
                prefetch
                onClick={handleClick}
                className="
                  text-gray-300 hover:text-yellow-300 
                  transition-all font-medium relative group
                "
              >
                {route.name}

                {/* Línea dorada debajo */}
                <span
                  className="
                    absolute bottom-0 left-0 w-0 h-[2px] 
                    bg-yellow-400 transition-all group-hover:w-full
                  "
                />
              </Link>
            );
          })}
        </div>

        {/* 🔹 Right Side (desktop) */}
        <div className="hidden md:flex items-center gap-x-6">
          {user ? (
            <div className="flex items-center gap-4">
              <img
                src={user.picture}
                alt="foto de perfil"
                className="w-10 h-10 rounded-full object-cover border border-yellow-400"
              />

              <Badge className="text-black bg-yellow-400 font-semibold">
                Hola {user.name}
              </Badge>

              <Button
                onClick={logout}
                className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-semibold border border-yellow-300"
              >
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div
              onClick={() => setOpenAuth(true)}
              className="
        rounded-full p-[6px] bg-yellow-500 
        cursor-pointer hover:bg-yellow-600 transition-all shadow-lg
      "
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
                <Menu className="w-6 h-6 text-yellow-400" />
              </Button>
            </SheetTrigger>

            {/* Drawer content */}
            <SheetContent
              side="right"
              className="bg-[#0B0B0B] text-white border-l border-yellow-500/20"
            >
              <SheetHeader>
                <SheetTitle className="text-xl font-bold text-yellow-400">
                  Menú
                </SheetTitle>
                <SheetDescription className="text-gray-400">
                  Explora las secciones
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6 mt-8">
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
                      className="
                        text-lg text-gray-300 font-medium 
                        hover:text-yellow-300 transition-all
                      "
                    >
                      {route.name}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-10 border-t border-yellow-500/20 pt-4 flex flex-col gap-4">
                {user ? (
                  <>
                    <img
                      src={user.picture}
                      alt="foto de perfil"
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <p className="text-sm text-gray-400">
                      Hola {user.name}
                    </p>
                    <Button
                      onClick={() => {
                        logout();
                        setOpenMenu(false);
                      }}
                      className="
                        bg-yellow-500 hover:bg-yellow-600 
                        text-black font-semibold
                      "
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
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    Iniciar sesión
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Auth Dialog */}
      <AuthDialog open={openAuth} onOpenChange={setOpenAuth} />
    </header>
  );
}
