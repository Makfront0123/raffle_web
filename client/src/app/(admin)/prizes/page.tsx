"use client";

import { useRaffles } from "@/hook/useRaffles";
import { useProviders } from "@/hook/useProviders";
import { usePrizes } from "@/hook/usePrizes";
import { AuthStore } from "@/store/authStore";

import { PrizesTable } from "@/components/PrizeTable";
import { PrizeForm } from "@/components/admin/prizes/PrizeForm";

export default function PrizesPage() {
  const { token } = AuthStore();

  const { raffles, loading: loadingRaffles } = useRaffles();
  const { providers, loading: loadingProviders } = useProviders(token || "");
  const { prizes, createPrize } = usePrizes();

  return (
    <main className="p-6 bg-gray-50 flex-1">
      <h1 className="text-3xl font-bold mb-6">Premios</h1>

      <PrizeForm
        raffles={raffles}
        providers={providers}
        loadingRaffles={loadingRaffles}
        loadingProviders={loadingProviders}
        onSubmit={createPrize}
      />

      <PrizesTable prizes={prizes} />
    </main>
  );
}
