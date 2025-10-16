"use client";
import { useRaffleStore } from "@/store/raffleStore";
import { useEffect, useState } from "react";


export function useRaffles() {
    const { raffles, getRaffles } = useRaffleStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRaffles = async () => {
            try {
                await getRaffles();
            } catch (err) {
                setError("Error cargando rifas");
            } finally {
                setLoading(false);
            }
        };
        fetchRaffles();
    }, [getRaffles]);

    return { raffles, loading, error };
}