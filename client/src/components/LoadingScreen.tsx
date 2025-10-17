"use client";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
      {/* Animación del logo o círculo */}
      <motion.div
        className="w-12 h-12 border-4 border-t-transparent border-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <motion.p
        className="mt-4 text-sm tracking-wider text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      >
        Cargando...
      </motion.p>
    </div>
  );
}
