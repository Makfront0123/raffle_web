"use client";
import { useMemo } from "react";

import { Raffle } from "@/type/Raffle";
import { Prizes } from "@/type/Prizes";
import { Payment } from "@/type/Payment";
import { usePayment } from "./usePayment";
import { usePrizes } from "./usePrizes";
import { useRaffles } from "./useRaffles";
import { Winner } from "@/type/Winner";

 
interface DashboardStats {
    stats: { title: string; value: string | number }[];
    lastRaffles: Raffle[];
    loading: boolean;
}
 
export function useDashboardData(): DashboardStats {
    const { raffles, loading: loadingRaffles } = useRaffles();
    const { prizes, loading: loadingPrizes, winners } = usePrizes();
    const { payments, loading: loadingPayments } = usePayment();

    const { stats, lastRaffles } = useMemo(() => {
 
        const safeRaffles: Raffle[] = raffles || [];
        const safePrizes: Prizes[] = prizes || [];
        const safePayments: Payment[] = payments || [];
        const safeWinners: Winner[] = winners || [];
 

        // 🔹 Cálculos principales
        const activeRaffles = safeRaffles.filter((r) => r.status === "active").length;
        const totalPayments = safePayments.reduce(
            (acc, p) => acc + (parseFloat(p.total_amount) || 0),
            0
        );

    
        const totalPrizes = safePrizes.length;
        const totalWinners = safeWinners.length;


        
        const lastRaffles = safeRaffles
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 5);
 
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
