"use client";
import React, { useEffect, useState } from "react";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingScreen from "@/components/LoadingScreen";
import { useCountdown } from "@/hook/useCountdown";
import { RaffleCard } from "@/components/RaffleCard";
import { usePrizes } from "@/hook/usePrizes";



export default function Raffles() {
  const {
    filteredRaffles,
    loading,
    error,
    search,
    setSearch,
    filterPrize,
    setFilterPrize,
    sortBy,
    setSortBy,
    tab,
    setTab,
    showExpiredModal,
    setShowExpiredModal,
  } = useFilteredRaffles();

  const { winners, loading: loadingWinners, setActiveRaffleId } = usePrizes();

  const [currentPage, setCurrentPage] = useState(1);
  const rafflesPerPage = 6;

  // Calcular rifas de la página actual
  const totalRaffles = filteredRaffles.length;
  const totalPages = Math.ceil(totalRaffles / rafflesPerPage);
  const startIndex = (currentPage - 1) * rafflesPerPage;
  const endIndex = startIndex + rafflesPerPage;
  const paginatedRaffles = filteredRaffles.slice(startIndex, endIndex);

  // Ajuste modal ganadores
  useEffect(() => {
    if (showExpiredModal?.id) {
      setActiveRaffleId(showExpiredModal.id);
    }
  }, [showExpiredModal, setActiveRaffleId]);

  return (
    <div className="w-full min-h-[120vh] px-10 py-10 flex flex-col md:items-start items-center">
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
      ) : null}

      <h1 className="text-3xl font-bold mb-8 text-black">🎟️ Explora nuestras rifas</h1>

      {/* 🔍 Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar rifa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[250px] bg-purple-600 text-white border-gray-600"
        />

        <Select onValueChange={setFilterPrize} value={filterPrize}>
          <SelectTrigger className="w-[180px] bg-purple-600 text-white border-gray-600">
            <SelectValue placeholder="Tipo de premio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los premios</SelectItem>
            <SelectItem value="cash">Dinero 💵</SelectItem>
            <SelectItem value="product">Producto 🎁</SelectItem>
            <SelectItem value="trip">Viaje ✈️</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger className="w-[180px] bg-purple-600 text-white border-gray-600">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Más recientes</SelectItem>
            <SelectItem value="price">Precio mayor</SelectItem>
            <SelectItem value="endingSoon">Próximas a finalizar</SelectItem>
          </SelectContent>
        </Select>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-purple-600">
            <TabsTrigger value="active">Activas</TabsTrigger>
            <TabsTrigger value="ended">Finalizadas</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 📄 Controles de paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 ml-34">
            <Button
              variant="purple"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              ← Anterior
            </Button>

            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant="purple"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Siguiente →
            </Button>
          </div>
        )}
      </div>

      {/* 🎟️ Lista de rifas paginada */}
      <div className="flex flex-wrap justify-start gap-10 mt-10">
        {paginatedRaffles.length === 0 ? (
          <p className="text-gray-400 mt-10">No se encontraron rifas con esos criterios 😢</p>
        ) : (
          paginatedRaffles.map((raffle) => (
            <RaffleCard raffle={raffle} setShowExpiredModal={setShowExpiredModal} key={raffle.id} />
          ))
        )}
      </div>



      {/* 🏁 Modal de rifas finalizadas */}
      <Dialog open={!!showExpiredModal} onOpenChange={() => setShowExpiredModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rifa finalizada</DialogTitle>
          </DialogHeader>

          <p>
            La rifa <strong>{showExpiredModal?.title}</strong> ha terminado 🎉
          </p>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">🏆 Ganadores</h3>

            {loadingWinners ? (
              <p className="text-gray-500">Cargando ganadores...</p>
            ) : winners.length === 0 ? (
              <p className="text-gray-500">Aún no hay ganadores para esta rifa.</p>
            ) : (
              winners
                .filter((w) => w.raffle_id === showExpiredModal?.id)
                .map((w) => (
                  <div key={w.id} className="p-3 mb-2 border rounded-lg shadow-sm bg-gray-50">
                    <p className="font-medium">{w.prize_name}</p>
                    <p>🎟️ Ticket ganador: {w.winner_ticket}</p>
                    <p>👤 {w.winner_user ?? "Usuario desconocido"}</p>
                    <p>💰 Valor: ${w.value}</p>
                  </div>
                ))
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => setShowExpiredModal(null)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
