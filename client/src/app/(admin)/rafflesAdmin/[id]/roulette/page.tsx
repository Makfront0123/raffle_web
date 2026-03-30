"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Wheel } from "react-custom-roulette";

import { Button } from "@/components/ui/button";
import { usePrizes } from "@/hook/usePrizes";
import { useRaffles } from "@/hook/useRaffles";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Winner } from "@/type/Winner";

const RaffleRoulettePage = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const raffleId = Number(id);

    const { winners } = usePrizes();
    const { raffles } = useRaffles();

    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [winner, setWinner] = useState<Winner | null>(null);
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const raffle = raffles.find(r => r.id === raffleId);

    const raffleWinners = winners
        .filter(w => w.raffle_id === raffleId)
        .sort((a, b) => a.prize_id - b.prize_id);

    const isFinished = raffleWinners.length > 0;


    const wheelData = raffleWinners.map((w, index) => ({
        option: w.winner_user?.name || `Ticket ${w.winner_ticket}`,
        style: {
            backgroundColor: index % 2 === 0 ? "#6366F1" : "#22C55E",
            textColor: "#ffffff",
        },
    }));

    const getWinnerByIndex = (index: number) => raffleWinners[index];

    const handleSpin = () => {
        if (isFinished || !wheelData.length) return;

        setPrizeNumber(currentIndex);
        setMustSpin(true);
    };

    if (!raffle) {
        return <div className="p-10 text-center">Rifa no encontrada</div>;
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center -mt-18 gap-6 bg-gray-100">
            <h1 className="text-2xl font-bold">{raffle.title}</h1>
            {!isFinished ? (
                <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={wheelData.length ? wheelData : [{ option: "Sin datos" }]}
                    backgroundColors={["#3e3e3e", "#df3428"]}
                    textColors={["#ffffff"]}
                    onStopSpinning={() => {
                        setMustSpin(false);

                        const realWinner = getWinnerByIndex(prizeNumber);

                        setWinner(realWinner);
                        setOpen(true);

                        setCurrentIndex(prev => prev + 1);
                    }}
                />
            ) : (
                <div className="text-center text-lg font-semibold">
                    🎉 Todos los ganadores han sido mostrados
                </div>
            )}

            <div className="flex gap-4">
                <Button onClick={() => router.back()}>
                    Volver
                </Button>

                <Button
                    onClick={handleSpin}
                    disabled={mustSpin || isFinished}
                >
                    {isFinished ? "Rifa finalizada" : "Girar"}
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="text-center max-w-md">
                    <DialogHeader>
                        <DialogTitle>🎉 ¡Tenemos un ganador!</DialogTitle>
                    </DialogHeader>

                    {winner && (
                        <div className="flex flex-col gap-3 mt-4 text-sm text-left">
                            <div>
                                <strong>Ganador:</strong>{" "}
                                {winner.winner_user?.name}
                            </div>

                            <div>
                                <strong>Email:</strong>{" "}
                                {winner.winner_user?.email}
                            </div>

                            <div>
                                <strong>Ticket:</strong>{" "}
                                {winner.winner_ticket}
                            </div>

                            <hr />

                            <div>
                                <strong>Premio:</strong>{" "}
                                {winner.prize_name}
                            </div>

                            <div>
                                <strong>Valor:</strong>{" "}
                                ${winner.value}
                            </div>


                            <div>
                                <strong>Rifa:</strong>{" "}
                                {winner.raffle_title}
                            </div>
                        </div>
                    )}

                    <Button className="mt-6" onClick={() => setOpen(false)}>
                        Cerrar
                    </Button>
                </DialogContent>
            </Dialog>
        </main>
    );
};

export default RaffleRoulettePage;