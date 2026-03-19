"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

import { useAuth } from "@/hook/useAuth";
import { useState } from "react";
import { AuthDialog } from "./AuthDialog";
import { Icon } from "@iconify/react";
export default function Hero() {
  const { user } = useAuth();
  const [openAuth, setOpenAuth] = useState(false);

  const handleProtectedClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      setOpenAuth(true);
    }
  };
  return (
    <section className="relative w-full min-h-[75vh] rounded-lg shadow-lg flex items-center justify-center overflow-hidden">

      <div className="absolute inset-0 bg-[#0B0B0B]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,215,0,0.18), transparent 55%), radial-gradient(circle at 80% 80%, rgba(255,215,0,0.12), transparent 65%)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none bg-[url('/images/gold-grid.svg')] opacity-[0.05]" />


      <div className="relative z-20 max-w-4xl md:mt-2 mt-20 md:mb-2 mb-20  mx-auto px-6 text-center flex flex-col items-center gap-8">


        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight  "
        >
          Gana Premios <span className="text-yellow-400">Increíbles</span>
          <br />
          con Nuestras Rifas Exclusivas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-300 max-w-xl"
        >
          Participa fácilmente, asegura tus tickets y conviértete en el próximo ganador.
        </motion.p>


        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col md:flex-row gap-4 mt-4"
        >
          <Button
            asChild
            className="px-8 py-6 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl shadow-xl transition-all hover:scale-[1.03]"
          >
            <Link href="/raffles" onClick={handleProtectedClick}>
              Ver Rifas Disponibles
            </Link>
          </Button>
          <Button
            variant="outline"
            className="
    px-8 py-6 text-lg font-semibold rounded-xl
    text-yellow-400 border-yellow-400 
    hover:bg-yellow-400 hover:text-black hover:scale-[1.03]
    transition-all
  "
            onClick={() => {
              const section = document.getElementById("winners");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Ver Ganadores
          </Button>

        </motion.div>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-wrap justify-center gap-6 mt-6 text-gray-300 text-sm"
        >
          <div className="flex items-center gap-2">
            <Icon icon="feather:zap" className="text-yellow-400 text-lg" />
            Participa fácil y rápido
          </div>

          <div className="flex items-center gap-2">
            <Icon icon="feather:lock" className="text-yellow-400 text-lg" />
            Pagos seguros
          </div>

          <div className="flex items-center gap-2">
            <Icon icon="feather:bar-chart-2" className="text-yellow-400 text-lg" />
            Resultados transparentes
          </div>
        </motion.div>
      </div>
      <AuthDialog open={openAuth} onOpenChange={setOpenAuth} />
    </section>
  );
}
