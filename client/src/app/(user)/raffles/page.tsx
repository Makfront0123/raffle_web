"use client";
import React from "react";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingScreen from "@/components/LoadingScreen";

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

  return (
    <div className="w-full min-h-[120vh] px-10 py-10 flex flex-col items-start">
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
      ) : null}

      <h1 className="text-3xl font-bold text-white mb-8">🎟️ Explora nuestras rifas</h1>

      {/* 🔍 Controles de filtro */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar rifa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[250px] bg-gray-800 text-white border-gray-600"
        />

        <Select onValueChange={setFilterPrize} value={filterPrize}>
          <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-600">
            <SelectValue placeholder="Tipo de premio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los premios</SelectItem>
            <SelectItem value="dinero">Dinero 💵</SelectItem>
            <SelectItem value="producto">Producto 🎁</SelectItem>
            <SelectItem value="viaje">Viaje ✈️</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-600">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Más recientes</SelectItem>
            <SelectItem value="price">Precio mayor</SelectItem>
            <SelectItem value="endingSoon">Próximas a finalizar</SelectItem>
          </SelectContent>
        </Select>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-gray-800">
            <TabsTrigger value="active">Activas</TabsTrigger>
            <TabsTrigger value="expired">Finalizadas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 🎟️ Lista de rifas */}
      <div className="flex flex-wrap justify-center gap-10">
        {filteredRaffles.length === 0 ? (
          <p className="text-gray-400 mt-10">No se encontraron rifas con esos criterios 😢</p>
        ) : (
          filteredRaffles.map((raffle) => {
            const isExpired = new Date(raffle.end_date) <= new Date();
            return (
              <Card
                key={raffle.id}
                className={`p-5 w-[280px] ${isExpired ? "opacity-50 border-gray-600" : "hover:scale-105 transition-transform"
                  }`}
              >
                <CardHeader>
                  <span className="text-xl font-semibold text-white">{raffle.title}</span>
                  <p className="text-sm text-gray-400">${raffle.price}</p>
                  <p className="text-sm text-gray-400">{raffle.total_numbers} tickets</p>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-300 mb-4">{raffle.description}</p>

                  {raffle.prizes?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-400 font-semibold">Premios:</p>
                      <ul className="list-disc list-inside text-gray-300 text-sm">
                        {raffle.prizes.map((prize) => (
                          <li key={prize.id}>
                            {prize.name} - ${prize.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {isExpired ? (
                    <Button
                      variant="destructive"
                      onClick={() => setShowExpiredModal(raffle)}
                    >
                      Rifa finalizada
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href={`/raffles/${raffle.id}`}>Participar</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal finalizadas */}
      <Dialog open={!!showExpiredModal} onOpenChange={() => setShowExpiredModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rifa finalizada</DialogTitle>
          </DialogHeader>
          <p>
            La rifa <strong>{showExpiredModal?.title}</strong> ha terminado 🎉.
            ¡Vuelve pronto para participar en nuevas rifas!
          </p>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowExpiredModal(null)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
