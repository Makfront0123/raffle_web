"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { appRoutes } from "@/routes/AppRoutes";
import { AuthDialog } from "./AuthDialog";
import { PhoneDialog } from "./PhoneDialog";
import { useAuth } from "@/hook/useAuth";

const mainRoutes = appRoutes[0]?.children || [];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { user, logout } =
    useAuth();

  const [openAuth, setOpenAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header
      className={`
    w-full sticky top-0 z-50
    bg-[#0B0B0B]/80 backdrop-blur-xl
    border-b border-yellow-500/20 shadow-lg
    ${isHome ? "premium-led-border" : ""}
  `}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-extrabold text-2xl tracking-[0.3em] text-yellow-400">
            ICON
          </span>
          <span className="text-[10px] text-gray-400 tracking-widest">
            RIFAS PREMIUM
          </span>
        </Link>


        <div className="hidden md:flex items-center gap-x-10">
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
                className="
                  relative text-gray-300 font-medium tracking-wide
                  transition-all duration-300
                  hover:text-yellow-300
                  after:absolute after:left-1/2 after:-bottom-1
                  after:h-[2px] after:w-0 after:bg-yellow-400
                  after:transition-all after:duration-300
                  after:-translate-x-1/2
                  hover:after:w-full
                "
              >
                {route.name}
              </Link>
            );
          })}
        </div>


        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <Image
                src={user.picture || "/icons/mynaui--user.png"}
                alt="avatar"
                width={40}
                height={40}
                className="
                  rounded-full object-cover
                  border border-yellow-400/40
                  hover:shadow-[0_0_15px_rgba(255,215,0,0.4)]
                  transition-all
                "
              />

              <Badge
                className="
                  bg-gradient-to-r from-yellow-400 to-yellow-500
                  text-black font-semibold
                  px-3 py-1
                  shadow-md
                "
              >
                Hola {user.name}
              </Badge>

              <Button
                variant="outline"
                onClick={logout}
                className="
                  border-yellow-400/40
                  text-yellow-400
                  hover:bg-yellow-400 hover:text-black
                  transition-all
                  text-xs
                "
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <button
              onClick={() => setOpenAuth(true)}
              className="
                rounded-full p-2
                bg-yellow-500
                hover:bg-yellow-600
                transition-all
                shadow-lg
              "
            >
              <Image
                src="/icons/mynaui--user.png"
                alt="user"
                width={28}
                height={28}
              />
            </button>
          )}
        </div>
        <div className="md:hidden">
          <Sheet open={openMenu} onOpenChange={setOpenMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6 text-yellow-400" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="
                bg-[#0B0B0B]
                border-l border-yellow-500/10
                shadow-2xl
                text-white
              "
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
                        text-lg tracking-wide text-gray-300
                        hover:text-yellow-400 transition-all
                      "
                    >
                      {route.name}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-10 pt-6 border-t border-yellow-500/10 flex flex-col gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.picture || "/icons/mynaui--user.png"}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-300">
                        Hola {user.name}
                      </span>
                    </div>

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
                    className="
                      bg-yellow-500 hover:bg-yellow-600
                      text-black font-semibold
                    "
                  >
                    Iniciar sesión
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>


      <AuthDialog open={openAuth} onOpenChange={setOpenAuth} />
    </header>
  );
}
