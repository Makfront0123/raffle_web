"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export default function AdminOnlyScreen() {
    const router = useRouter();

    useEffect(() => {
        const t = setTimeout(() => {
            router.replace("/");
        }, 2000);

        return () => clearTimeout(t);
    }, [router]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
            <div className="text-center px-6">
                <ShieldAlert className="mx-auto mb-6 h-14 w-14 text-yellow-500" />
                <h1 className="text-3xl font-bold text-yellow-500 mb-4">
                    Acceso restringido
                </h1>
                <p className="text-zinc-300 mb-6">
                    Esta sección es solo para administradores.
                </p>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 animate-pulse rounded-full" />
                <p className="text-sm text-zinc-500 mt-4">
                    Redirigiendo…
                </p>
            </div>
        </div>
    );
}

