"use client";
import React from "react";
import { useAuth } from "@/hook/useAuth";
import Dashboard from "@/pages/admin/dashboard";
import Hero from "./Hero";
import Raffles from "./Raffles";
import Winners from "./Winners";


export function AuthContent() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin"; // correcto si role es string

    console.log(isAdmin);

    // Si es admin, renderiza el dashboard
    if (isAdmin) return <Dashboard />;

    // Si es usuario normal, renderiza la página principal
    return (
        <div className="min-h-screen w-full relative bg-black overflow-hidden">
            <div
                className="absolute inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 20, 147, 0.15), transparent 50%)," +
                        "radial-gradient(ellipse 160% 130% at 10% 10%, rgba(0, 255, 255, 0.12), transparent 60%)," +
                        "radial-gradient(ellipse 160% 130% at 90% 90%, rgba(138, 43, 226, 0.18), transparent 65%)," +
                        "radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%)," +
                        "#000000",
                }}
            ></div>

            <main className="relative z-10">
                <Hero />
                <Raffles />
                <Winners />
            </main>
        </div>
    );
}
