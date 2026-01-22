"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

interface Props {
    redirectTo?: string;
    delay?: number;
}

export default function AdminAccessDeniedScreen({
    redirectTo = "/dashboard",
    delay = 500,
}: Props) {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace(redirectTo);
        }, delay);

        return () => clearTimeout(timer);
    }, [router, redirectTo, delay]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
            <div className="text-center max-w-md px-6">
                <div className="flex justify-center mb-6">
                    <ShieldAlert className="w-14 h-14 text-yellow-500" />
                </div>

                <h1 className="text-3xl font-bold text-yellow-500 mb-4">
                    Acceso restringido
                </h1>

                <p className="text-zinc-300 mb-6 leading-relaxed">
                    Esta sección está disponible únicamente para usuarios finales.
                    <br />
                    Estás siendo redirigido al panel de administración.
                </p>

                <div className="flex justify-center">
                    <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-full animate-pulse" />
                </div>

                <p className="text-sm text-zinc-500 mt-4">
                    Redirigiendo al dashboard…
                </p>
            </div>
        </div>
    );
}
