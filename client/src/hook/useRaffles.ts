"use client";

import { handleApiError } from "@/helper/handleApiError";
import { useRaffleStore } from "@/store/raffleStore";
import { CreateRaffleDTO, Raffle, UpdateRafflePayload } from "@/type/Raffle";
import { RaffleStatusFilter } from "@/type/RaffleTableProps";
import { isAxiosError } from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

export function useRaffles() {
  const {
    raffles,
    getRaffles,
    addRaffle,
    deleteRaffle,
    regenerateTickets,
    activateRaffle,
    updateRaffle,
    deactivateRaffle
  } = useRaffleStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<RaffleStatusFilter>("all");

  const filteredRaffles = useMemo(() => {
    if (statusFilter === "all") return raffles;
    return raffles.filter(r => r.status === statusFilter);
  }, [raffles, statusFilter]);

  const rafflesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredRaffles.length / rafflesPerPage);

  const paginatedRaffles = useMemo(() => {
    const start = (currentPage - 1) * rafflesPerPage;
    return filteredRaffles.slice(start, start + rafflesPerPage);
  }, [filteredRaffles, currentPage]);


  const refreshRaffles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await getRaffles();
    } catch (err) {
      handleApiError(err, "Error cargando rifas");
      setError("Error cargando rifas");
    } finally {
      setLoading(false);
    }
  }, [getRaffles]);

  useEffect(() => {
    refreshRaffles();
  }, [refreshRaffles]);

  const createRaffle = useCallback(
    async (form: {
      title: string;
      description: string;
      price: string;
      end_date: string;
      digits: number;
    }) => {
      try {
        if (!form.end_date) throw new Error("Selecciona una fecha.");

        const min = new Date();
        min.setDate(min.getDate() + 7);

        const endDate = new Date(form.end_date + "T23:59:59");
        if (endDate < min) throw new Error("Debe ser mínimo 7 días después.");

        const price = parseFloat(form.price);
        if (isNaN(price) || price <= 0) throw new Error("Precio inválido");

        const payload: CreateRaffleDTO = {
          title: form.title,
          description: form.description,
          price,
          endDate: endDate.toISOString(),
          digits: form.digits,
        };

        await addRaffle(payload);
        await getRaffles();

        toast.success("Rifa creada correctamente");

      } catch (err: unknown) {
        if (err instanceof Error && !isAxiosError(err)) {
          toast.error(err.message);
          return;
        }
        if (isAxiosError(err)) {
          handleApiError(err, "Error creando rifa");
          return;
        }
        toast.error("Error inesperado");
      }
    },
    [addRaffle, getRaffles]
  );

  const handleDeleteRaffle = useCallback(
    async (id: number) => {
      try {
        const success = await deleteRaffle(id);

        if (success) {
          await refreshRaffles();
          toast.success("Rifa eliminada correctamente");
        }

      } catch (err) {
        handleApiError(err, "Error eliminando rifa");
      }
    },
    [deleteRaffle, refreshRaffles]
  );
  const handleUpdateRaffle = useCallback(
    async (id: number, data: Partial<Raffle>) => {
      try {
        const payload: UpdateRafflePayload = {};

        if (typeof data.price !== "undefined") payload.price = data.price;

        if (typeof data.end_date !== "undefined" && data.end_date) {
          payload.endDate =
            data.end_date.length === 10
              ? new Date(data.end_date + "T23:59:59").toISOString()
              : data.end_date;
        }

        if (data.title) payload.title = data.title;
        if (data.description) payload.description = data.description;

        await updateRaffle(id, payload);
        await refreshRaffles();

        toast.success("Rifa actualizada correctamente");

      } catch (err) {
        handleApiError(err, "Error actualizando rifa");
      }
    },
    [updateRaffle, refreshRaffles]
  );
  const handleActivateRaffle = useCallback(
    async (id: number) => {
      try {
        await activateRaffle(id);
        await refreshRaffles();
        toast.success("Rifa activada");
      } catch (err) {
        handleApiError(err, "Error activando rifa");
      }
    },
    [activateRaffle, refreshRaffles]
  );

  const handleDeactivateRaffle = useCallback(
    async (id: number) => {
      try {
        await deactivateRaffle(id);
        await refreshRaffles();
        toast.success("Rifa desactivada");
      } catch (err) {
        handleApiError(err, "Error desactivando rifa");
      }
    },
    [deactivateRaffle, refreshRaffles]
  );

  const handleRegenerateTickets = useCallback(
    async (id: number, newDigits: number) => {
      try {
        await regenerateTickets(id, newDigits);
        await refreshRaffles();
        toast.success("Tickets regenerados");
      } catch (err) {
        handleApiError(err, "Error regenerando tickets");
      }
    },
    [regenerateTickets, refreshRaffles]
  );
  return {
    raffles,
    loading,
    error,
    refreshRaffles,
    createRaffle,
    deleteRaffle: handleDeleteRaffle,
    updateRaffle: handleUpdateRaffle,
    regenerateTickets: handleRegenerateTickets,
    deactivateRaffle: handleDeactivateRaffle,
    activateRaffle: handleActivateRaffle,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedRaffles,
  };
}
