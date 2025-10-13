"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hook/useAuth";
import { AuthDialog } from "./AuthDialog";
import { appRoutes } from "@/routes/appRoutes";

const mainRoutes = appRoutes[0].children;


export function Header() {
  const { user, logout } = useAuth();
  console.log(user);
  const [openAuth, setOpenAuth] = useState(false);

  return (
    <header className="w-full relative">
      <nav className="w-full p-1 border-b border-[#1E293B] bg-black flex items-center justify-between px-60">
        <span>Contactar a soporte</span>

        <div className="flex items-center gap-x-10">
          <img
            src="/icons/mdi-light--cart.png"
            className="cursor-pointer hover:scale-110 transition-all size-8 p-1"
            alt="cart"
          />

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-200">{user.name}</span>
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
                className="size-8 p-1 object-fill"
                alt="user"
              />
            </div>
          )}
        </div>
      </nav>
      <nav className="w-full p-6 flex items-center justify-between gap-x-8 px-60 bg-black">
        <h1>ICON</h1>
        <div className="flex items-center gap-x-10">
          {
            mainRoutes.map((route) => (
              <a
                href={route.path}
                className="text-slate-300 hover:text-white font-medium transition-all hover:scale-105 text-md"
              >
                {route.name}
              </a>
            ))
          }
          <Button
            className="text-md-5 bg-gradient-to-r from-purple-800 to-[#3B82F6] hover:from-[#3B82F6] hover:to-purple-800 transition-all"
          >
            <span>Comprar Tickets</span>
          </Button>
        </div>
      </nav>

      {/* Aquí montamos el diálogo */}
      <AuthDialog open={openAuth} onOpenChange={setOpenAuth} />
    </header>
  );
}
