"use client";

import { usePrizeStore } from "@/store/prizeStore";
import { AuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { PrizeForm, Prizes } from "@/type/Prizes";

export function usePrizes() {
    const { prizes, getPrizes, addPrize, updatePrize } = usePrizeStore();
    const { token } = AuthStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrizes = async () => {
            try {
                if (!token) return;
                await getPrizes(token);
            } catch (err) {
                console.error(err);
                setError("Error cargando premios");
            } finally {
                setLoading(false);
            }
        };
        fetchPrizes();
    }, [getPrizes, token]);

    const createPrize = async (newPrize: PrizeForm) => {
        try {
            if (!token) throw new Error("No hay token disponible");

            const payload = {
                name: newPrize.name,
                description: newPrize.description,
                value: newPrize.value,
                type: newPrize.type ?? "product",
                raffleId: Number(newPrize.raffle),
                providerId: Number(newPrize.provider),
            };

            await addPrize(payload, token); // <- este payload se ajusta a tu API
        } catch (err) {
            console.error(err);
            setError("Error creando premio");
        }
    };

    const editPrize = async (id: number, updatedPrize: Prizes) => {
        try {
            if (!token) throw new Error("No hay token disponible");
            await updatePrize(id, updatedPrize, token);
        } catch (err) {
            console.error(err);
            setError("Error actualizando premio");
        }
    };

    return { prizes, loading, error, createPrize, editPrize };
}
