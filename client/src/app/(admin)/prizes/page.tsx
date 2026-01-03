"use client";

import { useRaffles } from "@/hook/useRaffles";
import { useProviders } from "@/hook/useProviders";
import { usePrizes } from "@/hook/usePrizes";
import { AuthStore } from "@/store/authStore";

import { PrizesTable } from "@/components/PrizeTable";
import { PrizeForm } from "@/components/admin/prizes/PrizeForm";
import { usePrizeFilter } from "@/hook/usePrizeFilter";
import { usePagination } from "@/hook/usePagination";

export default function PrizesPage() {
  const { raffles, loading: loadingRaffles } = useRaffles();
  const { providers, loading: loadingProviders } = useProviders();
  const { prizes, createPrize, editPrize, deletePrize } = usePrizes();

  const { filteredPrizes, raffleId, setRaffleId } = usePrizeFilter(prizes);

  const {
    page,
    totalPages,
    nextPage,
    prevPage,
    items: paginatedItems,
  } = usePagination(filteredPrizes, 5);

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

      <PrizesTable
        prizes={paginatedItems}
        raffles={raffles}
        selectedRaffle={raffleId}
        onRaffleChange={setRaffleId}
        page={page}
        totalPages={totalPages}
        onPrevPage={prevPage}
        onNextPage={nextPage}
        onUpdate={editPrize}
        onDelete={deletePrize}
      />
    </main>
  );
}
