import { Prizes } from "@/type/Prizes";
import { useState, useMemo } from "react";

export function usePrizeFilter(prizes: Prizes[]) {
    const [raffleId, setRaffleId] = useState<number | "all">("all");

    const filteredPrizes = useMemo(() => {
        if (raffleId === "all") return prizes;
        return prizes.filter(p => p.raffle?.id === raffleId);
    }, [raffleId, prizes]);

    return {
        raffleId,
        setRaffleId,
        filteredPrizes,
    };
}
