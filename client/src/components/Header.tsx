"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/routes/AppRoutes";
import { AuthDialog } from "./AuthDialog";
import { useAuth } from "@/hook/useAuth";
import { Badge } from "./ui/badge";


const mainRoutes = appRoutes[0]?.children || [];

export function Header() {
  const { user, logout } = useAuth();
  const [openAuth, setOpenAuth] = useState(false);


  return (
    <header className="w-full relative">


      <nav className="w-full animate-bottom-fade-in p-6 grid grid-cols-3 px-30 items-center text-white">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-black font-bold text-xl">ICON</h1>
        </div>

        {/* Center menu */}
        <div className="flex justify-center gap-x-10">
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

        {/* Right side – cart + auth */}
        <div className="flex items-center gap-x-6 justify-end">
          <img
            src="/icons/mdi--light--cart.png"
            className="cursor-pointer hover:scale-110 transition-all w-8 h-8 p-1"
            alt="cart"
          />

          {user ? (
            <div className="flex items-center gap-2">
              <Badge className="text-white bg-blue-500">
                Hola {user.name}
              </Badge>
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
      </nav>

      {/* Auth dialog */}
      <AuthDialog open={openAuth} onOpenChange={setOpenAuth} />
    </header>
  );
}


