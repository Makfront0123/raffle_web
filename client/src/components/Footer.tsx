"use client";

import { Facebook, Instagram, Twitter, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/10 bg-gradient-to-br from-[#9810fa] via-[#6a00f5] to-[#3b007c] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#ffffff22,transparent_60%)] animate-pulse" />
      <div className="relative container mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-10 z-10">

        <div className="flex flex-col items-start gap-4 max-w-xs">
          <h2 className="text-3xl font-bold tracking-tight">RIFA</h2>
          <p className="text-sm text-gray-200">
            Participa, gana y disfruta con nuestros sorteos digitales.
            Simple, seguro y divertido.
          </p>
        </div>


        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-white mb-2">Enlaces</h3>
            <a href="#" className="text-sm text-gray-200 hover:text-white transition-colors">Inicio</a>
            <a href="#" className="text-sm text-gray-200 hover:text-white transition-colors">Sorteos</a>
            <a href="#" className="text-sm text-gray-200 hover:text-white transition-colors">Contacto</a>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-white mb-2">Legal</h3>
            <a href="#" className="text-sm text-gray-200 hover:text-white transition-colors">Términos</a>
            <a href="#" className="text-sm text-gray-200 hover:text-white transition-colors">Privacidad</a>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-white mb-2">Soporte</h3>
            <a href="#" className="text-sm text-gray-200 hover:text-white transition-colors">Ayuda</a>
            <a href="#" className="text-sm text-gray-200 hover:text-white transition-colors">Preguntas</a>
          </div>
        </div>


        <div className="flex flex-col items-start gap-4">
          <h3 className="font-semibold text-white mb-2">Síguenos</h3>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 transition">
              <Facebook className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 transition">
              <Instagram className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 transition">
              <Twitter className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 transition">
              <Github className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>


      <div className="border-t border-white/10 mt-8 py-6 text-center text-sm text-gray-300 z-10 relative">
        © {new Date().getFullYear()} RIFA — Todos los derechos reservados.
      </div>
    </footer>
  );
}
