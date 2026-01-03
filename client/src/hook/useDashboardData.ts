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
  revenueData: { date: string; revenue: number }[];
  raffleStatusData: { name: string; value: number }[];
  loading: boolean;
}

export function useDashboardData(): DashboardStats {
  const { raffles, loading: loadingRaffles } = useRaffles();
  const { prizes, loading: loadingPrizes, winners } = usePrizes();
  const { payments, loading: loadingPayments } = useAdminPayments();

  const { stats, lastRaffles, revenueData, raffleStatusData } = useMemo(() => {
    const safeRaffles: Raffle[] = raffles || [];
    const safePrizes: Prizes[] = prizes || [];
    const safePayments: Payment[] = payments || [];
    const safeWinners: Winner[] = winners || [];

    const activeRaffles = safeRaffles.filter((r) => r.status === "active").length;
    const totalPayments = safePayments.reduce(
      (acc, p) => acc + (parseFloat(p.total_amount.toString()) || 0),
      0
    );
    const totalPrizes = safePrizes.length;
    const totalWinners = safeWinners.length;

    const lastRaffles = safeRaffles
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    const revenueMap: Record<string, number> = {};
    safePayments.forEach((p) => {
      const date = new Date(p.created_at).toLocaleDateString();
      revenueMap[date] = (revenueMap[date] || 0) + parseFloat(p.total_amount.toString());
    });
    const revenueData = Object.entries(revenueMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const raffleStatusCounts: Record<string, number> = {};
    safeRaffles.forEach((r) => {
      raffleStatusCounts[r.status] = (raffleStatusCounts[r.status] || 0) + 1;
    });
    const raffleStatusData = Object.entries(raffleStatusCounts).map(([name, value]) => ({ name, value }));

    const stats = [
      { title: "Rifas activas", value: activeRaffles },
      { title: "Pagos recibidos", value: `$${totalPayments.toLocaleString()}` },
      { title: "Premios", value: totalPrizes },
      { title: "Ganadores", value: totalWinners },
    ];

    return { stats, lastRaffles, revenueData, raffleStatusData };
  }, [raffles, prizes, payments, winners]);

  const loading = loadingRaffles || loadingPrizes || loadingPayments;

  return { stats, lastRaffles, revenueData, raffleStatusData, loading };
}
