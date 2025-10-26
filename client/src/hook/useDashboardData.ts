"use client";
import { useMemo } from "react";

import { Raffle } from "@/type/Raffle";
import { Prizes } from "@/type/Prizes";
import { Payment } from "@/type/Payment";
import { usePayment } from "./usePayment";
import { usePrizes } from "./usePrizes";
import { useRaffles } from "./useRaffles";

// 🔹 Definimos un tipo de salida
interface DashboardStats {
    stats: { title: string; value: string | number }[];
    lastRaffles: Raffle[];
    loading: boolean;
}

/**
 * Hook para calcular las métricas principales del dashboard
 */
export function useDashboardData(): DashboardStats {
    const { raffles, loading: loadingRaffles } = useRaffles();
    const { prizes, loading: loadingPrizes } = usePrizes();
    const { payments, loading: loadingPayments } = usePayment();

    const { stats, lastRaffles } = useMemo(() => {
        // 🔹 Aseguramos que los arrays existan
        const safeRaffles: Raffle[] = raffles || [];
        const safePrizes: Prizes[] = prizes || [];
        const safePayments: Payment[] = payments || [];

        // 🔹 Cálculos principales
        const activeRaffles = safeRaffles.filter((r) => r.status === "active").length;
        const totalPayments = safePayments.reduce((acc, p) => acc + (p.paymentDetails?.payment.amount || 0), 0);
        const totalPrizes = safePrizes.length;
        const totalWinners = safePrizes.filter((p) => (p as any).winner_ticket).length;

        // 🔹 Últimas rifas
        const lastRaffles = safeRaffles
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 5);

        // 🔹 Formateamos datos para las tarjetas
        const stats = [
            { title: "Rifas activas", value: activeRaffles },
            { title: "Pagos recibidos", value: `$${totalPayments.toLocaleString()}` },
            { title: "Premios", value: totalPrizes },
            { title: "Ganadores", value: totalWinners },
        ];

        return { stats, lastRaffles };
    }, [raffles, prizes, payments]);

    const loading = loadingRaffles || loadingPrizes || loadingPayments;

    return { stats, lastRaffles, loading };
}
