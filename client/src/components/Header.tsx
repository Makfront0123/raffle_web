"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/routes/AppRoutes";

import { AuthDialog } from "./AuthDialog";
import { AuthStore } from "@/store/authStore";


const mainRoutes = appRoutes[0]?.children || [];


export function Header() {
  const { user, logout } = AuthStore();
  const [openAuth, setOpenAuth] = useState(false);

  return (
    <header className="w-full relative">
      {/* Top bar */}
      <nav className="w-full p-1 border-b text-white border-[#1E293B] flex items-center justify-between px-30">
        <span>Contactar a soporte</span>

        <div className="flex items-center gap-x-10">
          <img
            src="/icons/mdi--light--cart.png"
            className="cursor-pointer hover:scale-110 transition-all w-8 h-8 p-1"
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
                className="w-8 h-8 p-1 object-fill"
                alt="user"
              />
            </div>
          )}
        </div>
      </nav>

      {/* Main navigation */}
      <nav className="w-full p-6 flex items-center justify-between gap-x-8 px-30 text-white">
        <h1>ICON</h1>
        <div className="flex items-center gap-x-10">
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
                className="text-slate-300 hover:text-white font-medium transition-all hover:scale-105 text-md"
              >
                {route.name}
              </Link>
            );
          })}

          <Button className="text-md-5 bg-gradient-to-r from-purple-800 to-[#3B82F6] hover:from-[#3B82F6] hover:to-purple-800 transition-all">
            <span>Comprar Tickets</span>
          </Button>
        </div>
      </nav>

      {/* Auth dialog */}
      <AuthDialog open={openAuth} onOpenChange={setOpenAuth} />
    </header>
  );
}
