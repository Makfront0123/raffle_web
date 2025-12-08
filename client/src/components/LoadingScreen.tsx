"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center 
      bg-[#0B0B0B]">
      
      {/* Brillo dorado sutil */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.15), transparent 70%)",
        }}
      />

      {/* Spinner dorado */}
      <motion.div
        className="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      {/* Texto cargando */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-16 text-yellow-400 text-lg font-semibold tracking-wide"
      >
        Cargando...
      </motion.p>
    </div>
  );
}
