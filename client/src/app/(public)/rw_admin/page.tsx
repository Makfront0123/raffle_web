"use client";

import React, { useState } from "react";
import { useForm } from "@/hook/useForm";
import { useAuth } from "@/hook/useAuth";
import { motion } from "framer-motion";
import AdminSplashScreen from "@/components/admin/AdminSplashScreen";
import { useAdminSplash } from "@/hook/useAdminSplash";
import { usePathname } from "next/dist/client/components/navigation";
import AdminDeniedScreen from "@/components/admin/AdminDeniedScreen";

interface AdminLoginForm {
    email: string;
    password: string;
}

const initialLoginForm: AdminLoginForm = {
    email: "",
    password: "",
};

const tabVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
};

const AdminAuthPage = () => {
    const { loginAdmin } = useAuth();
    const { showSplash, user } = useAdminSplash();
    const [error, setError] = useState("");
    const path = usePathname();
    const { form: loginForm, handleChange, getValidatedPayload } =
        useForm<AdminLoginForm>(initialLoginForm, (values) => {
            if (!values.email) throw new Error("Ingresa tu email");
            if (!values.password) throw new Error("Ingresa tu contraseña");
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const { email, password } = getValidatedPayload();
        await loginAdmin(email, password);
    };

    if (showSplash && user) return <AdminSplashScreen name={user.name} />;
    if (path.startsWith("/rw_admin") &&
        user) return <AdminDeniedScreen />;

    return (
        <div className="min-h-screen w-full bg-[#0B0B0B] flex items-center justify-center text-white relative flex-col">
            <div
                className="absolute inset-0 z-0 opacity-60"
                style={{
                    background:
                        "radial-gradient(circle at 20% 20%, rgba(255,215,0,0.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(255,215,0,0.1), transparent 70%)",
                }}
            />
            <div className="bg-[#1A1A1A]/80 border border-yellow-500 rounded-2xl shadow-lg w-full max-w-md p-10 backdrop-blur-sm relative z-10">
                <div className="text-center mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400">
                        Panel de Administración
                    </h1>
                    <p className="text-yellow-200 text-sm mt-1">
                        Inicia sesión para gestionar rifas, premios y pagos
                    </p>
                </div>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <motion.form
                    onSubmit={handleSubmit}
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                >
                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-yellow-300">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={loginForm.email}
                            onChange={handleChange}
                            placeholder="Ingresa tu email"
                            className="w-full px-4 py-2 rounded-md bg-[#0B0B0B] border border-yellow-400 text-white placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-1 font-medium text-yellow-300">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={loginForm.password}
                            onChange={handleChange}
                            placeholder="********"
                            className="w-full px-4 py-2 rounded-md bg-[#0B0B0B] border border-yellow-400 text-white placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-md transition"
                    >
                        Iniciar sesión
                    </button>
                </motion.form>
            </div>
        </div>
    );
};

export default AdminAuthPage;
