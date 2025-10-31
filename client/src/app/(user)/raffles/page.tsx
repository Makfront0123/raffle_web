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
import { useCountdown } from "@/hook/useCountdown";
import { RaffleCard } from "@/components/RaffleCard";

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
            <SelectItem value="cash">Dinero 💵</SelectItem>
            <SelectItem value="product">Producto 🎁</SelectItem>
            <SelectItem value="trip">Viaje ✈️</SelectItem>
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


            return (
              <RaffleCard raffle={raffle} setShowExpiredModal={setShowExpiredModal} key={raffle.id} />
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
