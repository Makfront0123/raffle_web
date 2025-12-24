"use client";

import { motion } from "framer-motion";

export default function AdminSplashScreen({ name }: { name?: string }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0B0B]">
      {/* glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,215,0,0.25), transparent 65%)",
        }}
      />

      {/* logo / title */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-5xl font-extrabold tracking-widest text-yellow-400 drop-shadow-lg">
          ICON
        </h1>
        <p className="mt-2 text-sm tracking-[0.3em] text-yellow-300/70">
          ADMIN PANEL
        </p>
      </motion.div>

      {/* welcome */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-xl text-yellow-300 font-semibold"
      >
        Bienvenido{name ? `, ${name}` : ""}
      </motion.p>

      {/* loading ring */}
      <motion.div
        className="mt-12 w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}
