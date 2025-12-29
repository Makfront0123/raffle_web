"use client";
import { useMemo } from "react";
import { Raffle } from "@/type/Raffle";
import { Prizes } from "@/type/Prizes";
import { Payment } from "@/type/Payment";
import { usePrizes } from "./usePrizes";
import { useRaffles } from "./useRaffles";
import { Winner } from "@/type/Winner";
import { useAdminPayments } from "./userAdminPayments";


interface DashboardStats {
    stats: { title: string; value: string | number }[];
    lastRaffles: Raffle[];
    loading: boolean;
}
export function useDashboardData(): DashboardStats {
  const { raffles = [], loading: loadingRaffles } = useRaffles();
  const { prizes = [], loading: loadingPrizes, winners = [] } = usePrizes();
  const { payments = [], loading: loadingPayments } = useAdminPayments();

  const lastRaffles = raffles
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const activeRaffles = raffles.filter(r => r.status === "active").length;
  const totalPayments = payments.reduce(
    (acc, p) => acc + (parseFloat(p.total_amount?.toString() || "0")),
    0
  );
  const totalPrizes = prizes.length;
  const totalWinners = winners.length;

  const stats = [
    { title: "Rifas activas", value: activeRaffles },
    { title: "Pagos recibidos", value: `$${totalPayments.toLocaleString()}` },
    { title: "Premios", value: totalPrizes },
    { title: "Ganadores", value: totalWinners },
  ];

  const loading = loadingRaffles || loadingPrizes || loadingPayments;

  return { stats, lastRaffles, loading };
}
