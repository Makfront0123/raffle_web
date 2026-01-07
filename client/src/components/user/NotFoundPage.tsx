"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4">
            <motion.h1
                className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 drop-shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                404
            </motion.h1>

            <motion.p
                className="mt-6 text-xl md:text-2xl font-semibold text-yellow-200 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
                Página no encontrada
            </motion.p>

            <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
            >
                <Link
                    href="/"
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold shadow-lg hover:scale-105 hover:from-yellow-400 hover:to-yellow-500 transition-transform duration-300"
                >
                    Volver al inicio
                </Link>
            </motion.div>

            <div className="absolute inset-0 pointer-events-none">
                <div className="w-1 h-1 bg-yellow-400 rounded-full absolute animate-float" style={{ top: '20%', left: '10%' }} />
                <div className="w-1 h-1 bg-yellow-500 rounded-full absolute animate-float-slow" style={{ top: '70%', left: '80%' }} />
                <div className="w-1 h-1 bg-yellow-300 rounded-full absolute animate-float" style={{ top: '40%', left: '50%' }} />
            </div>
        </div>
    );
}
