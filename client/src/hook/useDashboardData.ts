"use client";
import { useEffect, useState } from "react";
import { useRaffleStore } from "@/store/raffleStore";
import { Raffle } from "@/type/Raffle";

export function useDashboardData(): {
  stats: { title: string; value: string | number }[];
  lastRaffles: Raffle[];
  revenueData: { date: string; revenue: number }[];
  raffleStatusData: { name: string; value: number }[];
  loading: boolean;
} {
  const { dashboardData, getDashboardData } = useRaffleStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        await getDashboardData();
      } catch (err) {
        console.error("Error cargando dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getDashboardData]);

  if (!dashboardData) {
    return {
      stats: [],
      lastRaffles: [],
      revenueData: [],
      raffleStatusData: [],
      loading,
    };
  }

  const stats = [
    { title: "Rifas activas", value: dashboardData.stats.activeRaffles },
    { title: "Pagos recibidos", value: `$${dashboardData.stats.totalRevenue.toLocaleString()}` },
    { title: "Premios", value: dashboardData.stats.totalPrizes },
    { title: "Ganadores", value: dashboardData.stats.totalWinners },
  ];

  const revenueData = dashboardData.revenueData.map(r => ({
    date: new Date(r.date).toLocaleDateString(),
    revenue: r.total,
  }));

  const raffleStatusData = ["pending", "active", "ended"].map(status => {
    const count = dashboardData.lastRaffles.filter(r => r.status === status).length;
    return { name: status, value: count };
  });

  return {
    stats,
    lastRaffles: dashboardData.lastRaffles,
    revenueData,
    raffleStatusData,
    loading,
  };
}
/*

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

*/